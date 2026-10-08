package com.reservo.backend.entity;

import java.time.Instant;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity stored in Firebase Firestore collection: 'map_location_logs'
 * Records every Google Maps coordinate interaction and API operation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MapLocationLog {
    private String id;
    private String userId;
    private String userEmail;
    private Double latitude;
    private Double longitude;
    private String coordinateKey;       // Normalized "lat,lng" for easy indexing and lookup
    private String action;              // e.g. MAP_PIN_DROPPED, MAP_PIN_DRAGGED, MAP_CLICKED, PLACE_SELECTED, CURRENT_LOCATION_DETECTED, VIEW_MAP, NEARBY_SEARCH
    private String googleMapsOperation; // e.g. google.maps.Marker(dragend), google.maps.Map(click), places:autocomplete, places:details, places:searchNearby
    private String formattedAddress;
    private String timestamp;           // ISO-8601 string representation of when the action occurred
    private Long epochMilli;
    private Map<String, Object> metadata;
}
