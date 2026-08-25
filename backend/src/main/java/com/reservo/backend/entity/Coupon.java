package com.reservo.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(name = "discount_percentage", nullable = false)
    @Builder.Default
    private Integer discountPercentage = 10;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    @Builder.Default
    private DiscountType discountType = DiscountType.PERCENTAGE;

    @Column(name = "discount_value", nullable = false)
    @Builder.Default
    private BigDecimal discountValue = BigDecimal.TEN;

    @Column(name = "resort_id")
    private Long resortId;

    @Column(name = "minimum_amount")
    private BigDecimal minimumAmount;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "usage_limit")
    @Builder.Default
    private Integer usageLimit = 1000;

    @Column(name = "used_count")
    @Builder.Default
    private Integer usedCount = 0;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CouponStatus status;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    public enum CouponStatus {
        ACTIVE, USED, EXPIRED, EXHAUSTED
    }

    public enum DiscountType {
        PERCENTAGE, FIXED
    }
}
