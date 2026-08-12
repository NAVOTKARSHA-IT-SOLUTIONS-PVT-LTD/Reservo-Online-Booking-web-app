package com.reservo.backend.service;

import com.reservo.backend.dto.LoyaltyStatusResponse;
import com.reservo.backend.entity.Coupon;
import com.reservo.backend.entity.LoyaltyTransaction;
import com.reservo.backend.entity.User;
import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.repository.CouponRepository;
import com.reservo.backend.repository.LoyaltyTransactionRepository;
import com.reservo.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoyaltyService {

    private final UserRepository userRepository;
    private final LoyaltyTransactionRepository loyaltyTransactionRepository;
    private final CouponRepository couponRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter
            .ofPattern("MMM dd, yyyy")
            .withZone(ZoneId.systemDefault());

    public LoyaltyStatusResponse getRewardStatus(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        long activeCoupons = couponRepository.countByUserIdAndStatus(user.getId(), Coupon.CouponStatus.ACTIVE);

        List<LoyaltyTransaction> transactions = loyaltyTransactionRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<LoyaltyStatusResponse.LoyaltyTxDto> history = transactions.stream()
                .map(tx -> LoyaltyStatusResponse.LoyaltyTxDto.builder()
                        .id("tx-" + tx.getId())
                        .description(tx.getDescription())
                        .points((tx.getPointsChange() >= 0 ? "+" : "") + String.format("%,d", tx.getPointsChange()))
                        .date(DATE_FORMATTER.format(tx.getCreatedAt()))
                        .build())
                .collect(Collectors.toList());

        // Update membership level based on current points
        updateMembershipLevel(user);

        return LoyaltyStatusResponse.builder()
                .membershipLevel(user.getMembershipLevel())
                .points(user.getRewardPoints())
                .couponsCount(activeCoupons)
                .nextTierPoints(calculateNextTierPoints(user.getRewardPoints()))
                .history(history)
                .build();
    }

    @Transactional
    public Coupon redeemPoints(String email, Integer pointsToRedeem) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (user.getRewardPoints() < pointsToRedeem) {
            throw new IllegalArgumentException("Insufficient points balance.");
        }

        // Deduct points
        user.setRewardPoints(user.getRewardPoints() - pointsToRedeem);
        updateMembershipLevel(user);
        userRepository.save(user);

        // Generate Transaction entry
        LoyaltyTransaction tx = LoyaltyTransaction.builder()
                .user(user)
                .description("Points Redeemed for Coupon")
                .pointsChange(-pointsToRedeem)
                .createdAt(Instant.now())
                .build();
        loyaltyTransactionRepository.save(tx);

        // Generate Coupon
        String couponCode = "RIVO-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        Coupon coupon = Coupon.builder()
                .code(couponCode)
                .user(user)
                .discountPercentage(10) // Default 10% discount
                .status(Coupon.CouponStatus.ACTIVE)
                .createdAt(Instant.now())
                .build();

        return couponRepository.save(coupon);
    }

    @Transactional
    public void awardPoints(User user, BigDecimal amount) {
        // 10 points for every 100 currency units spent (10% back)
        int pointsToAward = amount.multiply(BigDecimal.valueOf(0.1)).intValue();
        if (pointsToAward <= 0) return;

        user.setRewardPoints(user.getRewardPoints() + pointsToAward);
        updateMembershipLevel(user);
        userRepository.save(user);

        LoyaltyTransaction tx = LoyaltyTransaction.builder()
                .user(user)
                .description("Earned on stay checkout")
                .pointsChange(pointsToAward)
                .createdAt(Instant.now())
                .build();
        loyaltyTransactionRepository.save(tx);
        log.info("Awarded {} points to user: {}", pointsToAward, user.getEmail());
    }

    @Transactional
    public void revokePoints(User user, BigDecimal amount) {
        int pointsToDeduct = amount.multiply(BigDecimal.valueOf(0.1)).intValue();
        if (pointsToDeduct <= 0) return;

        int currentPoints = user.getRewardPoints();
        user.setRewardPoints(Math.max(0, currentPoints - pointsToDeduct));
        updateMembershipLevel(user);
        userRepository.save(user);

        LoyaltyTransaction tx = LoyaltyTransaction.builder()
                .user(user)
                .description("Points revoked due to cancellation")
                .pointsChange(-pointsToDeduct)
                .createdAt(Instant.now())
                .build();
        loyaltyTransactionRepository.save(tx);
        log.info("Revoked {} points from user: {}", pointsToDeduct, user.getEmail());
    }

    public Integer validateCoupon(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        Coupon coupon = couponRepository.findByCodeAndUserId(code.trim(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid coupon code or not owned by you."));
        if (coupon.getStatus() != Coupon.CouponStatus.ACTIVE) {
            throw new IllegalArgumentException("Coupon is already used or expired.");
        }
        return coupon.getDiscountPercentage();
    }

    private void updateMembershipLevel(User user) {
        int pts = user.getRewardPoints();
        if (pts >= 50000) {
            user.setMembershipLevel("Platinum Elite");
        } else if (pts >= 25000) {
            user.setMembershipLevel("Gold Member");
        } else {
            user.setMembershipLevel("Silver Tier");
        }
    }

    private int calculateNextTierPoints(int currentPoints) {
        if (currentPoints < 25000) return 25000;
        if (currentPoints < 50000) return 50000;
        return currentPoints; // Already max tier
    }
}
