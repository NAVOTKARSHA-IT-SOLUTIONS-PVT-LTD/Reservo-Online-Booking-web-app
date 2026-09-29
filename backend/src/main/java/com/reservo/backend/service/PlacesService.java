package com.reservo.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.reservo.backend.dto.NearbyPlace;
import com.reservo.backend.dto.PlaceDetails;
import com.reservo.backend.dto.PlaceSuggestion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

/**
 * Service for interacting with Google Places API (New)
 * All API calls are made server-side using the Google Places API key
 */
@Service
@Slf4j
@lombok.RequiredArgsConstructor
public class PlacesService {

    private final MapLocationLogService trackingService;

    @Value("${app.google.places.api-key:}")
    private String googlePlacesApiKey;

    @Value("${app.rate-limit.places.requests-per-minute:20}")
    private int rateLimitPerMinute;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String PLACES_API_BASE = "https://places.googleapis.com/v1";
    private static final String AUTOCOMPLETE_URL = PLACES_API_BASE + "/places:autocomplete";
    private static final String PLACE_DETAILS_URL = PLACES_API_BASE + "/places/{placeId}";
    private static final String NEARBY_SEARCH_URL = PLACES_API_BASE + "/places:searchNearby";

    /**
     * Get place autocomplete suggestions
     * @param input Search query
     * @return List of place suggestions
     */
    @Cacheable(value = "placeSuggestions", key = "#input", unless = "#result == null || #result.isEmpty()")
    public List<PlaceSuggestion> getPlaceSuggestions(String input) {
        if (googlePlacesApiKey == null || googlePlacesApiKey.isEmpty()) {
            log.warn("Google Places API key not configured");
            return new ArrayList<>();
        }

        if (input == null || input.trim().length() < 3) {
            return new ArrayList<>();
        }

        try {
            String requestBody = objectMapper.writeValueAsString(java.util.Collections.singletonMap("input", input));
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("X-Goog-Api-Key", googlePlacesApiKey);
            headers.set("Content-Type", "application/json");

            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(requestBody, headers);
            org.springframework.http.ResponseEntity<String> response = restTemplate.exchange(
                AUTOCOMPLETE_URL,
                org.springframework.http.HttpMethod.POST,
                entity,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return parseAutocompleteResponse(response.getBody());
            }

        } catch (Exception e) {
            log.error("Error getting place suggestions for input: {}", input, e);
        }

        return new ArrayList<>();
    }

    /**
     * Get detailed information about a place
     * @param placeId Google Place ID
     * @return Place details
     */
    @Cacheable(value = "placeDetails", key = "#placeId", unless = "#result == null")
    public PlaceDetails getPlaceDetails(String placeId) {
        if (googlePlacesApiKey == null || googlePlacesApiKey.isEmpty()) {
            log.warn("Google Places API key not configured");
            return null;
        }

        if (placeId == null || placeId.trim().isEmpty()) {
            return null;
        }

        try {
            String url = PLACE_DETAILS_URL.replace("{placeId}", placeId);
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("X-Goog-Api-Key", googlePlacesApiKey);
            headers.set("Content-Type", "application/json");
            headers.set("X-Goog-FieldMask", "id,displayName,formattedAddress,location,nationalPhoneNumber,internationalPhoneNumber,websiteUri,rating,userRatingCount,types,businessStatus,priceLevel,currentOpeningHours,photos,reviews,addressComponents");

            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            org.springframework.http.ResponseEntity<String> response = restTemplate.exchange(
                url,
                org.springframework.http.HttpMethod.GET,
                entity,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                PlaceDetails details = parsePlaceDetailsResponse(response.getBody());
                if (details != null && details.getLatitude() != null && details.getLongitude() != null) {
                    trackingService.recordLocationOperation(
                        details.getLatitude(),
                        details.getLongitude(),
                        null,
                        null,
                        "PLACE_DETAILS_FETCHED",
                        "Google Places API New (places/{placeId})",
                        details.getFormattedAddress(),
                        java.util.Map.of("placeId", placeId, "name", details.getName() != null ? details.getName() : "")
                    );
                }
                return details;
            }

        } catch (Exception e) {
            log.error("Error getting place details for placeId: {}", placeId, e);
        }

        return null;
    }

