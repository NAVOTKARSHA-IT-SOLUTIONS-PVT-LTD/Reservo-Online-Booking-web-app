package com.reservo.backend.controller;

import com.reservo.backend.dto.NearbyPlace;
import com.reservo.backend.dto.PlaceDetails;
import com.reservo.backend.dto.PlaceSuggestion;
import com.reservo.backend.service.PlacesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Google Places API integration
 * Provides endpoints for place autocomplete, details, and nearby search
 */
@RestController
@RequestMapping("/api/v1/places")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class PlacesController {

    private final PlacesService placesService;

    /**
     * Get place autocomplete suggestions
     * GET /api/v1/places/autocomplete?input=search+query
     */
    @GetMapping("/autocomplete")
    public ResponseEntity<?> getAutocompleteSuggestions(@RequestParam String input) {
        if (!placesService.isConfigured()) {
            return ResponseEntity.badRequest().body(
                new ApiResponse(false, "Google Places API key not configured", null)
            );
        }

        if (input == null || input.trim().length() < 3) {
            return ResponseEntity.badRequest().body(
                new ApiResponse(false, "Input must be at least 3 characters", null)
            );
        }

        try {
            List<PlaceSuggestion> suggestions = placesService.getPlaceSuggestions(input);
            return ResponseEntity.ok(new ApiResponse(true, "Suggestions retrieved successfully", suggestions));
        } catch (Exception e) {
            log.error("Error getting autocomplete suggestions", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to get suggestions", null)
            );
        }
    }

    /**
     * Get detailed information about a place
     * GET /api/v1/places/details?placeId=place_id
     */
    @GetMapping("/details")
    public ResponseEntity<?> getPlaceDetails(@RequestParam String placeId) {
        if (!placesService.isConfigured()) {
            return ResponseEntity.badRequest().body(
                new ApiResponse(false, "Google Places API key not configured", null)
            );
        }

        if (placeId == null || placeId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                new ApiResponse(false, "Place ID is required", null)
            );
        }

        try {
            PlaceDetails details = placesService.getPlaceDetails(placeId);
            if (details == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(new ApiResponse(true, "Place details retrieved successfully", details));
        } catch (Exception e) {
            log.error("Error getting place details", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to get place details", null)
            );
        }
    }

    /**
     * Get detailed information about a place by path ID
     * GET /api/v1/places/{placeId}
     */
    @GetMapping("/{placeId}")
    public ResponseEntity<?> getPlaceDetailsById(@PathVariable String placeId) {
        return getPlaceDetails(placeId);
    }

    /**
     * Get nearby places around a location
     * GET /api/v1/places/nearby?lat=latitude&lng=longitude&radius=1000
     */
    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyPlaces(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(required = false) Integer radius) {
        
        if (!placesService.isConfigured()) {
            return ResponseEntity.badRequest().body(
                new ApiResponse(false, "Google Places API key not configured", null)
            );
        }

        if (lat == null || lng == null) {
            return ResponseEntity.badRequest().body(
                new ApiResponse(false, "Latitude and longitude are required", null)
            );
        }

        try {
            List<NearbyPlace> nearbyPlaces = placesService.getNearbyPlaces(lat, lng, radius);
            return ResponseEntity.ok(new ApiResponse(true, "Nearby places retrieved successfully", nearbyPlaces));
        } catch (Exception e) {
            log.error("Error getting nearby places", e);
            return ResponseEntity.internalServerError().body(
                new ApiResponse(false, "Failed to get nearby places", null)
            );
        }
    }

    /**
     * Health check endpoint for Places API
     * GET /api/v1/places/health
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        boolean configured = placesService.isConfigured();
        return ResponseEntity.ok(new ApiResponse(
            true, 
            configured ? "Places API is configured" : "Places API key not configured", 
            configured
        ));
    }

    /**
     * Generic API response wrapper
     */
    @lombok.Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    private static class ApiResponse {
        private boolean success;
        private String message;
        private Object data;
    }
}