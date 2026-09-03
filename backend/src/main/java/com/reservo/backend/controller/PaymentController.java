package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.entity.Booking;
import com.reservo.backend.entity.Coupon;
import com.reservo.backend.repository.CouponRepository;
import com.reservo.backend.service.BookingService;
import com.reservo.backend.service.StripeService;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.reservo.backend.repository.UserRepository;
import com.reservo.backend.service.CouponService;
import com.reservo.backend.entity.User;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final BookingService bookingService;
    private final StripeService stripeService;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final CouponService couponService;
    private final com.reservo.backend.service.AuthService authService;

    @Value("${app.stripe.webhook-secret}")
    private String endpointSecret;

    private User resolveEffectiveUser(String requestedUserId) {
        java.util.Optional<User> authUser = authService.getOptionalAuthenticatedUser();
        if (authUser.isPresent()) {
            User user = authUser.get();
            if (user.getRole() == User.Role.ROLE_ADMIN && requestedUserId != null && !requestedUserId.isBlank()) {
                return userRepository.findById(requestedUserId)
                        .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + requestedUserId));
            }
            return user;
        }
        if (requestedUserId != null && !requestedUserId.isBlank()) {
            return userRepository.findById(requestedUserId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + requestedUserId));
        }
        throw new IllegalArgumentException("Authenticated user context or valid User ID is required");
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<String>> createCheckoutSession(
            @RequestParam(required = false) String userId,
            @RequestParam String resortId,
            @RequestParam String roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String couponCode,
            @RequestParam(required = false) Integer pointsToRedeem,
            @RequestParam(required = false) String guestName,
            @RequestParam(required = false) String guestPhone,
            @RequestParam String successUrl,
            @RequestParam String cancelUrl) {
        try {
            User user = resolveEffectiveUser(userId);
            String effectiveUserId = user.getId();

            // KYC validation rule: > ₹50,000 amount requires verified status
            if (amount.compareTo(BigDecimal.valueOf(50000)) > 0 && user.getKycStatus() != User.KycStatus.VERIFIED) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Identity verification (KYC) required for bookings over ₹50,000.", 400));
            }

            BigDecimal discountAmount = BigDecimal.ZERO;
            if (couponCode != null && !couponCode.trim().isEmpty()) {
                Coupon coupon = couponService.getAndValidateCoupon(couponCode.trim(), effectiveUserId, resortId, amount);
                if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
                    discountAmount = amount.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
                } else {
                    discountAmount = coupon.getDiscountValue().min(amount);
                }
                log.info("Applied coupon {} for discount: {}", couponCode, discountAmount);
            }

            BigDecimal pointsDiscount = BigDecimal.ZERO;
            int redeemedPoints = 0;
            if (pointsToRedeem != null && pointsToRedeem > 0) {
                if (user.getRewardPoints() < pointsToRedeem) {
                    throw new IllegalArgumentException("Insufficient points balance.");
                }
                BigDecimal pointsValue = BigDecimal.valueOf(pointsToRedeem).divide(BigDecimal.valueOf(10), 2, java.math.RoundingMode.HALF_UP);
                BigDecimal remainingAmount = amount.subtract(discountAmount);
                BigDecimal maxPointsValueAllowed = remainingAmount.multiply(BigDecimal.valueOf(0.5));
                if (pointsValue.compareTo(maxPointsValueAllowed) > 0) {
                    pointsValue = maxPointsValueAllowed;
                    redeemedPoints = pointsValue.multiply(BigDecimal.valueOf(10)).intValue();
                } else {
                    redeemedPoints = pointsToRedeem;
                }
                pointsDiscount = pointsValue;
                log.info("Applied reward points discount: {} (Redeemed: {} points)", pointsDiscount, redeemedPoints);
            }

            BigDecimal finalAmount = amount.subtract(discountAmount).subtract(pointsDiscount).max(BigDecimal.ZERO);

            // Create pending booking
            Booking booking = bookingService.createBooking(
                    effectiveUserId, resortId, roomId,
                    LocalDate.parse(checkIn), LocalDate.parse(checkOut),
                    finalAmount, guestName, guestPhone,
                    (couponCode != null && !couponCode.trim().isEmpty()) ? couponCode.trim().toUpperCase() : null,
                    discountAmount, redeemedPoints, pointsDiscount
            );

            // ============================================================
            // ZERO-TOTAL BOOKING
            // ============================================================
            // A 100% coupon (or other combination of discounts) can make
            // the final amount exactly zero. In that case NO payment
            // gateway should be called. The reservation is confirmed
            // immediately as a fully-comped/mock booking.
            if (finalAmount.compareTo(BigDecimal.ZERO) == 0) {
                log.info("Zero-total booking {}. Completing reservation without payment gateway.",
                        booking.getBookingCode());

                bookingService.confirmBooking(
                        booking.getBookingCode(),
                        "FREE_" + System.currentTimeMillis(),
                        "ZERO_TOTAL_COUPON"
                );

                if (couponCode != null && !couponCode.trim().isEmpty()) {
                    couponService.incrementCouponUsage(couponCode.trim());
                }

                String zeroTotalSuccessUrl = appendBookingCode(successUrl, booking.getBookingCode());
                return ResponseEntity.ok(
                        ApiResponse.success(
                                zeroTotalSuccessUrl,
                                "Reservation completed successfully. No payment was required."
                        )
                );
            }

            // ============================================================
            // DEVELOPMENT MOCK PAYMENT
            // ============================================================
            if (stripeService.isPlaceholderKey()) {
                log.warn("Stripe API key is a placeholder. Falling back to local mock payment simulation.");

                bookingService.confirmBooking(
                        booking.getBookingCode(),
                        "ch_mock_" + System.currentTimeMillis(),
                        "MOCK_UPI"
                );

                if (couponCode != null && !couponCode.trim().isEmpty()) {
                    couponService.incrementCouponUsage(couponCode.trim());
                }

                String mockSuccessUrl = appendBookingCode(successUrl, booking.getBookingCode());
                return ResponseEntity.ok(
                        ApiResponse.success(
                                mockSuccessUrl,
                                "Mock payment completed successfully"
                        )
                );
            }

            // Create Stripe Checkout session
            Session session = stripeService.createCheckoutSession(booking, successUrl, cancelUrl, couponCode);
            return ResponseEntity.ok(ApiResponse.success(session.getUrl(), "Checkout session generated successfully"));
        } catch (Exception e) {
            log.error("Failed to generate Stripe checkout session", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to generate payment link: " + e.getMessage(), 500));
        }
    }

    private String appendBookingCode(String successUrl, String bookingCode) {
        String separator = successUrl.contains("?") ? "&" : "?";
        return successUrl + separator + "bookingCode=" +
                java.net.URLEncoder.encode(bookingCode, java.nio.charset.StandardCharsets.UTF_8);
    }

    @PostMapping("/refund/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> refundBooking(@PathVariable String bookingId) {
        try {
            Booking booking = bookingService.cancelAndRefundBooking(bookingId);
            return ResponseEntity.ok(ApiResponse.success(booking, "Booking cancelled and payment refunded successfully"));
        } catch (Exception e) {
            log.error("Refund processing failed for booking ID: {}", bookingId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage(), 400));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, HttpServletRequest request) {
        String sigHeader = request.getHeader("Stripe-Signature");
        if (sigHeader == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing Stripe-Signature header");
        }

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (Exception e) {
            log.error("Stripe Webhook Signature Verification failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Signature verification failed");
        }

        log.info("Received secure Stripe event: {}", event.getType());

        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            if (dataObjectDeserializer.getObject().isPresent()) {
                Session session = (Session) dataObjectDeserializer.getObject().get();
                String bookingCode = session.getMetadata().get("bookingCode");
                String paymentIntentId = session.getPaymentIntent();
                String paymentMethod = session.getPaymentMethodTypes() != null && !session.getPaymentMethodTypes().isEmpty() 
                        ? session.getPaymentMethodTypes().get(0).toUpperCase() 
                        : "CARD";

                try {
                    bookingService.confirmBooking(bookingCode, paymentIntentId, paymentMethod);
                    
                    // Consume Stripe Session Coupon if applied
                    String couponCode = session.getMetadata().get("couponCode");
                    if (couponCode != null && !couponCode.trim().isEmpty()) {
                        couponService.incrementCouponUsage(couponCode.trim());
                        log.info("Webhook successfully consumed coupon: {}", couponCode);
                    }

                    log.info("Webhook successfully confirmed booking: {}", bookingCode);
                } catch (Exception e) {
                    log.error("Failed to confirm booking from Webhook", e);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Booking confirmation failed");
                }
            }
        }

        return ResponseEntity.ok("Received");
    }
}
