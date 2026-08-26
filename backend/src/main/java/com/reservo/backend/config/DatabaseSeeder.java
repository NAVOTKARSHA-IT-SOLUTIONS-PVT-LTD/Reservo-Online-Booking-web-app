package com.reservo.backend.config;

import com.reservo.backend.entity.*;
import com.reservo.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ResortRepository resortRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;
    private final CouponRepository couponRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Seeding initial user credentials...");

            // Resort Partner / Owner Admin login
            userRepository.save(User.builder()
                    .name("Resort Partner")
                    .email("resort@mail.in")
                    .passwordHash(passwordEncoder.encode("password"))
                    .role(User.Role.ROLE_OWNER)
                    .status(User.UserStatus.ACTIVE)
                    .kycStatus(User.KycStatus.VERIFIED)
                    .emailVerified(true)
                    .build());

            // Reservo Team Admin login
            userRepository.save(User.builder()
                    .name("Reservo Team Admin")
                    .email("reservo@mail.in")
                    .passwordHash(passwordEncoder.encode("password"))
                    .role(User.Role.ROLE_ADMIN)
                    .status(User.UserStatus.ACTIVE)
                    .kycStatus(User.KycStatus.VERIFIED)
                    .emailVerified(true)
                    .build());

            // Custom business partner accounts from user request
            userRepository.save(User.builder()
                    .name("Resort Partner Elite 1")
                    .email("reservo2mail.in")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .role(User.Role.ROLE_OWNER)
                    .status(User.UserStatus.ACTIVE)
                    .kycStatus(User.KycStatus.VERIFIED)
                    .emailVerified(true)
                    .build());

            userRepository.save(User.builder()
                    .name("Resort Partner Elite 2")
                    .email("reservo2@mail.in")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .role(User.Role.ROLE_OWNER)
                    .status(User.UserStatus.ACTIVE)
                    .kycStatus(User.KycStatus.VERIFIED)
                    .emailVerified(true)
                    .build());

            log.info("User accounts seeded successfully!");
        }

        // Preserving database listings and host requests between runs/restarts by removing automatic deleteAll calls
        log.info("Database startup: retaining all existing resorts, rooms, bookings, and coupons.");

        if (couponRepository.count() == 0) {
            log.info("Seeding initial demo coupons...");
            User admin = userRepository.findByEmail("reservo@mail.in").orElse(null);

            couponRepository.save(Coupon.builder()
                    .code("WELCOME10")
                    .user(admin)
                    .discountType(Coupon.DiscountType.PERCENTAGE)
                    .discountValue(BigDecimal.valueOf(10))
                    .discountPercentage(10)
                    .minimumAmount(BigDecimal.valueOf(1000))
                    .status(Coupon.CouponStatus.ACTIVE)
                    .usageLimit(1000)
                    .build());

            couponRepository.save(Coupon.builder()
                    .code("AZURE20")
                    .user(admin)
                    .discountType(Coupon.DiscountType.PERCENTAGE)
                    .discountValue(BigDecimal.valueOf(20))
                    .discountPercentage(20)
                    .resortId(1L)
                    .minimumAmount(BigDecimal.valueOf(2000))
                    .status(Coupon.CouponStatus.ACTIVE)
                    .usageLimit(1000)
                    .build());
            log.info("Successfully seeded coupons!");
        }
    }
}
