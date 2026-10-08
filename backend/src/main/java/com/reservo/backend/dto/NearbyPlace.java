package com.reservo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for nearby place information from Google Places API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NearbyPlace {
    private String name;
    private String vicinity;
    private Double rating;
    private String[] types;
    private Double latitude;
    private Double longitude;
    private String placeId;
    private Integer priceLevel;
    private String formattedAddress;
    private String phoneNumber;
    private String website;
    private Boolean permanentlyClosed;
}