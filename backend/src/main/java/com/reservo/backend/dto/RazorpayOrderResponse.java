package com.reservo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Public response returned to the frontend to initialize Razorpay Checkout.
 * NOTE: Contains ONLY the public keyId. The keySecret is NEVER exposed.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayOrderResponse {
    private String orderId;
    private Long amountInPaise;
    private BigDecimal amountInRupees;
    private String currency;
    private String keyId; // Public Key ID only
    private String bookingCode;
    private String resortName;
    private String userEmail;
    private String userPhone;
    private String userName;
    private boolean isComped; // True if ₹0 comped booking (no gateway required)
    private String redirectUrl; // If comped, direct success URL
}
