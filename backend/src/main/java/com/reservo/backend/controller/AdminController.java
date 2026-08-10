package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.entity.*;
import com.reservo.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers()));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @PathVariable Long id,
            @RequestParam User.UserStatus status,
            @RequestParam(required = false, defaultValue = "Admin") String adminName) {
        User updated = adminService.updateUserStatus(id, status, adminName);
        return ResponseEntity.ok(ApiResponse.success(updated, "User status updated successfully"));
    }

    @GetMapping("/resorts/pending")
    public ResponseEntity<ApiResponse<List<Resort>>> getPendingResorts() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getPendingResorts()));
    }

    @PatchMapping("/resorts/{id}/status")
    public ResponseEntity<ApiResponse<Resort>> updateResortStatus(
            @PathVariable Long id,
            @RequestParam Resort.ResortStatus status,
            @RequestParam(required = false, defaultValue = "Admin") String adminName) {
        Resort updated = adminService.updateResortStatus(id, status, adminName);
        return ResponseEntity.ok(ApiResponse.success(updated, "Resort status updated successfully"));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllBookings()));
    }

    @PatchMapping("/bookings/{id}/cancel")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Admin") String adminName) {
        Booking cancelled = adminService.cancelBookingByAdmin(id, adminName);
        return ResponseEntity.ok(ApiResponse.success(cancelled, "Booking cancelled by admin successfully"));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AdminAuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getRecentAuditLogs()));
    }
}
