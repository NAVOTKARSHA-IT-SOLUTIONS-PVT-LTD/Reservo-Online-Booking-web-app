package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.dto.RazorpayOrderResponse;
import com.reservo.backend.dto.RazorpayVerifyRequest;
import com.reservo.backend.entity.Booking;
import com.reservo.backend.entity.Coupon;
import com.reservo.backend.entity.Resort;
import com.reservo.backend.repository.CouponRepository;
import com.reservo.backend.service.BookingService;
import com.reservo.backend.service.RazorpayService;
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
    private final RazorpayService razorpayService;
    private final com.reservo.backend.repository.ResortRepository resortRepository;

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
            @RequestParam(defaultValue = "2") int adults,
            @RequestParam(defaultValue = "0") int children,
            @RequestParam(defaultValue = "1") int roomsCount,
            @RequestParam(required = false) String couponCode,
            @RequestParam(required = false) Integer pointsToRedeem,
            @RequestParam(required = false) String guestName,
            @RequestParam(required = false) String guestPhone,
            @RequestParam String successUrl,
            @RequestParam String cancelUrl) {
        try {
            User user = resolveEffectiveUser(userId);
            String effectiveUserId = user.getId();

            // Never trust the amount calculated by the browser. Recalculate the
            // canonical pre-discount price from the Firestore resort + dates.
            BigDecimal calculatedAmount = bookingService.calculateBaseBookingAmount(
                    resortId, roomId, LocalDate.parse(checkIn), LocalDate.parse(checkOut),
                    Math.max(1, Math.max(roomsCount, Math.max((int) Math.ceil(adults / 2.0), (int) Math.ceil(children / 2.0)))));

            // KYC validation rule: > ₹50,000 amount requires verified status
            if (calculatedAmount.compareTo(BigDecimal.valueOf(50000)) > 0 && user.getKycStatus() != User.KycStatus.VERIFIED) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Identity verification (KYC) required for bookings over ₹50,000.", 400));
            }

            BigDecimal discountAmount = BigDecimal.ZERO;
            if (couponCode != null && !couponCode.trim().isEmpty()) {
                Coupon coupon = couponService.getAndValidateCoupon(couponCode.trim(), effectiveUserId, resortId, calculatedAmount);
                if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
                    discountAmount = calculatedAmount.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
                } else {
                    discountAmount = coupon.getDiscountValue().min(calculatedAmount);
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
                BigDecimal remainingAmount = calculatedAmount.subtract(discountAmount);
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

            BigDecimal finalAmount = calculatedAmount.subtract(discountAmount).subtract(pointsDiscount).max(BigDecimal.ZERO);

            // Payment is intentionally not implemented yet.
            // Only a fully discounted (₹0) reservation may be completed without
            // a payment gateway. For any positive amount, fail before creating
            // a booking so we never leave an unpaid PENDING reservation behind.
            if (finalAmount.compareTo(BigDecimal.ZERO) > 0) {
                log.info("Payment required for checkout but payment module is not implemented yet. Amount: {}",
                        finalAmount);
                return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
                        .body(ApiResponse.error(
                                "Payment module not implemented yet. Your booking was not created. " +
                                "Please use a 100% discount/promo code for now.",
                                HttpStatus.NOT_IMPLEMENTED.value()));
            }

            // ============================================================
            // ZERO-TOTAL BOOKING
            // ============================================================
            // A 100% coupon (or other combination of discounts) can make
            // the final amount exactly zero. In that case NO payment
            // gateway should be called. Create and confirm the reservation
            // immediately as a fully-comped booking.
            Booking booking = bookingService.createBooking(
                    effectiveUserId, resortId, roomId,
                    LocalDate.parse(checkIn), LocalDate.parse(checkOut),
                    BigDecimal.ZERO, guestName, guestPhone,
                    (couponCode != null && !couponCode.trim().isEmpty()) ? couponCode.trim().toUpperCase() : null,
                    discountAmount, redeemedPoints, pointsDiscount,
                    Math.max(1, adults), Math.max(0, children),
                    Math.max(1, Math.max(roomsCount, Math.max((int) Math.ceil(adults / 2.0), (int) Math.ceil(children / 2.0))))
            );

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
        } catch (IllegalStateException e) {
            log.warn("Checkout rejected because dates are unavailable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), HttpStatus.CONFLICT.value()));
        } catch (Exception e) {
            log.error("Failed to process checkout", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to process checkout: " + e.getMessage(), 500));
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

    // ============================================================
    // RAZORPAY PAYMENT ENDPOINTS (100% Leak-Proof & Secure)
    // ============================================================

    /**
     * Step 1: Create a secure Razorpay Order.
     * Price is NEVER accepted from the client; it is recalculated canonical from DB.
     * Secret Key NEVER leaves the server; only public keyId is returned.
     */
    @PostMapping("/razorpay/create-order")
    public ResponseEntity<ApiResponse<RazorpayOrderResponse>> createRazorpayOrder(
            @RequestParam(required = false) String userId,
            @RequestParam String resortId,
            @RequestParam String roomId,
            @RequestParam String checkIn,
            @RequestParam String checkOut,
            @RequestParam(defaultValue = "2") int adults,
            @RequestParam(defaultValue = "0") int children,
            @RequestParam(defaultValue = "1") int roomsCount,
            @RequestParam(required = false) String couponCode,
            @RequestParam(required = false) Integer pointsToRedeem,
            @RequestParam(required = false) String guestName,
            @RequestParam(required = false) String guestPhone,
            @RequestParam(required = false) String successUrl) {
        try {
            User user = resolveEffectiveUser(userId);
            String effectiveUserId = user.getId();

            Resort resort = resortRepository.findById(resortId)
                    .orElseThrow(() -> new IllegalArgumentException("Resort not found with ID: " + resortId));

            int effectiveRooms = Math.max(1, Math.max(roomsCount, Math.max((int) Math.ceil(adults / 2.0), (int) Math.ceil(children / 2.0))));

            // Server-side canonical price recalculation (Prevents client tampering)
            BigDecimal calculatedAmount = bookingService.calculateBaseBookingAmount(
                    resortId, roomId, LocalDate.parse(checkIn), LocalDate.parse(checkOut), effectiveRooms);

            // KYC validation rule: > ₹50,000 amount requires verified status
            if (calculatedAmount.compareTo(BigDecimal.valueOf(50000)) > 0 && user.getKycStatus() != User.KycStatus.VERIFIED) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Identity verification (KYC) required for bookings over ₹50,000.", 400));
            }

            // Coupon validation
            BigDecimal discountAmount = BigDecimal.ZERO;
            if (couponCode != null && !couponCode.trim().isEmpty()) {
                Coupon coupon = couponService.getAndValidateCoupon(couponCode.trim(), effectiveUserId, resortId, calculatedAmount);
                if (coupon.getDiscountType() == Coupon.DiscountType.PERCENTAGE) {
                    discountAmount = calculatedAmount.multiply(coupon.getDiscountValue().divide(BigDecimal.valueOf(100)));
                } else {
                    discountAmount = coupon.getDiscountValue().min(calculatedAmount);
                }
                log.info("Applied coupon {} for discount: {}", couponCode, discountAmount);
            }

            // Loyalty points redemption
            BigDecimal pointsDiscount = BigDecimal.ZERO;
            int redeemedPoints = 0;
            if (pointsToRedeem != null && pointsToRedeem > 0) {
                if (user.getRewardPoints() < pointsToRedeem) {
                    throw new IllegalArgumentException("Insufficient points balance.");
                }
                BigDecimal pointsValue = BigDecimal.valueOf(pointsToRedeem).divide(BigDecimal.valueOf(10), 2, java.math.RoundingMode.HALF_UP);
                BigDecimal remainingAmount = calculatedAmount.subtract(discountAmount);
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

            BigDecimal finalAmount = calculatedAmount.subtract(discountAmount).subtract(pointsDiscount).max(BigDecimal.ZERO);

            // 1. ZERO-TOTAL FLOW (100% Comped Booking)
            if (finalAmount.compareTo(BigDecimal.ZERO) == 0) {
                Booking compedBooking = bookingService.createBooking(
                        effectiveUserId, resortId, roomId,
                        LocalDate.parse(checkIn), LocalDate.parse(checkOut),
                        BigDecimal.ZERO, guestName, guestPhone,
                        (couponCode != null && !couponCode.trim().isEmpty()) ? couponCode.trim().toUpperCase() : null,
                        discountAmount, redeemedPoints, pointsDiscount,
                        Math.max(1, adults), Math.max(0, children), effectiveRooms
                );

                bookingService.confirmBooking(
                        compedBooking.getBookingCode(),
                        "FREE_" + System.currentTimeMillis(),
                        "ZERO_TOTAL_COUPON"
                );

                if (couponCode != null && !couponCode.trim().isEmpty()) {
                    couponService.incrementCouponUsage(couponCode.trim());
                }

                String redirect = "/payment/success?bookingCode=" + compedBooking.getBookingCode();
                RazorpayOrderResponse response = RazorpayOrderResponse.builder()
                        .isComped(true)
                        .bookingCode(compedBooking.getBookingCode())
                        .amountInRupees(BigDecimal.ZERO)
                        .amountInPaise(0L)
                        .currency("INR")
                        .redirectUrl(redirect)
                        .build();

                return ResponseEntity.ok(ApiResponse.success(response, "Reservation completed without payment."));
            }

            // 2. STANDARD RAZORPAY FLOW
            Booking pendingBooking = bookingService.createBooking(
                    effectiveUserId, resortId, roomId,
                    LocalDate.parse(checkIn), LocalDate.parse(checkOut),
                    finalAmount, guestName, guestPhone,
                    (couponCode != null && !couponCode.trim().isEmpty()) ? couponCode.trim().toUpperCase() : null,
                    discountAmount, redeemedPoints, pointsDiscount,
                    Math.max(1, adults), Math.max(0, children), effectiveRooms
            );

            String razorpayOrderId = razorpayService.createOrder(pendingBooking, resort.getName());
            long amountInPaise = finalAmount.multiply(BigDecimal.valueOf(100)).longValue();

            RazorpayOrderResponse response = RazorpayOrderResponse.builder()
                    .orderId(razorpayOrderId)
                    .amountInPaise(amountInPaise)
                    .amountInRupees(finalAmount)
                    .currency("INR")
                    .keyId(razorpayService.getKeyId()) // Public Key ID ONLY
                    .bookingCode(pendingBooking.getBookingCode())
                    .resortName(resort.getName())
                    .userName(user.getName() != null ? user.getName() : user.getDisplayName())
                    .userEmail(user.getEmail())
                    .userPhone(user.getPhoneNumber() != null ? user.getPhoneNumber() : guestPhone)
                    .isComped(false)
                    .build();

            return ResponseEntity.ok(ApiResponse.success(response, "Razorpay order created successfully."));
        } catch (IllegalStateException e) {
            log.warn("Razorpay order creation rejected: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error(e.getMessage(), HttpStatus.CONFLICT.value()));
        } catch (Exception e) {
            log.error("Failed to create Razorpay order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to initiate payment: " + e.getMessage(), 500));
        }
    }

    /**
     * Step 2: Verify Cryptographic Payment Signature using HMAC-SHA256.
     * Confirms the booking only after mathematical proof of payment.
     */
    @PostMapping("/razorpay/verify")
    public ResponseEntity<ApiResponse<Booking>> verifyRazorpayPayment(@RequestBody RazorpayVerifyRequest request) {
        try {
            log.info("Verifying Razorpay payment for booking {}", request.getBookingCode());

            boolean isValid = razorpayService.verifyPaymentSignature(
                    request.getRazorpayOrderId(),
                    request.getRazorpayPaymentId(),
                    request.getRazorpaySignature()
            );

            if (!isValid) {
                log.error("SECURITY ALERT: Razorpay payment signature verification failed for booking {}. Possible client-side tampering!",
                        request.getBookingCode());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Payment verification failed. Cryptographic signature does not match.", 400));
            }

            Booking confirmedBooking = bookingService.confirmBooking(
                    request.getBookingCode(),
                    request.getRazorpayPaymentId(),
                    "RAZORPAY"
            );

            // Increment coupon usage if coupon was attached
            if (confirmedBooking.getCouponCode() != null && !confirmedBooking.getCouponCode().trim().isEmpty()) {
                try {
                    couponService.incrementCouponUsage(confirmedBooking.getCouponCode());
                } catch (Exception e) {
                    log.warn("Could not increment coupon count for {}", confirmedBooking.getCouponCode(), e);
                }
            }

            log.info("Successfully verified Razorpay payment {} for booking {}",
                    request.getRazorpayPaymentId(), request.getBookingCode());

            return ResponseEntity.ok(ApiResponse.success(confirmedBooking, "Payment verified and reservation confirmed!"));
        } catch (Exception e) {
            log.error("Failed to verify Razorpay payment for booking {}", request.getBookingCode(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Payment verification processing failed: " + e.getMessage(), 500));
        }
    }

    /**
     * Step 3: Webhook fallback for Razorpay asynchronous payment events.
     * Automatically confirms booking if user disconnects network during checkout.
     */
    @PostMapping("/razorpay/webhook")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {

        if (signature == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing X-Razorpay-Signature header");
        }

        boolean isValid = razorpayService.verifyWebhookSignature(payload, signature);
        if (!isValid) {
            log.error("SECURITY ALERT: Razorpay webhook signature verification failed!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook signature mismatch");
        }

        try {
            org.json.JSONObject event = new org.json.JSONObject(payload);
            String eventType = event.optString("event");
            log.info("Received valid Razorpay webhook event: {}", eventType);

            if ("payment.captured".equals(eventType) || "order.paid".equals(eventType)) {
                org.json.JSONObject paymentEntity = event.optJSONObject("payload")
                        .optJSONObject("payment")
                        .optJSONObject("entity");

                if (paymentEntity != null) {
                    String paymentId = paymentEntity.optString("id");
                    org.json.JSONObject notes = paymentEntity.optJSONObject("notes");
                    String bookingCode = notes != null ? notes.optString("bookingCode") : null;

                    if (bookingCode != null && !bookingCode.isBlank()) {
                        bookingService.confirmBooking(bookingCode, paymentId, "RAZORPAY_WEBHOOK");
                        log.info("Razorpay Webhook successfully confirmed booking {}", bookingCode);
                    }
                }
            }
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            log.error("Error processing Razorpay webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Webhook processing failed");
        }
    }
}