    /**
     * Get nearby places around a location
     * @param latitude Latitude
     * @param longitude Longitude
     * @param radius Search radius in meters (default 1000m)
     * @return List of nearby places
     */
    @Cacheable(value = "nearbyPlaces", key = "#latitude + ',' + #longitude + ',' + #radius", unless = "#result == null || #result.isEmpty()")
    public List<NearbyPlace> getNearbyPlaces(Double latitude, Double longitude, Integer radius) {
        if (googlePlacesApiKey == null || googlePlacesApiKey.isEmpty()) {
            log.warn("Google Places API key not configured");
            return new ArrayList<>();
        }

        if (latitude == null || longitude == null) {
            return new ArrayList<>();
        }

        int searchRadius = (radius != null && radius > 0) ? radius : 1000;

        try {
            String requestBody = "{\"locationRestriction\":{\"circle\":{\"center\":{\"latitude\":" + latitude + ",\"longitude\":" + longitude + "},\"radius\":" + searchRadius + ".0}},\"includedTypes\":[\"tourist_attraction\",\"restaurant\",\"lodging\",\"shopping_mall\"],\"maxResultCount\":6}";

            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("X-Goog-Api-Key", googlePlacesApiKey);
            headers.set("Content-Type", "application/json");
            headers.set("X-Goog-FieldMask", "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.types,places.priceLevel,places.websiteUri,places.primaryType");

            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(requestBody, headers);
            org.springframework.http.ResponseEntity<String> response = restTemplate.exchange(
                NEARBY_SEARCH_URL,
                org.springframework.http.HttpMethod.POST,
                entity,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<NearbyPlace> places = parseNearbySearchResponse(response.getBody());
                trackingService.recordLocationOperation(
                    latitude,
                    longitude,
                    null,
                    null,
                    "NEARBY_SEARCH_PERFORMED",
                    "Google Places API New (places:searchNearby)",
                    null,
                    java.util.Map.of("radius", searchRadius, "resultsCount", places.size())
                );
                return places;
            }

        } catch (Exception e) {
            log.error("Error getting nearby places for location: {}, {}", latitude, longitude, e);
        }

        return new ArrayList<>();
    }

