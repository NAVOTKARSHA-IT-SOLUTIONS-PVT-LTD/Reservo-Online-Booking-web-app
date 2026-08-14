package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.dto.AuthRequestDTO;
import com.reservo.backend.dto.AuthResponseDTO;
import com.reservo.backend.dto.OtpVerificationDTO;
import com.reservo.backend.dto.ResetPasswordDTO;
import com.reservo.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> signup(@Valid @RequestBody AuthRequestDTO request) {
        AuthResponseDTO response = authService.registerUser(request);
        return ResponseEntity.ok(ApiResponse.success(response, "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody AuthRequestDTO request) {
        AuthResponseDTO response = authService.authenticateUser(request);
        return ResponseEntity.ok(ApiResponse.success(response, "User logged in successfully"));
    }

    @PostMapping("/otp/send")
    public ResponseEntity<ApiResponse<String>> sendOtp(@RequestParam String email) {
        String msg = authService.sendOtp(email);
        return ResponseEntity.ok(ApiResponse.success(msg));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponse<String>> verifyOtp(@Valid @RequestBody OtpVerificationDTO request) {
        authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.success("OTP verified successfully"));
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<ApiResponse<String>> requestPasswordReset(@RequestParam String email) {
        String data = authService.sendPasswordResetOtp(email);
        return ResponseEntity.ok(ApiResponse.success(data, "If an account exists, a reset code has been sent."));
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<ApiResponse<String>> confirmPasswordReset(@Valid @RequestBody ResetPasswordDTO request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully. You can now sign in."));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        // Client-side logout - JWT tokens are stateless
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> getCurrentUser() {
        AuthResponseDTO response = authService.getCurrentUserDetails();
        return ResponseEntity.ok(ApiResponse.success(response, "User details retrieved successfully"));
    }
}
