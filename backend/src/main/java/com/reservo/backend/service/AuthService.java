package com.reservo.backend.service;

import com.reservo.backend.security.JwtUtils;
import com.reservo.backend.dto.AuthRequestDTO;
import com.reservo.backend.dto.AuthResponseDTO;
import com.reservo.backend.dto.OtpVerificationDTO;
import com.reservo.backend.exception.BadRequestException;
import com.reservo.backend.exception.DuplicateResourceException;
import com.reservo.backend.exception.UnauthorizedException;
import com.reservo.backend.entity.User;
import com.reservo.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;

    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    @Transactional
    public AuthResponseDTO registerUser(AuthRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already registered");
        }

        User.Role userRole = User.Role.ROLE_CUSTOMER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ROLE_OWNER")) {
            userRole = User.Role.ROLE_OWNER;
        }

        User user = User.builder()
                .name(request.getName() != null ? request.getName() : "Guest User")
                .email(request.getEmail())
                .password(request.getPassword()) // Plain password
                .phone(request.getPhone())
                .role(userRole)
                .status(User.UserStatus.ACTIVE)
                .build();

        user = userRepository.save(user);

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
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

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
        String otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);
        otpStore.put(email, otpCode);
        emailService.sendOtpEmail(email, otpCode);
        return "OTP sent successfully to " + email;
    }

    public boolean verifyOtp(OtpVerificationDTO verification) {
        String cachedOtp = otpStore.get(verification.getEmail());
        if (cachedOtp != null && cachedOtp.equals(verification.getOtpCode())) {
            otpStore.remove(verification.getEmail());
            return true;
        }
        throw new BadRequestException("Invalid or expired OTP code");
    }
}
