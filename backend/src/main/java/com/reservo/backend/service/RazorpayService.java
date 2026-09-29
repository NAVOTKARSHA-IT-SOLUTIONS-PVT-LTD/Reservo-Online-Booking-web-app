package com.reservo.backend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.reservo.backend.entity.Booking;
import com.reservo.backend.exception.BadRequestException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Slf4j
@Service
public class RazorpayService {

    @Value("${app.razorpay.key-id:rzp_test_placeholder}")
    private String keyId;

    @Value("${app.razorpay.key-secret:rzp_secret_placeholder}")
    private String keySecret;

    @Value("${app.razorpay.webhook-secret:rzp_webhook_placeholder}")
    private String webhookSecret;

    private RazorpayClient client;

    @PostConstruct
    public void init() {
        if (isPlaceholderKey()) {
            log.warn("Razorpay is running with placeholder/test credentials. Live gateway calls will be safely simulated.");
        } else {
            try {
                this.client = new RazorpayClient(keyId, keySecret);
                log.info("Razorpay client initialized successfully with Key ID: {}***", keyId.substring(0, Math.min(8, keyId.length())));
            } catch (Exception e) {
                log.error("Failed to initialize RazorpayClient", e);
            }
        }
    }

    public boolean isPlaceholderKey() {
        return keyId == null || keyId.isBlank()
                || keyId.contains("placeholder")
                || keySecret == null || keySecret.isBlank()
                || keySecret.contains("placeholder");
    }

    public String getKeyId() {
        return keyId;
    }

    /**
     * Creates a secure Razorpay Order for a verified Booking.
     * The amount is calculated strictly in paise (1 INR = 100 paise).
     */
    public String createOrder(Booking booking, String resortName) {
        if (booking.getTotalAmount() == null || booking.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Booking total amount must be greater than zero to create a Razorpay order.");
        }

        long amountInPaise = booking.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

        if (isPlaceholderKey() || client == null) {
            // Simulated order ID for test/offline environments
            String simulatedOrderId = "order_sim_" + System.currentTimeMillis();
            log.info("Generating simulated Razorpay Order {} for booking {} with amount ₹{}",
                    simulatedOrderId, booking.getBookingCode(), booking.getTotalAmount());
            return simulatedOrderId;
        }

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", booking.getBookingCode());

            JSONObject notes = new JSONObject();
            notes.put("bookingCode", booking.getBookingCode());
            notes.put("userId", String.valueOf(booking.getUserId()));
            notes.put("resortId", String.valueOf(booking.getResortId()));
            notes.put("resortName", resortName != null ? resortName : "Reservo Stays");
            orderRequest.put("notes", notes);

            Order order = client.orders.create(orderRequest);
            String orderId = order.get("id");
            log.info("Created Razorpay Order {} for booking {}", orderId, booking.getBookingCode());
            return orderId;
        } catch (Exception e) {
            log.error("Razorpay order creation failed for booking: {}", booking.getBookingCode(), e);
            throw new BadRequestException("Failed to initiate Razorpay order: " + e.getMessage());
        }
    }

    /**
     * Cryptographically verifies the payment signature using HMAC-SHA256.
     * Prevents client-side payment tampering.
     * Signature = HMAC-SHA256(order_id + "|" + payment_id, secret_key)
     */
    public boolean verifyPaymentSignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        if (isPlaceholderKey()) {
            log.info("Simulated environment: auto-approving payment signature for test order {}", razorpayOrderId);
            return true;
        }

        try {
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            String expectedSignature = calculateHmacSha256(payload, keySecret);

            // Constant-time comparison to protect against timing attacks
            return MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    razorpaySignature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            log.error("Failed to verify Razorpay payment signature", e);
            return false;
        }
    }

    /**
     * Verifies the signature of Razorpay Webhook events.
     */
    public boolean verifyWebhookSignature(String webhookPayload, String webhookSignature) {
        if (isPlaceholderKey()) {
            return true;
        }

        try {
            String expectedSignature = calculateHmacSha256(webhookPayload, webhookSecret);
            return MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    webhookSignature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            log.error("Failed to verify Razorpay webhook signature", e);
            return false;
        }
    }

    private String calculateHmacSha256(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(rawHmac);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
