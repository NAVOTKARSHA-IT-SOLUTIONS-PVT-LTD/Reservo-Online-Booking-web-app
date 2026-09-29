package com.reservo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for detailed place information from Google Places API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceDetails {
    private String placeId;
    private String name;
    private String formattedAddress;
    private Double latitude;
    private Double longitude;
    private String formattedPhoneNumber;
    private String internationalPhoneNumber;
    private String website;
    private Double rating;
    private Integer userRatingsTotal;
    private String[] types;
    private String businessStatus;
    private String url;
    private Integer priceLevel;
    private String openingHours;
    private String[] photos;
    private String[] reviews;
    private String city;
    private String state;
    private String country;
    private String postalCode;
}