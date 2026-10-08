package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.dto.PageResponseDTO;
import com.reservo.backend.dto.ResortCardDTO;
import com.reservo.backend.entity.Resort;
import com.reservo.backend.service.ResortService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/resorts")
@RequiredArgsConstructor
public class ResortController {

    private final ResortService resortService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResortCardDTO>>> getAllResorts(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        List<ResortCardDTO> all = resortService.getAllApprovedResortCards();
        int total = all.size();
        List<ResortCardDTO> paged = ResortService.paginate(all, page, size);

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(total));
        if (size != null && size > 0) {
            headers.add("X-Page-Number", String.valueOf(page != null ? page : 0));
            headers.add("X-Page-Size", String.valueOf(size));
            headers.add("X-Total-Pages", String.valueOf((int) Math.ceil((double) total / size)));
        }

        return ResponseEntity.ok()
                .headers(headers)
                .body(ApiResponse.success(paged));
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<PageResponseDTO<ResortCardDTO>>> getPagedResorts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        List<ResortCardDTO> all = resortService.getAllApprovedResortCards();
        PageResponseDTO<ResortCardDTO> pageResponse = PageResponseDTO.of(all, page, size);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Resort>> getResortById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(resortService.getResortById(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ResortCardDTO>>> searchResorts(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        String searchTerm = (search != null && !search.isBlank()) ? search
                : (location != null && !location.isBlank()) ? location
                : (query != null && !query.isBlank()) ? query : "";

        List<ResortCardDTO> all = resortService.searchResortCards(searchTerm);
        int total = all.size();
        List<ResortCardDTO> paged = ResortService.paginate(all, page, size);

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(total));
        if (size != null && size > 0) {
            headers.add("X-Page-Number", String.valueOf(page != null ? page : 0));
            headers.add("X-Page-Size", String.valueOf(size));
            headers.add("X-Total-Pages", String.valueOf((int) Math.ceil((double) total / size)));
        }

        return ResponseEntity.ok()
                .headers(headers)
                .body(ApiResponse.success(paged));
    }

    @GetMapping("/filter")
    public ResponseEntity<ApiResponse<List<ResortCardDTO>>> filterResorts(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {

        List<ResortCardDTO> all = resortService.filterResortCards(
                location,
                minPrice,
                maxPrice,
                minRating
        );
        int total = all.size();
        List<ResortCardDTO> paged = ResortService.paginate(all, page, size);

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Total-Count", String.valueOf(total));
        if (size != null && size > 0) {
            headers.add("X-Page-Number", String.valueOf(page != null ? page : 0));
            headers.add("X-Page-Size", String.valueOf(size));
            headers.add("X-Total-Pages", String.valueOf((int) Math.ceil((double) total / size)));
        }

        return ResponseEntity.ok()
                .headers(headers)
                .body(ApiResponse.success(paged));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Resort>> createResort(@RequestBody Resort resort) {
        Resort created = resortService.createResort(resort);
        return ResponseEntity.ok(ApiResponse.success(created, "Resort submitted for approval"));
    }

    @GetMapping("/admin-all")
    public ResponseEntity<ApiResponse<List<Resort>>> getAdminAllResorts() {
        return ResponseEntity.ok(ApiResponse.success(resortService.getAllResortsForAdmin()));
    }

    @PostMapping("/update-status")
    public ResponseEntity<ApiResponse<Resort>> updateResortStatus(
            @RequestParam String resortId,
            @RequestParam Resort.ResortStatus status) {
        Resort updated = resortService.updateResortStatus(resortId, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Resort status updated successfully"));
    }

    @PostMapping("/request-changes")
    public ResponseEntity<ApiResponse<Resort>> requestChanges(
            @RequestParam String resortId,
            @RequestBody Map<String, String> body) {
        String comment = body.get("comment");
        Resort updated = resortService.requestChanges(resortId, comment);
        return ResponseEntity.ok(ApiResponse.success(updated, "Changes requested successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Resort>> updateResort(
            @PathVariable String id,
            @RequestBody Resort resort) {

        Resort updated = resortService.updateResortByOwner(id, resort);

        return ResponseEntity.ok(
                ApiResponse.success(
                        updated,
                        "Property updated and submitted for Admin approval"
                )
        );
    }

    @GetMapping("/my-properties")
    public ResponseEntity<ApiResponse<List<Resort>>> getMyProperties() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        List<Resort> myResorts = resortService.getResortsByOwnerEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(myResorts, "Owner properties retrieved successfully"));
    }
}
