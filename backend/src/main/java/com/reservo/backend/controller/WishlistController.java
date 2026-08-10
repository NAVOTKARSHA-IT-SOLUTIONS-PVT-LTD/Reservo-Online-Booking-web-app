package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.entity.Wishlist;
import com.reservo.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Wishlist>>> getWishlist() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(ApiResponse.success(wishlistService.getWishlistByUser(auth.getName())));
    }

    @PostMapping("/toggle/{resortId}")
    public ResponseEntity<ApiResponse<String>> toggleWishlist(@PathVariable Long resortId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String result = wishlistService.toggleWishlist(auth.getName(), resortId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> clearWishlist() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        wishlistService.clearWishlist(auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Wishlist cleared successfully"));
    }
}
