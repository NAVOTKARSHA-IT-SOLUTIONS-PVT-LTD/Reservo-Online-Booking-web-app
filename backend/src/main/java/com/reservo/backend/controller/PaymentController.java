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

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final BookingService bookingService;
    private final StripeService stripeService;
    private final CouponRepository couponRepository;

    @Value("${app.stripe.webhook-secret}")
    private String endpointSecret;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<String>> createCheckoutSession(
            @RequestParam Long userId,
            @RequestParam Long resortId,
            @RequestParam Long roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String couponCode,
            @RequestParam String successUrl,
            @RequestParam String cancelUrl) {
        try {
            BigDecimal finalAmount = amount;

            if (couponCode != null && !couponCode.trim().isEmpty()) {
                Coupon coupon = couponRepository.findByCodeAndUserId(couponCode.trim(), userId)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid coupon code or not owned by you."));
                if (coupon.getStatus() != Coupon.CouponStatus.ACTIVE) {
                    throw new IllegalArgumentException("Coupon code has already been used or expired.");
                }

                // Apply discount (e.g. 10% off)
                BigDecimal discountMultiplier = BigDecimal.valueOf(100 - coupon.getDiscountPercentage())
                        .divide(BigDecimal.valueOf(100));
                finalAmount = amount.multiply(discountMultiplier);
                log.info("Applied coupon {} for discount. Final amount: {}", couponCode, finalAmount);
            }

            // Create pending booking
            Booking booking = bookingService.createBooking(
                    userId, resortId, roomId,
                    LocalDate.parse(checkIn), LocalDate.parse(checkOut),
                    finalAmount
            );

            // Check for placeholder key simulation fallback
            if (stripeService.isPlaceholderKey()) {
                log.warn("Stripe API key is a placeholder. Falling back to local mock payment simulation.");
                // Confirm booking and trigger mock receipt log & confirmation email
                bookingService.confirmBooking(booking.getBookingCode(), "ch_mock_" + System.currentTimeMillis(), "MOCK_UPI");
                
                if (couponCode != null && !couponCode.trim().isEmpty()) {
                    couponRepository.findByCode(couponCode.trim()).ifPresent(coupon -> {
                        coupon.setStatus(Coupon.CouponStatus.USED);
                        couponRepository.save(coupon);
                    });
                }

                String mockSuccessUrl = successUrl + "?bookingCode=" + booking.getBookingCode();
                return ResponseEntity.ok(ApiResponse.success(mockSuccessUrl, "Mock payment link generated successfully"));
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

    @PostMapping("/refund/{bookingId}")
    public ResponseEntity<ApiResponse<Booking>> refundBooking(@PathVariable Long bookingId) {
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
                        couponRepository.findByCode(couponCode.trim()).ifPresent(coupon -> {
                            coupon.setStatus(Coupon.CouponStatus.USED);
                            couponRepository.save(coupon);
                            log.info("Webhook successfully consumed coupon: {}", couponCode);
                        });
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
