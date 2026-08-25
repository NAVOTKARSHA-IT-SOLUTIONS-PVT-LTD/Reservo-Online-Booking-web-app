package com.reservo.backend.service;

import com.reservo.backend.entity.Coupon;
import com.reservo.backend.entity.User;
import com.reservo.backend.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public Coupon getAndValidateCoupon(String code, Long userId, Long resortId, BigDecimal bookingAmount) {
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Coupon code cannot be empty");
        }

        String cleanCode = code.trim().toUpperCase();
        Coupon coupon = couponRepository.findByCode(cleanCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid coupon code."));

        // 1. Check basic status
        if (coupon.getStatus() != Coupon.CouponStatus.ACTIVE) {
            throw new IllegalArgumentException("Coupon code has already been used or expired.");
        }

        // 2. Check expiry date
        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDate.now())) {
            coupon.setStatus(Coupon.CouponStatus.EXPIRED);
            couponRepository.save(coupon);
            throw new IllegalArgumentException("Coupon has expired.");
        }

        // 3. Check usage limit
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            coupon.setStatus(Coupon.CouponStatus.EXHAUSTED);
            couponRepository.save(coupon);
            throw new IllegalArgumentException("Coupon usage limit reached.");
        }

        // 4. Check minimum booking amount
        if (coupon.getMinimumAmount() != null && bookingAmount.compareTo(coupon.getMinimumAmount()) < 0) {
            throw new IllegalArgumentException("Booking amount must be at least ₹" + coupon.getMinimumAmount() + " to use this coupon.");
        }

        // 5. Check resort-specificity
        if (coupon.getResortId() != null && !coupon.getResortId().equals(resortId)) {
            throw new IllegalArgumentException("This coupon is only valid for a specific resort.");
        }

        // 6. Check user-specificity (exclude platform/admin-owned seeded coupons)
        if (coupon.getUser() != null) {
            boolean isPlatformCoupon = coupon.getUser().getRole() == com.reservo.backend.entity.User.Role.ROLE_ADMIN;
            if (!isPlatformCoupon) {
                if (userId == null || !coupon.getUser().getId().equals(userId)) {
                    throw new IllegalArgumentException("This coupon is user-specific and not owned by you.");
                }
            }
        }

        return coupon;
    }

    @Transactional
    public void incrementCouponUsage(String code) {
        String cleanCode = code.trim().toUpperCase();
        couponRepository.findByCode(cleanCode).ifPresent(coupon -> {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
                coupon.setStatus(Coupon.CouponStatus.EXHAUSTED);
            } else if (coupon.getUser() != null) {
                boolean isPlatformCoupon = coupon.getUser().getRole() == com.reservo.backend.entity.User.Role.ROLE_ADMIN;
                if (!isPlatformCoupon) {
                    // User-specific coupons are typically single-use
                    coupon.setStatus(Coupon.CouponStatus.USED);
                }
            }
            couponRepository.save(coupon);
            log.info("Incremented usage for coupon: {}. New used count: {}", cleanCode, coupon.getUsedCount());
        });
    }
}
