package com.reservo.backend.entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity stored in Firebase Firestore collection: 'map_coordinate_stats'
 * Aggregates frequency and usage history for specific latitude/longitude points.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MapCoordinateStats {
    private String coordinateKey;     // Normalized "lat,lng" (formatted to 5 decimal places)
    private Double latitude;
    private Double longitude;
    private Long usageCount;          // Total number of times this coordinate point was used
    private String firstUsedAt;       // ISO-8601 timestamp
    private String lastUsedAt;        // ISO-8601 timestamp
    private String lastUserId;        // User ID who last triggered an operation with this point
    private String lastAction;        // Action last performed
    private String lastAddress;       // Last known formatted address
    private List<String> recentUsers; // List of recent user IDs
}