    /**
     * Parse autocomplete API response
     */
    private List<PlaceSuggestion> parseAutocompleteResponse(String responseBody) {
        List<PlaceSuggestion> suggestions = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode suggestionsNode = root.path("suggestions");
            
            for (JsonNode node : suggestionsNode) {
                JsonNode pred = node.has("placePrediction") ? node.path("placePrediction") : node;
                
                String placeId = pred.path("placeId").asText();
                if (placeId == null || placeId.isEmpty()) {
                    String placeResource = pred.path("place").asText();
                    if (placeResource != null && placeResource.startsWith("places/")) {
                        placeId = placeResource.substring("places/".length());
                    }
                }
                
                String description = pred.path("text").path("text").asText();
                if (description == null || description.isEmpty()) {
                    description = pred.path("formattedPrediction").asText();
                }
                
                PlaceSuggestion suggestion = PlaceSuggestion.builder()
                    .placeId(placeId)
                    .description(description)
                    .build();
                
                JsonNode structuredFormat = pred.path("structuredFormat");
                if (structuredFormat != null && !structuredFormat.isMissingNode()) {
                    String mainText = structuredFormat.path("mainText").has("text") 
                        ? structuredFormat.path("mainText").path("text").asText()
                        : structuredFormat.path("mainText").asText();
                    String secText = structuredFormat.path("secondaryText").has("text")
                        ? structuredFormat.path("secondaryText").path("text").asText()
                        : structuredFormat.path("secondaryText").asText();

                    PlaceSuggestion.StructuredFormatting formatting = PlaceSuggestion.StructuredFormatting.builder()
                        .mainText(mainText)
                        .secondaryText(secText)
                        .build();
                    suggestion.setStructuredFormatting(formatting);
                }
                
                suggestions.add(suggestion);
            }
        } catch (Exception e) {
            log.error("Error parsing autocomplete response", e);
        }
        return suggestions;
    }

    /**
     * Parse place details API response
     */
    private PlaceDetails parsePlaceDetailsResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            
            JsonNode location = root.path("location");
            JsonNode displayName = root.path("displayName");
            JsonNode nationalPhone = root.path("nationalPhoneNumber");
            JsonNode intlPhone = root.path("internationalPhoneNumber");

            String phoneStr = nationalPhone.has("text") ? nationalPhone.path("text").asText() : (nationalPhone.isTextual() ? nationalPhone.asText() : "");
            String intlPhoneStr = intlPhone.has("text") ? intlPhone.path("text").asText() : (intlPhone.isTextual() ? intlPhone.asText() : "");

            // Extract structured address details from addressComponents
            String city = null;
            String state = null;
            String country = "India";
            String postalCode = null;

            JsonNode components = root.path("addressComponents");
            if (components.isArray()) {
                for (JsonNode comp : components) {
                    JsonNode types = comp.path("types");
                    String longText = comp.path("longText").asText();
                    if (types.isArray()) {
                        for (JsonNode t : types) {
                            String type = t.asText();
                            if ("locality".equals(type) && (city == null || city.isEmpty())) {
                                city = longText;
                            } else if ("administrative_area_level_2".equals(type) && (city == null || city.isEmpty())) {
                                city = longText;
                            } else if ("administrative_area_level_1".equals(type)) {
                                state = longText;
                            } else if ("country".equals(type)) {
                                country = longText;
                            } else if ("postal_code".equals(type)) {
                                postalCode = longText;
                            }
                        }
                    }
                }
            }

            return PlaceDetails.builder()
                .placeId(root.path("id").asText())
                .name(displayName.path("text").asText())
                .formattedAddress(root.path("formattedAddress").asText())
                .latitude(location.path("latitude").asDouble())
                .longitude(location.path("longitude").asDouble())
                .formattedPhoneNumber(phoneStr)
                .internationalPhoneNumber(intlPhoneStr)
                .website(root.path("websiteUri").asText())
                .rating(root.path("rating").asDouble())
                .userRatingsTotal(root.path("userRatingCount").asInt())
                .businessStatus(root.path("businessStatus").asText())
                .priceLevel(root.path("priceLevel").asInt())
                .city(city)
                .state(state)
                .country(country)
                .postalCode(postalCode)
                .build();
        } catch (Exception e) {
            log.error("Error parsing place details response", e);
        }
        return null;
    }

    /**
     * Parse nearby search API response
     */
    private List<NearbyPlace> parseNearbySearchResponse(String responseBody) {
        List<NearbyPlace> places = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode placesNode = root.path("places");
            
            for (JsonNode placeNode : placesNode) {
                JsonNode location = placeNode.path("location");
                JsonNode displayName = placeNode.path("displayName");
                JsonNode phoneNumber = placeNode.path("phoneNumber");
                
                NearbyPlace place = NearbyPlace.builder()
                    .name(displayName.path("text").asText())
                    .vicinity(placeNode.path("formattedAddress").asText())
                    .rating(placeNode.path("rating").asDouble())
                    .latitude(location.path("latitude").asDouble())
                    .longitude(location.path("longitude").asDouble())
                    .placeId(placeNode.path("id").asText())
                    .priceLevel(placeNode.path("priceLevel").asInt())
                    .formattedAddress(placeNode.path("formattedAddress").asText())
                    .phoneNumber(phoneNumber.path("text").asText())
                    .website(placeNode.path("websiteUri").asText())
                    .build();
                
                places.add(place);
            }
        } catch (Exception e) {
            log.error("Error parsing nearby search response", e);
        }
        return places;
    }

    /**
     * Check if Google Places API is configured
     */
    public boolean isConfigured() {
        return googlePlacesApiKey != null && !googlePlacesApiKey.isEmpty();
    }
}