package com.reservo.backend.service;

import com.reservo.backend.entity.Booking;
import com.stripe.Stripe;
import com.stripe.model.Refund;
import com.stripe.model.checkout.Session;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
public class StripeService {

    @Value("${app.stripe.api-key}")
    private String apiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = apiKey;
        log.info("Stripe SDK initialized successfully.");
    }

    /**
     * Creates a Stripe Checkout Session for a pending Booking.
     * Supports both Credit/Debit Cards and UPI payments.
     */
    public Session createCheckoutSession(Booking booking, String successUrl, String cancelUrl) throws Exception {
        // Stripe expects unit amounts in cents/paise (multiply by 100)
        long unitAmount = booking.getTotalAmount().multiply(BigDecimal.valueOf(100)).longValue();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl + "?bookingCode=" + booking.getBookingCode())
                .setCancelUrl(cancelUrl)

                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("inr") // UPI requires INR currency mapping
                                .setUnitAmount(unitAmount)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(booking.getResort().getName() + " - Room Reservation")
                                        .setDescription("Booking Code: " + booking.getBookingCode())
                                        .build())
                                .build())
                        .build())
                .putMetadata("bookingCode", booking.getBookingCode())
                .build();

        return Session.create(params);
    }

    /**
     * Process refunds for bookings via Stripe charge/PaymentIntent reference.
     */
    public Refund refundPayment(String paymentIntentId, BigDecimal amount) throws Exception {
        long refundAmount = amount.multiply(BigDecimal.valueOf(100)).longValue();

        RefundCreateParams params = RefundCreateParams.builder()
                .setPaymentIntent(paymentIntentId)
                .setAmount(refundAmount)
                .build();

        log.info("Initiating Stripe refund for PaymentIntent: {} of amount: {}", paymentIntentId, amount);
        return Refund.create(params);
    }
}
