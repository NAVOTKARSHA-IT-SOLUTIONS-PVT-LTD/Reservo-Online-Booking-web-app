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

import com.reservo.backend.dto.CouponValidationResponse;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoyaltyService {

    private final UserRepository userRepository;
    private final LoyaltyTransactionRepository loyaltyTransactionRepository;
    private final CouponRepository couponRepository;
    private final CouponService couponService;

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
                .discountPercentage(10)
                .discountType(Coupon.DiscountType.PERCENTAGE)
                .discountValue(BigDecimal.valueOf(10))
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

    public CouponValidationResponse validateCoupon(String email, String code, Long resortId, BigDecimal bookingAmount) {
        String cleanCode = code.trim().toUpperCase();
        
        // 1. Resolve user ID if email is present
        Long userId = null;
        if (email != null && !email.trim().isEmpty()) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                userId = userOpt.get().getId();
            }
        }

        // 2. Fallback to hardcoded coupons for standard compatibility if not in database
        if (couponRepository.findByCode(cleanCode).isEmpty()) {
            BigDecimal discountPct = BigDecimal.ZERO;
            if (cleanCode.equals("WELCOME10") || cleanCode.equals("SAVE10") || cleanCode.equals("DEMO") || cleanCode.equals("RIVO10") || cleanCode.equals("RIVO-10")) {
                discountPct = BigDecimal.valueOf(10);
            } else if (cleanCode.equals("WELCOME15") || cleanCode.equals("SAVE15") || cleanCode.equals("RIVO15") || cleanCode.equals("RIVO-15")) {
                discountPct = BigDecimal.valueOf(15);
            } else if (cleanCode.equals("WELCOME20") || cleanCode.equals("SAVE20") || cleanCode.equals("RIVO20") || cleanCode.equals("RIVO-20")) {
                discountPct = BigDecimal.valueOf(20);
            }

            if (discountPct.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal calcAmt = bookingAmount != null 
                        ? bookingAmount.multiply(discountPct.divide(BigDecimal.valueOf(100))) 
                        : BigDecimal.ZERO;
                return CouponValidationResponse.builder()
                        .code(cleanCode)
                        .discountType("PERCENTAGE")
                        .discountValue(discountPct)
                        .calculatedDiscount(calcAmt)
                        .build();
            }
        }

        // 3. Perform database validation
        BigDecimal finalAmount = bookingAmount != null ? bookingAmount : BigDecimal.ZERO;
        Coupon coupon = couponService.getAndValidateCoupon(cleanCode, userId, resortId, finalAmount);
        
        BigDecimal calculatedDiscount = BigDecimal.ZERO;
        if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
            calculatedDiscount = finalAmount.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
        } else {
            // FIXED discount
            calculatedDiscount = coupon.getDiscountValue().min(finalAmount);
        }

        return CouponValidationResponse.builder()
                .code(coupon.getCode())
                .discountType(coupon.getDiscountType().name())
                .discountValue(coupon.getDiscountValue())
                .calculatedDiscount(calculatedDiscount)
                .build();
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
