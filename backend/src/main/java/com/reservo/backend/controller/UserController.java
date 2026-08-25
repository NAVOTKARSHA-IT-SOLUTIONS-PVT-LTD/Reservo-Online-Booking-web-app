package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.entity.User;
import com.reservo.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<User>> updateProfile(@RequestBody Map<String, String> body) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = body.get("name");
        String phone = body.get("phone");
        User updated = userService.updateProfile(auth.getName(), name, phone);
        return ResponseEntity.ok(ApiResponse.success(updated, "Profile updated successfully"));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody Map<String, String> body) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        userService.changePassword(auth.getName(), oldPassword, newPassword);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    @PostMapping("/verify-kyc")
    public ResponseEntity<ApiResponse<User>> verifyKyc(@RequestBody Map<String, String> body) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String documentType = body.get("documentType");
        String documentUrl = body.get("documentUrl");

        User user = userService.getUserByEmail(auth.getName());
        user.setKycStatus(User.KycStatus.VERIFIED);
        user.setKycDocumentType(documentType != null ? documentType : "Govt ID");
        user.setKycDocumentUrl(documentUrl != null ? documentUrl : "mock://kyc-document-verification");

        User updated = userService.saveUser(user);
        return ResponseEntity.ok(ApiResponse.success(updated, "KYC verified successfully"));
    }
}
