package com.reservo.backend.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.springframework.stereotype.Service;

import com.reservo.backend.entity.MapCoordinateStats;
import com.reservo.backend.entity.MapLocationLog;
import com.reservo.backend.repository.MapLocationLogRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MapLocationLogService {

    private final MapLocationLogRepository repository;

    /**
     * Record a Google Maps location operation in Firebase asynchronously.
     * Guaranteed not to throw or block the main application execution.
     */
    public CompletableFuture<MapLocationLog> recordLocationOperation(
            Double latitude,
            Double longitude,
            String userId,
            String userEmail,
            String action,
            String googleMapsOperation,
            String formattedAddress,
            Map<String, Object> metadata) {

        // Proper validation (Requirement 6)
        if (latitude == null || longitude == null) {
            log.warn("Cannot log map location operation: Latitude or Longitude is missing. Action: {}", action);
            return CompletableFuture.completedFuture(null);
        }

        if (Double.isNaN(latitude) || Double.isNaN(longitude)) {
            log.warn("Cannot log map location operation: Latitude or Longitude is NaN. Action: {}", action);
            return CompletableFuture.completedFuture(null);
        }

        return CompletableFuture.supplyAsync(() -> {
            try {
                MapLocationLog logEntry = MapLocationLog.builder()
                        .userId(userId != null && !userId.isBlank() ? userId : "anonymous")
                        .userEmail(userEmail != null ? userEmail : "")
                        .latitude(latitude)
                        .longitude(longitude)
                        .action(action != null ? action : "MAP_INTERACTION")
                        .googleMapsOperation(googleMapsOperation != null ? googleMapsOperation : "Google Maps API")
                        .formattedAddress(formattedAddress != null ? formattedAddress : "")
                        .metadata(metadata)
                        .build();

                // 1. Save detailed log to Firebase collection 'map_location_logs'
                MapLocationLog saved = repository.saveLog(logEntry);

                // 2. Increment coordinate usage statistics in Firebase collection 'map_coordinate_stats'
                repository.updateCoordinateStats(latitude, longitude, userId, action, formattedAddress);

                return saved;
            } catch (Exception e) {
                // Non-blocking error handling (Requirement 5 & 6)
                log.error("Failed to record location operation in Firebase: {}", e.getMessage(), e);
                return null;
            }
        });
    }

    /**
     * Query point usage to determine:
     * - which coordinates were used
     * - when they were used
     * - which user triggered the operation
     * - how many times the point was used (Requirement 4)
     */
    public Optional<MapCoordinateStats> getCoordinateStats(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) {
            return Optional.empty();
        }
        return repository.getCoordinateStats(latitude, longitude);
    }

    /**
     * Retrieve recent location interaction logs
     */
    public List<MapLocationLog> getRecentLogs(int limit) {
        try {
            return repository.getRecentLogs(limit > 0 ? limit : 20);
        } catch (Exception e) {
            log.warn("Error fetching recent location logs: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Retrieve logs for a specific coordinate point
     */
    public List<MapLocationLog> getLogsForCoordinate(Double latitude, Double longitude, int limit) {
        try {
            return repository.getLogsForCoordinate(latitude, longitude, limit > 0 ? limit : 20);
        } catch (Exception e) {
            log.warn("Error fetching coordinate location logs: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
