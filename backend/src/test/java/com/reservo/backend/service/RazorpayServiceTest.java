package com.reservo.backend.service;

import com.reservo.backend.entity.Booking;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

class RazorpayServiceTest {

    private RazorpayService razorpayService;
    private final String testKeySecret = "test_secret_1234567890abcdef";

    @BeforeEach
    void setUp() {
        razorpayService = new RazorpayService();
        ReflectionTestUtils.setField(razorpayService, "keyId", "rzp_test_123456");
        ReflectionTestUtils.setField(razorpayService, "keySecret", testKeySecret);
        ReflectionTestUtils.setField(razorpayService, "webhookSecret", "whsec_test_secret_12345");
    }

    private String calculateExpectedSignature(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] rawHmac = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        for (byte b : rawHmac) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }

    @Test
    @DisplayName("Should successfully verify a genuine cryptographic payment signature")
    void testVerifyPaymentSignature_Success() throws Exception {
        String orderId = "order_O123456789";
        String paymentId = "pay_P987654321";
        String validSignature = calculateExpectedSignature(orderId + "|" + paymentId, testKeySecret);

        boolean result = razorpayService.verifyPaymentSignature(orderId, paymentId, validSignature);
        assertTrue(result, "Cryptographically valid HMAC-SHA256 signature should pass verification");
    }

    @Test
    @DisplayName("Should reject forged or tampered payment signature")
    void testVerifyPaymentSignature_Tampered_Rejected() {
        String orderId = "order_O123456789";
        String paymentId = "pay_P987654321";
        String fakeSignature = "fake_forged_signature_00000000000000000000000000000000";

        boolean result = razorpayService.verifyPaymentSignature(orderId, paymentId, fakeSignature);
        assertFalse(result, "Forged signature must be rejected immediately to prevent fraud");
    }

    @Test
    @DisplayName("Should generate a valid order for booking")
    void testCreateOrder_ValidBooking() {
        Booking booking = Booking.builder()
                .bookingCode("RES-999")
                .totalAmount(BigDecimal.valueOf(9500))
                .userId("user-1")
                .resortId("resort-1")
                .build();

        String orderId = razorpayService.createOrder(booking, "Goa Luxury Retreat");
        assertNotNull(orderId);
        assertTrue(orderId.startsWith("order_"));
    }
}
