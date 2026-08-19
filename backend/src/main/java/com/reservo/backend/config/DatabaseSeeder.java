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

            // 1. Goa Coastline Luxury Sanctuary (matches frontend static data)
            Resort r1 = resortRepository.save(Resort.builder()
                    .name("Goa Coastline Luxury Sanctuary")
                    .location("West Coast, India")
                    .description("Immerse yourself in coastal elegance. Nestled along Goa's quietest private cove, this resort pairs barefoot luxury with cutting-edge AI concierge service. Wake up to ocean breezes, unwind in your private infinity pool, and enjoy Michelin-crafted seafood dining.")
                    .imageUrl("https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80")
                    .pricePerNight(new BigDecimal("8000"))
                    .rating(4.9)
                    .reviewCount(128)
                    .featuredTag("Trending Stay")
                    .status(Resort.ResortStatus.APPROVED)
                    .owner(owner)
                    .build());

            // 2. Kerala Backwaters Estate (matches frontend static data)
            Resort r2 = resortRepository.save(Resort.builder()
                    .name("Kerala Backwaters Estate")
                    .location("South Coast, India")
                    .description("Surround yourself with calm waters and tropical palm canopies. The Kerala Backwaters Estate merges classic heritage Kerala architecture with modern luxury comforts, private floating houseboats, and serene lake views.")
                    .imageUrl("https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80")
                    .pricePerNight(new BigDecimal("9000"))
                    .rating(4.9)
                    .reviewCount(96)
                    .featuredTag("Popular Choice")
                    .status(Resort.ResortStatus.APPROVED)
                    .owner(owner)
                    .build());

            // 3. Udaipur Royal Palace Sanctuary (matches frontend static data)
            Resort r3 = resortRepository.save(Resort.builder()
                    .name("Udaipur Royal Palace Sanctuary")
                    .location("Lake Pichola, Rajasthan")
                    .description("Experience royal treatment fit for kings. Surrounded by Lake Pichola, this heritage palace features handcrafted marble arches, royal courtyards, live Sitar performances, and gold-leaf dining.")
                    .imageUrl("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80")
                    .pricePerNight(new BigDecimal("18500"))
                    .rating(5.0)
                    .reviewCount(210)
                    .featuredTag("Ultra Luxury")
                    .status(Resort.ResortStatus.APPROVED)
                    .owner(owner)
                    .build());

            // 4. Himalayan Pine Forest Chalet (matches frontend static data)
            Resort r4 = resortRepository.save(Resort.builder()
                    .name("Himalayan Pine Forest Chalet")
                    .location("North Hills, Himachal")
                    .description("Perched among majestic pine forests and snow-capped peaks, this mountain chalet offers cozy stone fireplaces, outdoor heated jacuzzis, and stargazing glass domes.")
                    .imageUrl("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80")
                    .pricePerNight(new BigDecimal("11200"))
                    .rating(4.8)
                    .reviewCount(84)
                    .featuredTag("Mountain Refuge")
                    .status(Resort.ResortStatus.APPROVED)
                    .owner(owner)
                    .build());

            // 5. Baa Atoll Overwater Sanctuary (matches frontend static data)
            Resort r5 = resortRepository.save(Resort.builder()
                    .name("Baa Atoll Overwater Sanctuary")
                    .location("Baa Atoll, Maldives")
                    .description("Suspended above crystal turquoise ocean waters, each villa features glass floor viewing panels, slide to ocean, private infinity pool, and round-the-clock butler service.")
                    .imageUrl("https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80")
                    .pricePerNight(new BigDecimal("32000"))
                    .rating(5.0)
                    .reviewCount(315)
                    .featuredTag("World Top 10")
                    .status(Resort.ResortStatus.APPROVED)
                    .owner(owner)
                    .build());

            // 6. Additional resort for variety
            Resort r6 = resortRepository.save(Resort.builder()
                    .name("Rajasthan Desert Palace Resort")
                    .location("Jaisalmer, Rajasthan")
                    .description("Experience the magic of the Thar Desert in luxury. This desert palace offers traditional Rajasthani architecture, private sand dune dinners, camel safaris, and stunning sunset views over the golden sands.")
                    .imageUrl("https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1200&q=80")
                    .pricePerNight(new BigDecimal("14500"))
                    .rating(4.7)
                    .reviewCount(156)
                    .featuredTag("Desert Luxury")
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
