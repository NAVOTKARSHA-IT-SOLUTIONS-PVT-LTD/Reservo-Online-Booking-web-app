package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "offers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String type; // e.g. "Discount Coupon", "Weekend Pricing", "Season Pricing"

    @Column(nullable = false)
    private String discount; // e.g. "20% Off", "₹1000 Flat"

    @Column(nullable = false)
    private String status; // e.g. "Active", "Draft", "Expired"

    @Column(nullable = false)
    private LocalDate expiryDate;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
