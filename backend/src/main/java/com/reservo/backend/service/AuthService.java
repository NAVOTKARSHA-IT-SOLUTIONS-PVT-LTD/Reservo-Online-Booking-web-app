package com.reservo.backend.service;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.firebase.auth.FirebaseToken;
import com.reservo.backend.dto.AuthRequestDTO;
import com.reservo.backend.dto.AuthResponseDTO;
import com.reservo.backend.dto.OtpVerificationDTO;
import com.reservo.backend.dto.PhoneAuthRegisterDTO;
import com.reservo.backend.dto.PhoneAuthRequestDTO;
import com.reservo.backend.dto.ResetPasswordDTO;
import com.reservo.backend.dto.SocialAuthRequestDTO;
import com.reservo.backend.entity.User;
import com.reservo.backend.exception.BadRequestException;
import com.reservo.backend.exception.DuplicateResourceException;
import com.reservo.backend.exception.UnauthorizedException;
import com.reservo.backend.repository.UserRepository;
import com.reservo.backend.security.JwtUtils;
import com.reservo.backend.util.HtmlSanitizer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final FirebaseService firebaseService;

    // ============================================================
    // OTP STORAGE
    // ============================================================

    private final Map<String, OtpRecord> otpStore =
            new ConcurrentHashMap<>();

    private final Map<String, Integer> otpAttempts =
            new ConcurrentHashMap<>();

    private static final int MAX_OTP_ATTEMPTS = 3;

    private static final SecureRandom SECURE_RANDOM =
            new SecureRandom();

    @Value("${app.otp.expiration-minutes:5}")
    private long otpExpirationMinutes;


    // ============================================================
    // EMAIL SIGNUP
    // ============================================================

    public AuthResponseDTO registerUser(AuthRequestDTO request) {

        if (request == null) {
            throw new BadRequestException(
                    "Registration request cannot be empty"
            );
        }

        String email = normalizeEmail(request.getEmail());

        if (email == null || email.isBlank()) {
            throw new BadRequestException(
                    "Email is required"
            );
        }

        if (request.getPassword() == null
                || request.getPassword().isBlank()) {

            throw new BadRequestException(
                    "Password is required"
            );
        }

        // Check duplicate email
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException(
                    "Email '" + email + "' is already registered"
            );
        }

        // OTP must be verified
        requireVerifiedOtp(
                email,
                request.getOtpCode()
        );

        // Default customer role
        User.Role userRole = User.Role.ROLE_CUSTOMER;

        // Allow owner registration
        if (request.getRole() != null
                && request.getRole()
                        .equalsIgnoreCase("ROLE_OWNER")) {

            userRole = User.Role.ROLE_OWNER;
        }

        String name = request.getName();

        if (name == null || name.isBlank()) {
            name = "Guest User";
        }

        name = HtmlSanitizer.sanitize(name);

        String phone = normalizePhoneNumber(
                request.getPhone()
        );

        // Create Firestore User
        User user = User.builder()
                .name(name)
                .email(email)
                .passwordHash(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .phone(phone)
                .role(userRole)
                .status(User.UserStatus.ACTIVE)
                .emailVerified(true)
                .phoneVerified(phone != null)
                .lastLoginAt(Instant.now())
                .providerData(new ArrayList<>()) // Initialize empty providerData
                .build();

        user = userRepository.save(user);

        // Remove OTP
        otpStore.remove(email);
        otpAttempts.remove(email);

        // Generate JWT
        String token = jwtUtils.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        log.info(
                "User registered successfully: {}",
                user.getEmail()
        );

        return buildAuthResponse(user, token);
    }


    // ============================================================
    // EMAIL LOGIN
    // ============================================================

    public AuthResponseDTO authenticateUser(
            AuthRequestDTO request) {

        if (request == null) {
            throw new UnauthorizedException(
                    "Invalid login request"
            );
        }

        String email = normalizeEmail(
                request.getEmail()
        );

        if (email == null || email.isBlank()) {
            throw new UnauthorizedException(
                    "Email is required"
            );
        }

        if (request.getPassword() == null
                || request.getPassword().isBlank()) {

            throw new UnauthorizedException(
                    "Password is required"
            );
        }

        log.info(
                "Login attempt for email: {}",
                email
        );

        // Find user from Firestore
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UnauthorizedException(
                                "Invalid email or password"
                        )
                );

        // Check status
        if (user.getStatus() != User.UserStatus.ACTIVE) {

            throw new UnauthorizedException(
                    "Your account is not active"
            );
        }

        // Check password
        String storedPasswordHash =
                user.getPasswordHash();

        if (storedPasswordHash == null
                || storedPasswordHash.isBlank()) {

            log.error(
                    "User {} does not have passwordHash in Firestore",
                    email
            );

            throw new UnauthorizedException(
                    "This account does not have a password configured"
            );
        }

        boolean passwordMatches = false;

        try {
            passwordMatches = passwordEncoder.matches(
                    request.getPassword(),
                    storedPasswordHash
            );

            if (!passwordMatches && storedPasswordHash != null && storedPasswordHash.startsWith("$2")) {
                // BCrypt fallback for existing users, migrating to Argon2id
                org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder bcrypt = 
                        new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
                if (bcrypt.matches(request.getPassword(), storedPasswordHash)) {
                    passwordMatches = true;
                    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
                    log.info("Upgraded password hash to Argon2id for user: {}", email);
                }
            }
        } catch (Exception e) {
            log.error("Password verification failed for {}", email, e);
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!passwordMatches) {

            log.warn(
                    "Invalid password for email: {}",
                    email
            );

            throw new UnauthorizedException(
                    "Invalid email or password"
            );
        }

        // Update last login
        user.setLastLoginAt(Instant.now());

        // Ensure providerData is initialized for local users
        if (user.getProviderData() == null) {
            user.setProviderData(new ArrayList<>());
        }

        // Ensure providerData is initialized for local users
        if (user.getProviderData() == null) {
            user.setProviderData(new ArrayList<>());
        }

        user = userRepository.save(user);

        // Generate JWT
        String token =
                jwtUtils.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                );

        log.info(
                "Login successful for email: {}, role: {}",
                user.getEmail(),
                user.getRole()
        );

        return buildAuthResponse(
                user,
                token
        );
    }


    // ============================================================
    // FIREBASE SOCIAL LOGIN
    // GOOGLE / FACEBOOK / TWITTER
    // ============================================================

    public AuthResponseDTO socialLogin(
            SocialAuthRequestDTO request) {

        if (request == null) {
            throw new UnauthorizedException(
                    "Social authentication request is required"
            );
        }

        if (!firebaseService.isFirebaseAvailable()) {
            throw new UnauthorizedException(
                    "Firebase is not configured. " +
                    "Please configure Firebase before using social login."
            );
        }

        String firebaseIdToken =
                request.getFirebaseIdToken();

        if (firebaseIdToken == null
                || firebaseIdToken.isBlank()) {

            throw new UnauthorizedException(
                    "Firebase ID token is required"
            );
        }

        FirebaseToken firebaseToken;

        try {

            firebaseToken =
                    firebaseService.verifyIdToken(
                            firebaseIdToken
                    );

        } catch (Exception e) {

            log.error(
                    "Firebase token verification failed",
                    e
            );

            throw new UnauthorizedException(
                    "Invalid or expired Firebase authentication token"
            );
        }

        if (firebaseToken == null) {
            throw new UnauthorizedException(
                    "Invalid Firebase authentication token"
            );
        }

        // Firebase email
        String email =
                firebaseToken.getEmail();

        if (email == null || email.isBlank()) {

            throw new UnauthorizedException(
                    "Your social account did not provide an email address"
            );
        }

        email = normalizeEmail(email);

        String firebaseUid =
                firebaseToken.getUid();

        String firebaseName = null;

        Object nameClaim =
                firebaseToken.getClaims().get("name");

        if (nameClaim != null) {
            firebaseName = nameClaim.toString();
        }

        log.info(
                "Firebase social login: provider={}, uid={}, email={}",
                request.getProvider(),
                firebaseUid,
                email
        );

        // Find existing user
        User user =
                userRepository.findByEmail(email)
                        .orElse(null);

        // ========================================================
        // EXISTING USER
        // ========================================================

        if (user != null) {

            if (user.getStatus()
                    != User.UserStatus.ACTIVE) {

                throw new UnauthorizedException(
                        "Your account is not active"
                );
            }

            // SECURITY: Do NOT auto-link providers during normal login
            // Only update providerData through explicit linking endpoint
            // updateProviderData(user, request.getProvider(), firebaseToken);

            // Check if this is a linking request from Settings (user already authenticated)
            User authenticatedUser = getOptionalAuthenticatedUser().orElse(null);
            if (authenticatedUser != null && authenticatedUser.getEmail().equals(email)) {
                // User is already logged in and linking a provider - update providerData
                updateProviderData(user, request.getProvider(), firebaseToken);
                user.setLastLoginAt(Instant.now());
                user.setEmailVerified(true);
                user = userRepository.save(user);
                log.info("Provider linked to existing account for email: {}", email);
            } else {
                // Normal social login - do NOT auto-link providers
                // Only update providerData through explicit linking endpoint
            user.setLastLoginAt(Instant.now());
            user.setEmailVerified(true);

            // Ensure providerData is initialized
            if (user.getProviderData() == null) {
                user.setProviderData(new ArrayList<>());
            }

                // Ensure providerData is initialized
                if (user.getProviderData() == null) {
                    user.setProviderData(new ArrayList<>());
                }

            user = userRepository.save(user);
            }

        }

        // ========================================================
        // NEW SOCIAL USER
        // ========================================================

        else {

            String name = firebaseName;

            if (name == null || name.isBlank()) {
                name = request.getName();
            }

            if (name == null || name.isBlank()) {

                int atIndex =
                        email.indexOf('@');

                if (atIndex > 0) {
                    name =
                            email.substring(
                                    0,
                                    atIndex
                            );
                } else {
                    name = "Guest User";
                }
            }

            name = HtmlSanitizer.sanitize(name);

            // Social users are always CUSTOMER
            User newUser = User.builder()
                    .name(name)
                    .email(email)
                    .role(User.Role.ROLE_CUSTOMER)
                    .status(User.UserStatus.ACTIVE)
                    .emailVerified(true)
                    .phoneVerified(false)
                    .lastLoginAt(Instant.now())
                    .build();

            // Add provider data
            updateProviderData(newUser, request.getProvider(), firebaseToken);

            user = userRepository.save(newUser);

            log.info(
                    "New social user created in Firestore: {}",
                    email
            );
        }

        // Generate Reservo JWT
        String token =
                jwtUtils.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                );

        return buildAuthResponse(
                user,
                token
        );
    }


    // ============================================================
    // BUILD AUTH RESPONSE
    // ============================================================

    private AuthResponseDTO buildAuthResponse(
            User user,
            String token) {

        return AuthResponseDTO.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .loginProvider(user.getLoginProvider())
                .providerData(user.getProviderData())
                .build();
    }


    // ============================================================
    // SEND EMAIL OTP
    // ============================================================

    public String sendOtp(String email) {

        String normalizedEmail =
                normalizeEmail(email);

        if (normalizedEmail == null
                || normalizedEmail.isBlank()) {

            throw new BadRequestException(
                    "Email is required"
            );
        }

        String otpCode =
                String.format(
                        "%06d",
                        SECURE_RANDOM.nextInt(1_000_000)
                );

        otpStore.put(
                normalizedEmail,
                new OtpRecord(
                        otpCode,
                        Instant.now().plusSeconds(
                                otpExpirationMinutes * 60
                        )
                )
        );

        otpAttempts.remove(normalizedEmail);

        emailService.sendOtpEmail(
                normalizedEmail,
                otpCode
        );

        log.info(
                "OTP generated and sent to {}",
                normalizedEmail
        );

        return "OTP sent successfully to "
                + normalizedEmail;
    }


    // ============================================================
    // PASSWORD RESET OTP
    // ============================================================

    public String sendPasswordResetOtp(
            String email) {

        String normalizedEmail =
                normalizeEmail(email);

        if (normalizedEmail == null
                || normalizedEmail.isBlank()) {

            throw new BadRequestException(
                    "Email is required"
            );
        }

        if (!userRepository.existsByEmail(
                normalizedEmail)) {

            return "If an account exists for this email, "
                    + "a password reset code has been sent.";
        }

        String otpCode =
                String.format(
                        "%06d",
                        SECURE_RANDOM.nextInt(1_000_000)
                );

        otpStore.put(
                normalizedEmail,
                new OtpRecord(
                        otpCode,
                        Instant.now().plusSeconds(
                                otpExpirationMinutes * 60
                        )
                )
        );

        otpAttempts.remove(normalizedEmail);

        emailService.sendPasswordResetOtp(
                normalizedEmail,
                otpCode
        );

        return "If an account exists for this email, "
                + "a password reset code has been sent.";
    }


    // ============================================================
    // VERIFY OTP
    // ============================================================

    public boolean verifyOtp(
            OtpVerificationDTO verification) {

        if (verification == null) {
            throw new BadRequestException(
                    "OTP verification request is required"
            );
        }

        String email =
                normalizeEmail(
                        verification.getEmail()
                );

        String otpCode =
                verification.getOtpCode();

        if (email == null || email.isBlank()) {
            throw new BadRequestException(
                    "Email is required"
            );
        }

        if (otpCode == null || otpCode.isBlank()) {
            throw new BadRequestException(
                    "OTP code is required"
            );
        }

        OtpRecord otpRecord =
                otpStore.get(email);

        if (otpRecord == null) {
            throw new BadRequestException(
                    "OTP not found. Please request a new OTP."
            );
        }

        if (otpRecord.expiresAt()
                .isBefore(Instant.now())) {

            otpStore.remove(email);
            otpAttempts.remove(email);

            throw new BadRequestException(
                    "OTP has expired. Please request a new OTP."
            );
        }

        int attempts =
                otpAttempts.getOrDefault(
                        email,
                        0
                );

        if (attempts >= MAX_OTP_ATTEMPTS) {

            otpStore.remove(email);
            otpAttempts.remove(email);

            throw new BadRequestException(
                    "Too many failed attempts. "
                            + "Please request a new OTP."
            );
        }

        if (otpRecord.code()
                .equals(otpCode)) {

            otpAttempts.remove(email);

            otpStore.put(
                    email,
                    otpRecord.markVerified()
            );

            return true;
        }

        otpAttempts.put(
                email,
                attempts + 1
        );

        int remainingAttempts =
                MAX_OTP_ATTEMPTS
                        - (attempts + 1);

        throw new BadRequestException(
                "Invalid OTP. "
                        + remainingAttempts
                        + " attempts remaining."
        );
    }


    // ============================================================
    // REQUIRE VERIFIED OTP
    // ============================================================

    private void requireVerifiedOtp(
            String email,
            String otpCode) {

        String normalizedEmail =
                normalizeEmail(email);

        OtpRecord otpRecord =
                otpStore.get(normalizedEmail);

        if (otpCode == null
                || otpCode.isBlank()
                || otpRecord == null
                || otpRecord.expiresAt()
                        .isBefore(Instant.now())
                || !otpRecord.verified()
                || !otpRecord.code()
                        .equals(otpCode)) {

            throw new BadRequestException(
                    "Please verify a valid OTP before signing up."
            );
        }
    }


    // ============================================================
    // RESET PASSWORD
    // ============================================================

    public void resetPassword(
            ResetPasswordDTO request) {

        if (request == null) {
            throw new BadRequestException(
                    "Password reset request is required"
            );
        }

        String email =
                normalizeEmail(
                        request.getEmail()
                );

        if (email == null || email.isBlank()) {
            throw new BadRequestException(
                    "Email is required"
            );
        }

        if (request.getNewPassword() == null
                || request.getNewPassword().isBlank()) {

            throw new BadRequestException(
                    "New password is required"
            );
        }

        requireVerifiedOtp(
                email,
                request.getOtpCode()
        );

        User user =
                userRepository.findByEmail(
                        email
                ).orElseThrow(
                        () -> new UnauthorizedException(
                                "Password reset request is invalid."
                        )
                );

        if (user.getPasswordHash() != null
                && !user.getPasswordHash().isBlank()
                && passwordEncoder.matches(
                        request.getNewPassword(),
                        user.getPasswordHash()
                )) {

            throw new BadRequestException(
                    "Your new password must be different "
                            + "from your current password."
            );
        }

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        user.setAccountLocked(false);

        userRepository.save(user);

        otpStore.remove(email);
        otpAttempts.remove(email);
    }


    // ============================================================
    // CURRENT USER
    // ============================================================

    public User getAuthenticatedUser() {
        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(
                        authentication.getPrincipal()
                )) {
            throw new UnauthorizedException(
                    "User not authenticated"
            );
        }

        String email = authentication.getName();
        if (email == null || email.isBlank()) {
            throw new UnauthorizedException(
                    "User email not found in authentication"
            );
        }

        return userRepository.findByEmail(email)
                .orElseThrow(
                        () -> new UnauthorizedException(
                                "User not found"
                        )
                );
    }

    public Optional<User> getOptionalAuthenticatedUser() {
        try {
            Authentication authentication =
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication();

            if (authentication == null
                    || !authentication.isAuthenticated()
                    || "anonymousUser".equals(
                            authentication.getPrincipal()
                    )) {
                return Optional.empty();
            }

            String email = authentication.getName();
            if (email == null || email.isBlank()) {
                return Optional.empty();
            }

            return userRepository.findByEmail(email);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public AuthResponseDTO getCurrentUserDetails() {
        User user = getAuthenticatedUser();

        return AuthResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .loginProvider(user.getLoginProvider())
                .providerData(user.getProviderData())
                .build();
    }


    // ============================================================
    // OTP RECORD
    // ============================================================

    private record OtpRecord(
            String code,
            Instant expiresAt,
            boolean verified) {

        private OtpRecord(
                String code,
                Instant expiresAt) {

            this(
                    code,
                    expiresAt,
                    false
            );
        }

        private OtpRecord markVerified() {

            return new OtpRecord(
                    code,
                    expiresAt,
                    true
            );
        }
    }


    // ============================================================
    // PHONE LOGIN
    // ============================================================

    public AuthResponseDTO loginWithPhone(
            PhoneAuthRequestDTO request) {

        if (request == null) {
            throw new UnauthorizedException(
                    "Phone authentication request is required"
            );
        }

        if (!firebaseService.isFirebaseAvailable()) {
            throw new UnauthorizedException(
                    "Firebase is not configured. "
                            + "Please set up Firebase to use phone authentication."
            );
        }

        if (request.getFirebaseIdToken() == null
                || request.getFirebaseIdToken().isBlank()) {

            throw new UnauthorizedException(
                    "Firebase ID token is required"
            );
        }

        String phoneNumber =
                firebaseService.getPhoneNumberFromToken(
                        request.getFirebaseIdToken()
                );

        if (phoneNumber == null) {
            throw new UnauthorizedException(
                    "Invalid Firebase token or phone number not verified"
            );
        }

        String normalizedRequestPhone =
                normalizePhoneNumber(
                        request.getPhoneNumber()
                );

        String normalizedFirebasePhone =
                normalizePhoneNumber(
                        phoneNumber
                );

        if (normalizedRequestPhone == null
                || normalizedFirebasePhone == null
                || !normalizedRequestPhone.equals(
                        normalizedFirebasePhone
                )) {

            throw new UnauthorizedException(
                    "Phone number mismatch between request and Firebase token"
            );
        }

        User user =
                userRepository.findByPhone(
                        normalizedRequestPhone
                ).orElseThrow(
                        () -> new UnauthorizedException(
                                "No account found with this phone number"
                        )
                );

        if (user.getStatus()
                != User.UserStatus.ACTIVE) {

            throw new UnauthorizedException(
                    "Account is not active"
            );
        }

        // IMPORTANT:
        // User uses Instant, not Firestore Timestamp.
        user.setLastLoginAt(Instant.now());

        user.setPhoneVerified(true);

        // Ensure providerData is initialized
        if (user.getProviderData() == null) {
            user.setProviderData(new ArrayList<>());
        }

        // Ensure providerData is initialized
        if (user.getProviderData() == null) {
            user.setProviderData(new ArrayList<>());
        }

        userRepository.save(user);

        String token =
                jwtUtils.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                );

        return buildAuthResponse(
                user,
                token
        );
    }


    // ============================================================
    // PHONE SIGNUP
    // ============================================================

    public AuthResponseDTO registerWithPhone(
            PhoneAuthRegisterDTO request) {

        if (request == null) {
            throw new BadRequestException(
                    "Phone registration request is required"
            );
        }

        if (!firebaseService.isFirebaseAvailable()) {
            throw new UnauthorizedException(
                    "Firebase is not configured. "
                            + "Please set up Firebase to use phone authentication."
            );
        }

        if (request.getFirebaseIdToken() == null
                || request.getFirebaseIdToken().isBlank()) {

            throw new UnauthorizedException(
                    "Firebase ID token is required"
            );
        }

        String phoneNumber =
                firebaseService.getPhoneNumberFromToken(
                        request.getFirebaseIdToken()
                );

        if (phoneNumber == null) {
            throw new UnauthorizedException(
                    "Invalid Firebase token or phone number not verified"
            );
        }

        String normalizedRequestPhone =
                normalizePhoneNumber(
                        request.getPhoneNumber()
                );

        String normalizedFirebasePhone =
                normalizePhoneNumber(
                        phoneNumber
                );

        if (normalizedRequestPhone == null
                || normalizedFirebasePhone == null
                || !normalizedRequestPhone.equals(
                        normalizedFirebasePhone
                )) {

            throw new UnauthorizedException(
                    "Phone number mismatch between request and Firebase token"
            );
        }

        // Check duplicate phone
        if (userRepository.existsByPhone(
                normalizedRequestPhone)) {

            throw new DuplicateResourceException(
                    "Phone number '"
                            + normalizedRequestPhone
                            + "' is already registered"
            );
        }

        // Default customer
        User.Role userRole =
                User.Role.ROLE_CUSTOMER;

        if (request.getRole() != null
                && request.getRole()
                        .equalsIgnoreCase("ROLE_OWNER")) {

            userRole = User.Role.ROLE_OWNER;
        }

        // Create temporary email
        String phoneDigits =
                normalizedRequestPhone
                        .replaceAll(
                                "[^0-9]",
                                ""
                        );

        String tempEmail =
                "user_"
                        + phoneDigits
                        + "@phone.reservo.temp";

        String name = request.getName();

        if (name == null || name.isBlank()) {
            name = "Guest User";
        }

        name = HtmlSanitizer.sanitize(name);

        // Create Firestore user
        User user = User.builder()
                .name(name)
                .email(tempEmail)
                .phone(normalizedRequestPhone)
                .role(userRole)
                .status(User.UserStatus.ACTIVE)
                .phoneVerified(true)
                .emailVerified(false)
                .lastLoginAt(Instant.now())
                .providerData(new ArrayList<>()) // Initialize empty providerData
                .build();

        user = userRepository.save(user);

        String token =
                jwtUtils.generateToken(
                        user.getEmail(),
                        user.getRole().name()
                );

        return buildAuthResponse(
                user,
                token
        );
    }


    // ============================================================
    // NORMALIZE EMAIL
    // ============================================================

    private String normalizeEmail(String email) {

        if (email == null) {
            return null;
        }

        String normalized =
                email.trim().toLowerCase();

        return normalized.isBlank()
                ? null
                : normalized;
    }


    // ============================================================
    // NORMALIZE PHONE
    // ============================================================

    private String normalizePhoneNumber(
            String phone) {

        if (phone == null
                || phone.isBlank()) {

            return null;
        }

        String original =
                phone.trim();

        // +91XXXXXXXXXX
        if (original.startsWith("+")) {

            String digits =
                    original.substring(1)
                            .replaceAll(
                                    "[^0-9]",
                                    ""
                            );

            return digits.isBlank()
                    ? null
                    : "+" + digits;
        }

        String cleaned =
                original.replaceAll(
                        "[^0-9]",
                        ""
                );

        // 10 digit Indian number
        if (cleaned.length() == 10) {
            return "+91" + cleaned;
        }

        // 0XXXXXXXXXX
        if (cleaned.length() == 11
                && cleaned.startsWith("0")) {

            return "+91"
                    + cleaned.substring(1);
        }

        // 91XXXXXXXXXX
        if (cleaned.length() == 12
                && cleaned.startsWith("91")) {

            return "+" + cleaned;
        }

        // Other international number
        if (cleaned.length() > 10) {
            return "+" + cleaned;
        }

        return "+" + cleaned;
    }


    // ============================================================
    // UPDATE PROVIDER DATA
    // ============================================================

    private void updateProviderData(User user, String provider, FirebaseToken firebaseToken) {
        // Map frontend provider names to Firebase provider IDs
        String firebaseProviderId = mapProviderToFirebaseId(provider);

        // Initialize providerData list if null
        if (user.getProviderData() == null) {
            user.setProviderData(new ArrayList<>());
        }

        // Check if this provider is already in the list
        boolean providerExists = user.getProviderData().stream()
                .anyMatch(p -> firebaseProviderId.equals(p.getProviderId()));

        if (!providerExists) {
            // Create new provider info
            User.ProviderInfo providerInfo = new User.ProviderInfo();
            providerInfo.setProviderId(firebaseProviderId);
            providerInfo.setUid(firebaseToken.getUid());

            // Extract additional claims
            Object nameClaim = firebaseToken.getClaims().get("name");
            if (nameClaim != null) {
                providerInfo.setDisplayName(nameClaim.toString());
            }

            Object pictureClaim = firebaseToken.getClaims().get("picture");
            if (pictureClaim != null) {
                providerInfo.setPhotoURL(pictureClaim.toString());
            }

            providerInfo.setEmail(firebaseToken.getEmail());

            Object phoneClaim = firebaseToken.getClaims().get("phone_number");
            if (phoneClaim != null) {
                providerInfo.setPhoneNumber(phoneClaim.toString());
            }

            // Add to provider data list
            user.getProviderData().add(providerInfo);
        }

        // Update primary login provider
        user.setLoginProvider(provider != null ? provider.toUpperCase() : "LOCAL");
        user.setProviderUserId(firebaseToken.getUid());
    }


    private String mapProviderToFirebaseId(String provider) {
        if (provider == null) {
            return "local";
        }
        return switch (provider.toLowerCase()) {
            case "google" -> "google.com";
            case "facebook" -> "facebook.com";
            case "twitter" -> "twitter.com";
            case "phone" -> "phone";
            default -> "local";
        };
    }


    // ============================================================
    // LINK PROVIDER (EXPLICIT USER ACTION)
    // ============================================================

    public void linkProvider(SocialAuthRequestDTO request) {
        if (request == null) {
            throw new BadRequestException(
                    "Provider linking request is required"
            );
        }

        if (!firebaseService.isFirebaseAvailable()) {
            throw new BadRequestException(
                    "Firebase is not configured. Please configure Firebase before linking providers."
            );
        }

        String firebaseIdToken = request.getFirebaseIdToken();

        if (firebaseIdToken == null || firebaseIdToken.isBlank()) {
            throw new BadRequestException(
                    "Firebase ID token is required"
            );
        }

        FirebaseToken firebaseToken;
        try {
            firebaseToken = firebaseService.verifyIdToken(firebaseIdToken);
        } catch (Exception e) {
            log.error("Firebase token verification failed", e);
            throw new BadRequestException(
                    "Invalid or expired Firebase authentication token"
            );
        }

        if (firebaseToken == null) {
            throw new BadRequestException(
                    "Invalid Firebase authentication token"
            );
        }

        // Get the authenticated user
        User user = getAuthenticatedUser();

        // Update provider data
        updateProviderData(user, request.getProvider(), firebaseToken);

        // Save the updated user
        userRepository.save(user);

        log.info(
                "Provider linked successfully for user: {}, provider: {}",
                user.getEmail(),
                request.getProvider()
        );
    }


    // ============================================================
    // UNLINK PROVIDER (EXPLICIT USER ACTION)
    // ============================================================

    public void unlinkProvider(SocialAuthRequestDTO request) {
        if (request == null) {
            throw new BadRequestException(
                    "Provider unlinking request is required"
            );
        }

        String provider = request.getProvider();
        if (provider == null || provider.isBlank()) {
            throw new BadRequestException(
                    "Provider is required"
            );
        }

        // Get the authenticated user
        User user = getAuthenticatedUser();

        if (user.getProviderData() == null || user.getProviderData().isEmpty()) {
            throw new BadRequestException(
                    "No providers linked to this account"
            );
        }

        String firebaseProviderId = mapProviderToFirebaseId(provider);

        // Remove the provider from providerData
        boolean removed = user.getProviderData().removeIf(p ->
                firebaseProviderId.equals(p.getProviderId())
        );

        if (!removed) {
            throw new BadRequestException(
                    "Provider is not linked to this account"
            );
        }

        // If no providers left, set loginProvider to LOCAL
        if (user.getProviderData().isEmpty()) {
            user.setLoginProvider("LOCAL");
            user.setProviderUserId(null);
        } else {
            // Update primary loginProvider to the first remaining provider
            user.setLoginProvider(user.getProviderData().get(0).getProviderId().toUpperCase());
            user.setProviderUserId(user.getProviderData().get(0).getUid());
        }

        user.updateTimestamp();
        userRepository.save(user);

        log.info(
                "Provider unlinked successfully for user: {}, provider: {}",
                user.getEmail(),
                provider
        );
    }


}