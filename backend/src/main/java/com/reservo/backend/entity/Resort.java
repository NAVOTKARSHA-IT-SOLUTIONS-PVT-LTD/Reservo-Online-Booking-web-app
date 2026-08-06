package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "resorts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resort {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    @Column(nullable = false)
    private BigDecimal pricePerNight;

    @Builder.Default
    private Double rating = 4.5;

    @Builder.Default
    private Integer reviewCount = 0;

    private String featuredTag; // e.g. "Breakfast Included", "Free Cancellation"

    private Integer discountPercentage; // e.g. 30, 20

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResortStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Builder.Default
    private Instant createdAt = Instant.now();

    public enum ResortStatus {
        PENDING_APPROVAL, APPROVED, REJECTED, SUSPENDED
    }
}
