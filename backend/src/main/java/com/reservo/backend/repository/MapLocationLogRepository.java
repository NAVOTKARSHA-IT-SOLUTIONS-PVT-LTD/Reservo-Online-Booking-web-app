package com.reservo.backend.repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.reservo.backend.entity.MapCoordinateStats;
import com.reservo.backend.entity.MapLocationLog;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class MapLocationLogRepository {

    public static final String LOGS_COLLECTION = "map_location_logs";
    public static final String STATS_COLLECTION = "map_coordinate_stats";

    private final Firestore firestore;

    public MapLocationLogRepository(Firestore firestore) {
        this.firestore = firestore;
    }

    /**
     * Normalize coordinate key to 5 decimal places (~1.1 meter accuracy)
     * e.g. "18.52040,73.85670"
     */
    public static String toCoordinateKey(Double lat, Double lng) {
        if (lat == null || lng == null) return "0.00000,0.00000";
        return String.format(Locale.US, "%.5f,%.5f", lat, lng);
    }

    /**
     * Record a new location operation log in Firestore collection 'map_location_logs'
     */
    public MapLocationLog saveLog(MapLocationLog locationLog) {
        if (locationLog.getId() == null || locationLog.getId().isBlank()) {
            locationLog.setId(firestore.collection(LOGS_COLLECTION).document().getId());
        }

        if (locationLog.getTimestamp() == null) {
            locationLog.setTimestamp(Instant.now().toString());
        }

        if (locationLog.getEpochMilli() == null) {
            locationLog.setEpochMilli(Instant.now().toEpochMilli());
        }

        if (locationLog.getCoordinateKey() == null && locationLog.getLatitude() != null && locationLog.getLongitude() != null) {
            locationLog.setCoordinateKey(toCoordinateKey(locationLog.getLatitude(), locationLog.getLongitude()));
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", locationLog.getId());
        data.put("userId", locationLog.getUserId() != null ? locationLog.getUserId() : "anonymous");
        data.put("userEmail", locationLog.getUserEmail() != null ? locationLog.getUserEmail() : "");
        data.put("latitude", locationLog.getLatitude());
        data.put("longitude", locationLog.getLongitude());
        data.put("coordinateKey", locationLog.getCoordinateKey());
        data.put("action", locationLog.getAction());
        data.put("googleMapsOperation", locationLog.getGoogleMapsOperation());
        data.put("formattedAddress", locationLog.getFormattedAddress() != null ? locationLog.getFormattedAddress() : "");
        data.put("timestamp", locationLog.getTimestamp());
        data.put("epochMilli", locationLog.getEpochMilli());
        if (locationLog.getMetadata() != null) {
            data.put("metadata", locationLog.getMetadata());
        }

        try {
            log.info("🔥 [FIREBASE FIRESTORE WRITE] Saving Location Log -> Action: {}, Op: {}, Lat: {}, Lng: {}, User: {}",
                    locationLog.getAction(), locationLog.getGoogleMapsOperation(), locationLog.getLatitude(), locationLog.getLongitude(), locationLog.getUserId());
            
            firestore.collection(LOGS_COLLECTION)
                    .document(locationLog.getId())
                    .set(data)
                    .get(5, TimeUnit.SECONDS);

            return locationLog;
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("Failed to write map location log to Firestore: {}", e.getMessage());
            return locationLog;
        }
    }

    /**
     * Increment the point usage counter and update the stats document for this coordinate
     */
    public MapCoordinateStats updateCoordinateStats(Double lat, Double lng, String userId, String action, String address) {
        if (lat == null || lng == null) return null;

        String coordKey = toCoordinateKey(lat, lng);
        String docId = coordKey.replace(".", "_").replace(",", "_");
        DocumentReference docRef = firestore.collection(STATS_COLLECTION).document(docId);

        try {
            DocumentSnapshot snapshot = docRef.get().get(5, TimeUnit.SECONDS);
            String nowStr = Instant.now().toString();

            if (snapshot.exists()) {
                Long currentCount = snapshot.getLong("usageCount");
                long newCount = (currentCount != null ? currentCount : 0L) + 1L;

                Map<String, Object> updates = new HashMap<>();
                updates.put("usageCount", newCount);
                updates.put("lastUsedAt", nowStr);
                updates.put("lastUserId", userId != null ? userId : "anonymous");
                updates.put("lastAction", action != null ? action : "");
                if (address != null && !address.isBlank()) {
                    updates.put("lastAddress", address);
                }

                @SuppressWarnings("unchecked")
                List<String> recentUsers = (List<String>) snapshot.get("recentUsers");
                if (recentUsers == null) recentUsers = new ArrayList<>();
                if (userId != null && !recentUsers.contains(userId)) {
                    recentUsers.add(0, userId);
                    if (recentUsers.size() > 5) {
                        recentUsers = recentUsers.subList(0, 5);
                    }
                    updates.put("recentUsers", recentUsers);
                }

                docRef.update(updates).get(5, TimeUnit.SECONDS);

                return MapCoordinateStats.builder()
                        .coordinateKey(coordKey)
                        .latitude(lat)
                        .longitude(lng)
                        .usageCount(newCount)
                        .firstUsedAt(snapshot.getString("firstUsedAt"))
                        .lastUsedAt(nowStr)
                        .lastUserId(userId)
                        .lastAction(action)
                        .lastAddress(address)
                        .recentUsers(recentUsers)
                        .build();

            } else {
                List<String> recentUsers = new ArrayList<>();
                if (userId != null) recentUsers.add(userId);

                Map<String, Object> data = new HashMap<>();
                data.put("coordinateKey", coordKey);
                data.put("latitude", lat);
                data.put("longitude", lng);
                data.put("usageCount", 1L);
                data.put("firstUsedAt", nowStr);
                data.put("lastUsedAt", nowStr);
                data.put("lastUserId", userId != null ? userId : "anonymous");
                data.put("lastAction", action != null ? action : "");
                data.put("lastAddress", address != null ? address : "");
                data.put("recentUsers", recentUsers);

                docRef.set(data).get(5, TimeUnit.SECONDS);

                return MapCoordinateStats.builder()
                        .coordinateKey(coordKey)
                        .latitude(lat)
                        .longitude(lng)
                        .usageCount(1L)
                        .firstUsedAt(nowStr)
                        .lastUsedAt(nowStr)
                        .lastUserId(userId)
                        .lastAction(action)
                        .lastAddress(address)
                        .recentUsers(recentUsers)
                        .build();
            }

        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.error("Failed to update coordinate stats in Firestore: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Retrieve aggregated usage stats for a specific coordinate point
     */
    public Optional<MapCoordinateStats> getCoordinateStats(Double lat, Double lng) {
        if (lat == null || lng == null) return Optional.empty();

        String coordKey = toCoordinateKey(lat, lng);
        String docId = coordKey.replace(".", "_").replace(",", "_");

        try {
            DocumentSnapshot snap = firestore.collection(STATS_COLLECTION).document(docId).get().get(5, TimeUnit.SECONDS);
            if (!snap.exists()) return Optional.empty();

            @SuppressWarnings("unchecked")
            List<String> recentUsers = (List<String>) snap.get("recentUsers");

            MapCoordinateStats stats = MapCoordinateStats.builder()
                    .coordinateKey(snap.getString("coordinateKey"))
                    .latitude(snap.getDouble("latitude"))
                    .longitude(snap.getDouble("longitude"))
                    .usageCount(snap.getLong("usageCount"))
                    .firstUsedAt(snap.getString("firstUsedAt"))
                    .lastUsedAt(snap.getString("lastUsedAt"))
                    .lastUserId(snap.getString("lastUserId"))
                    .lastAction(snap.getString("lastAction"))
                    .lastAddress(snap.getString("lastAddress"))
                    .recentUsers(recentUsers)
                    .build();

            return Optional.of(stats);
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.warn("Failed to get coordinate stats from Firestore: {}", e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Retrieve the most recent location logs from Firestore
     */
    public List<MapLocationLog> getRecentLogs(int limit) {
        List<MapLocationLog> list = new ArrayList<>();
        try {
            var querySnapshot = firestore.collection(LOGS_COLLECTION)
                    .orderBy("epochMilli", Query.Direction.DESCENDING)
                    .limit(limit)
                    .get()
                    .get(5, TimeUnit.SECONDS);

            for (QueryDocumentSnapshot doc : querySnapshot) {
                MapLocationLog logEntry = MapLocationLog.builder()
                        .id(doc.getString("id"))
                        .userId(doc.getString("userId"))
                        .userEmail(doc.getString("userEmail"))
                        .latitude(doc.getDouble("latitude"))
                        .longitude(doc.getDouble("longitude"))
                        .coordinateKey(doc.getString("coordinateKey"))
                        .action(doc.getString("action"))
                        .googleMapsOperation(doc.getString("googleMapsOperation"))
                        .formattedAddress(doc.getString("formattedAddress"))
                        .timestamp(doc.getString("timestamp"))
                        .epochMilli(doc.getLong("epochMilli"))
                        .build();

                list.add(logEntry);
            }
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.warn("Failed to read recent logs from Firestore: {}", e.getMessage());
        }
        return list;
    }

    /**
     * Retrieve history of logs for a specific coordinate
     */
    public List<MapLocationLog> getLogsForCoordinate(Double lat, Double lng, int limit) {
        List<MapLocationLog> list = new ArrayList<>();
        if (lat == null || lng == null) return list;

        String coordKey = toCoordinateKey(lat, lng);

        try {
            var querySnapshot = firestore.collection(LOGS_COLLECTION)
                    .whereEqualTo("coordinateKey", coordKey)
                    .limit(limit)
                    .get()
                    .get(5, TimeUnit.SECONDS);

            for (QueryDocumentSnapshot doc : querySnapshot) {
                MapLocationLog logEntry = MapLocationLog.builder()
                        .id(doc.getString("id"))
                        .userId(doc.getString("userId"))
                        .userEmail(doc.getString("userEmail"))
                        .latitude(doc.getDouble("latitude"))
                        .longitude(doc.getDouble("longitude"))
                        .coordinateKey(doc.getString("coordinateKey"))
                        .action(doc.getString("action"))
                        .googleMapsOperation(doc.getString("googleMapsOperation"))
                        .formattedAddress(doc.getString("formattedAddress"))
                        .timestamp(doc.getString("timestamp"))
                        .epochMilli(doc.getLong("epochMilli"))
                        .build();

                list.add(logEntry);
            }
        } catch (InterruptedException | ExecutionException | TimeoutException e) {
            log.warn("Failed to read coordinate logs from Firestore: {}", e.getMessage());
        }
        return list;
    }
}
