package com.reservo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for place autocomplete suggestions from Google Places API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceSuggestion {
    private String placeId;
    private String description;
    private StructuredFormatting structuredFormatting;
    private String[] terms;
    private String[] types;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StructuredFormatting {
        private String mainText;
        private String secondaryText;
        private String mainTextMatchedSubstrings;
    }
}