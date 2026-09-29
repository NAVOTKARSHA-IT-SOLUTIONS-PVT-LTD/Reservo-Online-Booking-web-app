package com.reservo.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload sent by the frontend after Razorpay modal payment completes.
 * The backend validates razorpaySignature using HMAC-SHA256 before confirming the reservation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayVerifyRequest {

    @NotBlank(message = "Razorpay Order ID is required")
    private String razorpayOrderId;

    @NotBlank(message = "Razorpay Payment ID is required")
    private String razorpayPaymentId;

    @NotBlank(message = "Razorpay Signature is required")
    private String razorpaySignature;

    @NotBlank(message = "Booking Code is required")
    private String bookingCode;
}
