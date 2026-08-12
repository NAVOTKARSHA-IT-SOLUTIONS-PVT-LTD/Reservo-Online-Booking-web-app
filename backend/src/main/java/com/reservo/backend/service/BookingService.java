package com.reservo.backend.service;

import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.entity.*;
import com.reservo.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResortRepository resortRepository;
    private final RoomRepository roomRepository;
    private final PaymentRepository paymentRepository;
    private final EmailService emailService;
    private final StripeService stripeService;
    private final LoyaltyService loyaltyService;

    @Transactional
    public Booking createBooking(Long userId, Long resortId, Long roomId, LocalDate checkIn, LocalDate checkOut, BigDecimal amount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        Resort resort = resortRepository.findById(resortId)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found with ID: " + resortId));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

        String code = "RS" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Booking booking = Booking.builder()
                .bookingCode(code)
                .user(user)
                .resort(resort)
                .room(room)
                .checkInDate(checkIn)
                .checkOutDate(checkOut)
                .totalAmount(amount)
                .status(Booking.BookingStatus.PENDING) // Starts as PENDING for checkout session
                .bookingSource(Booking.BookingSource.DIRECT)
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking confirmBooking(String bookingCode, String paymentIntentId, String paymentMethod) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with code: " + bookingCode));

        if (booking.getStatus() == Booking.BookingStatus.PENDING) {
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            booking = bookingRepository.save(booking);

            // Log secure payment receipt in database
            Payment payment = Payment.builder()
                    .transactionId(paymentIntentId)
                    .booking(booking)
                    .amount(booking.getTotalAmount())
                    .paymentMethod(paymentMethod != null ? paymentMethod : "STRIPE")
                    .status(Payment.PaymentStatus.SUCCESS)
                    .createdAt(Instant.now())
                    .build();
            paymentRepository.save(payment);

            // Award loyalty rewards points
            loyaltyService.awardPoints(booking.getUser(), booking.getTotalAmount());

            log.info("Booking {} successfully paid and confirmed with transaction ID: {}", bookingCode, paymentIntentId);

            // Send confirmation email
            User user = booking.getUser();
            emailService.sendBookingConfirmationEmail(
                    user.getEmail(),
                    user.getName(),
                    booking.getBookingCode(),
                    booking.getResort().getName(),
                    booking.getTotalAmount().toString()
            );
        }
        return booking;
    }

    @Transactional
    public Booking cancelAndRefundBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled");
        }

        // Retrieve successful payment details
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("No successful payment record found for this booking"));

        try {
            // Trigger Stripe Refund API
            stripeService.refundPayment(payment.getTransactionId(), payment.getAmount());
            
            // Mark payment as REFUNDED
            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            paymentRepository.save(payment);

            // Mark booking as CANCELLED
            booking.setStatus(Booking.BookingStatus.CANCELLED);
            booking = bookingRepository.save(booking);

            // Revoke loyalty rewards points
            loyaltyService.revokePoints(booking.getUser(), booking.getTotalAmount());

            log.info("Booking {} cancelled and payment refunded successfully.", booking.getBookingCode());
        } catch (Exception e) {
            log.error("Stripe refund failed for booking ID: {}, Error: {}", bookingId, e.getMessage());
            throw new RuntimeException("Refund processing failed. Please try again or contact support: " + e.getMessage());
        }

        return booking;
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
    }

    public Booking updateBookingStatus(Long bookingId, Booking.BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}
