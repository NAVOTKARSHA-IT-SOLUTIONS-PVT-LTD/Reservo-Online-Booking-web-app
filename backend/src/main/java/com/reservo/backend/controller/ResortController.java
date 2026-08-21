package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.entity.Resort;
import com.reservo.backend.service.ResortService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resorts")
@RequiredArgsConstructor
public class ResortController {

    private final ResortService resortService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Resort>>> getAllResorts() {
        return ResponseEntity.ok(ApiResponse.success(resortService.getAllApprovedResorts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Resort>> getResortById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(resortService.getResortById(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Resort>>> searchResorts(
        @RequestParam String search) {

    return ResponseEntity.ok(
            ApiResponse.success(
                    resortService.searchResorts(search)
            )
        );
    }
    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<Resort>>> filterResorts(
        @RequestParam(required = false) String location,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(required = false) Double minRating) {

        return ResponseEntity.ok(
            ApiResponse.success(
                    resortService.filterResorts(
                            location,
                            minPrice,
                            maxPrice,
                            minRating
                    )
            )
    );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Resort>> createResort(@RequestBody Resort resort) {
        Resort created = resortService.createResort(resort);
        return ResponseEntity.ok(ApiResponse.success(created, "Resort submitted for approval"));
    }
}
