package com.reservo.backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.reservo.backend.entity.MapCoordinateStats;
import com.reservo.backend.entity.MapLocationLog;
import com.reservo.backend.service.MapLocationLogService;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/map-tracking")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class MapLocationTrackingController {

    private final MapLocationLogService trackingService;

    @Data
    public static class TrackLocationRequest {
        private Double latitude;
        private Double longitude;
        private String userId;
        private String userEmail;
        private String action;              // e.g. MAP_PIN_DROPPED, MAP_CLICKED, MAP_PIN_DRAGGED, PLACE_SELECTED
        private String googleMapsOperation; // e.g. google.maps.Marker(dragend), places.getPlaceDetails
        private String formattedAddress;
        private Map<String, Object> metadata;
    }

    /**
     * Record a Google Maps location operation in Firebase
     * POST /api/v1/map-tracking/log
     */
    @PostMapping("/log")
    public ResponseEntity<?> trackLocation(@RequestBody TrackLocationRequest request) {
        if (request == null || request.getLatitude() == null || request.getLongitude() == null) {
            Map<String, Object> errorResp = new HashMap<>();
            errorResp.put("success", false);
            errorResp.put("message", "Latitude and Longitude are required");
            return ResponseEntity.badRequest().body(errorResp);
        }

        // Extract user from Security context if not explicitly provided in body
        String resolvedUserId = request.getUserId();
        String resolvedUserEmail = request.getUserEmail();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if ((resolvedUserId == null || resolvedUserId.isBlank()) && auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            resolvedUserId = auth.getName();
            resolvedUserEmail = auth.getName();
        }

        trackingService.recordLocationOperation(
                request.getLatitude(),
                request.getLongitude(),
                resolvedUserId,
                resolvedUserEmail,
                request.getAction() != null ? request.getAction() : "MAP_INTERACTION",
                request.getGoogleMapsOperation() != null ? request.getGoogleMapsOperation() : "Google Maps Operation",
                request.getFormattedAddress(),
                request.getMetadata()
        );

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Location tracked and logged in Firebase");
        resp.put("latitude", request.getLatitude());
        resp.put("longitude", request.getLongitude());

        return ResponseEntity.ok(resp);
    }

    /**
     * Inspect usage statistics for a specific coordinate point from Firebase
     * GET /api/v1/map-tracking/stats?lat=18.5204&lng=73.8567
     * 
     * Answers:
     * - which coordinates were used
     * - when they were used
     * - which user triggered the operation
     * - how many times the point was used
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getCoordinateStats(
            @RequestParam Double lat,
            @RequestParam Double lng) {

        if (lat == null || lng == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "lat and lng are required"));
        }

        return trackingService.getCoordinateStats(lat, lng)
                .map(stats -> ResponseEntity.ok(Map.of("success", true, "data", stats)))
                .orElseGet(() -> ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "No usage logs recorded for this coordinate point yet",
                        "data", MapCoordinateStats.builder()
                                .latitude(lat)
                                .longitude(lng)
                                .usageCount(0L)
                                .build()
                )));
    }

    /**
     * Retrieve recent location interaction logs from Firebase
     * GET /api/v1/map-tracking/recent?limit=20
     */
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentLogs(@RequestParam(defaultValue = "20") int limit) {
        List<MapLocationLog> logs = trackingService.getRecentLogs(limit);
        return ResponseEntity.ok(Map.of("success", true, "data", logs, "count", logs.size()));
    }
}
