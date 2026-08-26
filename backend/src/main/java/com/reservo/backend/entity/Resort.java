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

    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(nullable = false)
    private BigDecimal pricePerNight;

    @Builder.Default
    private Double rating = 4.5;

    @Builder.Default
    private Integer reviewCount = 0;

    private String featuredTag; // e.g. "Breakfast Included", "Free Cancellation"

    private Integer discountPercentage; // e.g. 30, 20

    private String category; // e.g. "beach", "mountain", etc.

    @Column(name = "gallery_urls", columnDefinition = "LONGTEXT")
    private String galleryUrls; // Comma-separated list of image URLs/base64

    @Column(name = "video_urls", columnDefinition = "LONGTEXT")
    private String videoUrls; // Comma-separated list of video URLs/base64

    @Column(columnDefinition = "TEXT")
    private String highlights; // Comma-separated list of highlights

    @Column(columnDefinition = "TEXT")
    private String amenities; // Comma-separated list of amenities

    private Integer guests;
    private Integer bedrooms;
    private Integer beds;
    private Integer bathrooms;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResortStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private User owner;

    @Builder.Default
    private Instant createdAt = Instant.now();

    public enum ResortStatus {
        PENDING_APPROVAL, APPROVED, REJECTED, SUSPENDED, CHANGES_REQUESTED
    }
}
