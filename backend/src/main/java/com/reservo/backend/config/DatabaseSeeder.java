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
                    .emailVerified(true)
                    .build());

            // Reservo Team Admin login
            userRepository.save(User.builder()
                    .name("Reservo Team Admin")
                    .email("reservo@mail.in")
                    .passwordHash(passwordEncoder.encode("password"))
                    .role(User.Role.ROLE_ADMIN)
                    .status(User.UserStatus.ACTIVE)
                    .emailVerified(true)
                    .build());

            // Custom business partner accounts from user request
            userRepository.save(User.builder()
                    .name("Resort Partner Elite 1")
                    .email("reservo2mail.in")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .role(User.Role.ROLE_OWNER)
                    .status(User.UserStatus.ACTIVE)
                    .emailVerified(true)
                    .build());

            userRepository.save(User.builder()
                    .name("Resort Partner Elite 2")
                    .email("reservo2@mail.in")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .role(User.Role.ROLE_OWNER)
                    .status(User.UserStatus.ACTIVE)
                    .emailVerified(true)
                    .build());

            log.info("User accounts seeded successfully!");
        }

        if (resortRepository.count() == 0) {
            log.info("Seeding initial resorts matching the Reservo UI mockup design...");

            User owner = userRepository.findByEmail("resort@mail.in").orElse(null);

            // 1. Ocean Bliss Resort
            Resort r1 = resortRepository.save(Resort.builder()
                    .name("Ocean Bliss Resort")
                    .location("Goa, India")
                    .description("Luxury beachfront resort with ocean views, private beach access, spa, and fine dining.")
                    .imageUrl("https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80")
                    .pricePerNight(new BigDecimal("8999"))
                    .rating(4.8)
                    .reviewCount(1246)
                    .featuredTag("Breakfast Included")
                    .status(Resort.ResortStatus.APPROVED)
                    .owner(owner)
                    .build());

            // 2. Royal Palm Retreat
            Resort r2 = resortRepository.save(Resort.builder()
                    .name("Royal Palm Retreat")
                    .location("Bali, Indonesia")
                    .description("Tropical paradise surrounded by lush palm gardens, infinity pools, and serene villas.")
                    .imageUrl("https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80")
                    .pricePerNight(new BigDecimal("12499"))
                    .rating(4.7)
                    .reviewCount(884)
                    .featuredTag("Free Cancellation")
                    .status(Resort.ResortStatus.APPROVED)
                    .owner(owner)
                    .build());

            // 3. Sunset Lagoon Resort
            Resort r3 = resortRepository.save(Resort.builder()
                    .name("Sunset Lagoon Resort")
                    .location("Maldives")
                    .description("Overwater bungalows with glass floor panels, direct ocean access, and butler service.")
                    .imageUrl("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80")
                    .pricePerNight(new BigDecimal("18999"))
                    .rating(4.9)
                    .reviewCount(1512)
                    .featuredTag("All Inclusive")
                    .status(Resort.ResortStatus.APPROVED)
                    .owner(owner)
                    .build());

            // 4. Hill View Escape
            Resort r4 = resortRepository.save(Resort.builder()
                    .name("Hill View Escape")
                    .location("Udaipur, India")
                    .description("Heritage palace resort overlooking Lake Pichola with royal architecture and infinity pool.")
                    .imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80")
                    .pricePerNight(new BigDecimal("6499"))
                    .rating(4.6)
                    .reviewCount(876)
                    .featuredTag("Pay at Hotel")
                    .status(Resort.ResortStatus.APPROVED)
                    .owner(owner)
                    .build());

            User customOwner1 = userRepository.findByEmail("reservo2mail.in").orElse(null);
            User customOwner2 = userRepository.findByEmail("reservo2@mail.in").orElse(null);

            if (customOwner1 != null) {
                resortRepository.save(Resort.builder()
                        .name("Reservo Elite Partner Haven")
                        .location("Mumbai, India")
                        .description("Premium urban resort featuring private rooftops, luxury suites, and curated dining experiences.")
                        .imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80")
                        .pricePerNight(new BigDecimal("10999"))
                        .rating(4.9)
                        .reviewCount(120)
                        .featuredTag("Elite Partner")
                        .status(Resort.ResortStatus.APPROVED)
                        .owner(customOwner1)
                        .build());
            }

            if (customOwner2 != null) {
                resortRepository.save(Resort.builder()
                        .name("Reservo Signature Oasis")
                        .location("Pune, India")
                        .description("Scenic valley getaway featuring private infinity pools, organic farm dinners, and spa therapy.")
                        .imageUrl("https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80")
                        .pricePerNight(new BigDecimal("9499"))
                        .rating(4.8)
                        .reviewCount(95)
                        .featuredTag("Free Airport Transfer")
                        .status(Resort.ResortStatus.APPROVED)
                        .owner(customOwner2)
                        .build());
            }

            log.info("Successfully seeded luxury resorts!");

            // Seed rooms for the resorts
            if (roomRepository.count() == 0 && owner != null) {
                log.info("Seeding initial rooms for resorts...");
                roomRepository.save(Room.builder()
                        .roomNumber("101")
                        .type(Room.RoomType.DELUXE_SEA_VIEW)
                        .pricePerNight(new BigDecimal("8999"))
                        .capacity(2)
                        .status(Room.RoomStatus.AVAILABLE)
                        .cleaningStatus(Room.CleaningStatus.CLEAN)
                        .maintenanceDetails("None")
                        .resort(r1)
                        .build());
                roomRepository.save(Room.builder()
                        .roomNumber("102")
                        .type(Room.RoomType.DELUXE)
                        .pricePerNight(new BigDecimal("6999"))
                        .capacity(2)
                        .status(Room.RoomStatus.AVAILABLE)
                        .cleaningStatus(Room.CleaningStatus.CLEANING)
                        .maintenanceDetails("None")
                        .resort(r1)
                        .build());
                roomRepository.save(Room.builder()
                        .roomNumber("201")
                        .type(Room.RoomType.SUITE)
                        .pricePerNight(new BigDecimal("12499"))
                        .capacity(3)
                        .status(Room.RoomStatus.BLOCKED)
                        .cleaningStatus(Room.CleaningStatus.CLEAN)
                        .maintenanceDetails("AC Repair")
                        .resort(r2)
                        .build());
                roomRepository.save(Room.builder()
                        .roomNumber("301")
                        .type(Room.RoomType.VILLA_WITH_POOL)
                        .pricePerNight(new BigDecimal("18999"))
                        .capacity(4)
                        .status(Room.RoomStatus.MAINTENANCE)
                        .cleaningStatus(Room.CleaningStatus.DIRTY)
                        .maintenanceDetails("Plumbing")
                        .resort(r3)
                        .build());
                log.info("Successfully seeded rooms!");
            }
        }
    }
}
