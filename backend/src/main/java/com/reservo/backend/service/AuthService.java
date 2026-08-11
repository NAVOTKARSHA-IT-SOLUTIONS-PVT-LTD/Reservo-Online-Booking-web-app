package com.reservo.backend.service;

import com.reservo.backend.security.JwtUtils;
import com.reservo.backend.dto.AuthRequestDTO;
import com.reservo.backend.dto.AuthResponseDTO;
import com.reservo.backend.dto.OtpVerificationDTO;
import com.reservo.backend.dto.ResetPasswordDTO;
import com.reservo.backend.exception.BadRequestException;
import com.reservo.backend.exception.DuplicateResourceException;
import com.reservo.backend.exception.UnauthorizedException;
import com.reservo.backend.entity.User;
import com.reservo.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
import com.reservo.backend.util.HtmlSanitizer;

import java.time.Instant;
import java.util.Map;
import java.security.SecureRandom;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();
    private final Map<String, Integer> otpAttempts = new ConcurrentHashMap<>();
    private static final int MAX_OTP_ATTEMPTS = 3;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Value("${app.otp.expiration-minutes:5}")
    private long otpExpirationMinutes;

    @Transactional
    public AuthResponseDTO registerUser(AuthRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already registered");
        }

        requireVerifiedOtp(request.getEmail(), request.getOtpCode());

        User.Role userRole = User.Role.ROLE_CUSTOMER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ROLE_OWNER")) {
            userRole = User.Role.ROLE_OWNER;
        }

        // HASH PASSWORD WITH ARGON2ID BEFORE STORING (Security Guide Requirement)
        User user = User.builder()
                .name(HtmlSanitizer.sanitize(request.getName() != null ? request.getName() : "Guest User"))
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword())) // Argon2id hashing
                .phone(HtmlSanitizer.sanitize(request.getPhone()))
                .role(userRole)
                .status(User.UserStatus.ACTIVE)
                .emailVerified(true) // Auto-verify after successful OTP
                .build();

        user = userRepository.save(user);
        otpStore.remove(request.getEmail());
        otpAttempts.remove(request.getEmail());

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponseDTO.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponseDTO authenticateUser(AuthRequestDTO request) {
        try {
            // Use Spring Security Authentication Manager with Argon2id verification
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("User not found"));
        
        // Update last login time
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponseDTO.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public String sendOtp(String email) {
        String otpCode = String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
        otpStore.put(email, new OtpRecord(otpCode, Instant.now().plusSeconds(otpExpirationMinutes * 60)));
        otpAttempts.remove(email);
        emailService.sendOtpEmail(email, otpCode);
        return "OTP sent successfully to " + email;
    }

    public String sendPasswordResetOtp(String email) {
        if (!userRepository.existsByEmail(email)) {
            // Return the same response to avoid revealing whether an account exists.
            return "If an account exists for this email, a password reset code has been sent.";
        }

        String otpCode = String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
        otpStore.put(email, new OtpRecord(otpCode, Instant.now().plusSeconds(otpExpirationMinutes * 60)));
        otpAttempts.remove(email);
        emailService.sendPasswordResetOtp(email, otpCode);
        return "If an account exists for this email, a password reset code has been sent.";
    }

    public boolean verifyOtp(OtpVerificationDTO verification) {
        String email = verification.getEmail();
        OtpRecord otpRecord = otpStore.get(email);
        if (otpRecord == null) {
            throw new BadRequestException("OTP not found. Please request a new OTP.");
        }
        if (otpRecord.expiresAt().isBefore(Instant.now())) {
            otpStore.remove(email);
            otpAttempts.remove(email);
            throw new BadRequestException("OTP has expired. Please request a new OTP.");
        }
        int attempts = otpAttempts.getOrDefault(email, 0);
        if (attempts >= MAX_OTP_ATTEMPTS) {
            otpStore.remove(email);
            otpAttempts.remove(email);
            throw new BadRequestException("Too many failed attempts. Please request a new OTP.");
        }
        
        if (otpRecord.code().equals(verification.getOtpCode())) {
            otpAttempts.remove(email);
            otpStore.put(email, otpRecord.markVerified());
            return true;
        }
        
        // Increment failed attempts
        otpAttempts.put(email, attempts + 1);
        int remainingAttempts = MAX_OTP_ATTEMPTS - (attempts + 1);
        throw new BadRequestException("Invalid OTP. " + remainingAttempts + " attempts remaining.");
    }

    private void requireVerifiedOtp(String email, String otpCode) {
        OtpRecord otpRecord = otpStore.get(email);
        if (otpCode == null || otpCode.isBlank() || otpRecord == null || otpRecord.expiresAt().isBefore(Instant.now())
                || !otpRecord.verified() || !otpRecord.code().equals(otpCode)) {
            throw new BadRequestException("Please verify a valid OTP before signing up.");
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordDTO request) {
        requireVerifiedOtp(request.getEmail(), request.getOtpCode());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Password reset request is invalid."));
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Your new password must be different from your current password.");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setAccountLocked(false);
        userRepository.save(user);
        otpStore.remove(request.getEmail());
        otpAttempts.remove(request.getEmail());
    }

    public AuthResponseDTO getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        return AuthResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    private record OtpRecord(String code, Instant expiresAt, boolean verified) {
        private OtpRecord(String code, Instant expiresAt) {
            this(code, expiresAt, false);
        }

        private OtpRecord markVerified() {
            return new OtpRecord(code, expiresAt, true);
        }
    }
}
