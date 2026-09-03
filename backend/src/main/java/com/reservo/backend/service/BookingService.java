package com.reservo.backend.service;

import com.reservo.backend.dto.BookingHistoryResponse;
import com.reservo.backend.entity.*;
import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
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
    private final NotificationService notificationService;
    private final LoyaltyTransactionRepository loyaltyTransactionRepository;

    public Booking createBooking(
            String userId, String resortId, String roomId,
            LocalDate checkIn, LocalDate checkOut, BigDecimal amount,
            String guestName, String guestPhone, String couponCode,
            BigDecimal discountAmount, Integer pointsUsed, BigDecimal pointsValue) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        Resort resort = resortRepository.findById(resortId)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found with ID: " + resortId));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

        validateDatesAndAmount(checkIn, checkOut, amount);

        if (room.getStatus() != Room.RoomStatus.AVAILABLE) {
            throw new IllegalStateException("Room " + room.getRoomNumber() + " is currently not available");
        }

        if (room.getResortId() != null && !room.getResortId().equals(resortId)) {
            throw new IllegalStateException("Room " + roomId + " does not belong to resort " + resortId);
        }

        String code = "RS" + UUID.randomUUID().toString().replace("-", "")
                .substring(0, 8).toUpperCase();

        Booking booking = Booking.builder()
                .bookingCode(code)
                .userId(userId)
                .resortId(resortId)
                .roomId(roomId)
                .checkInDate(checkIn)
                .checkOutDate(checkOut)
                .guestsCount(2)
                .roomsCount(1)
                .totalAmount(amount)
                .guestName(guestName)
                .guestPhone(guestPhone)
                .appliedCouponCode(couponCode)
                .discountAmount(discountAmount != null ? discountAmount : BigDecimal.ZERO)
                .rewardPointsUsed(pointsUsed != null ? pointsUsed : 0)
                .rewardPointsValue(pointsValue != null ? pointsValue : BigDecimal.ZERO)
                .status(Booking.BookingStatus.PENDING)
                .bookingSource(Booking.BookingSource.DIRECT)
                .createdAt(Instant.now())
                .build();

        return bookingRepository.save(booking);
    }

    public Booking confirmBooking(String bookingCode, String paymentIntentId, String paymentMethod) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with code: " + bookingCode));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) return booking;

        User user = getUser(booking.getUserId());
        Resort resort = getResort(booking.getResortId());

        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);

        // A zero-total booking is fully comped. It must not create a
        // payment record or invoke/pretend to invoke a payment gateway.
        if (booking.getTotalAmount() != null
                && booking.getTotalAmount().compareTo(BigDecimal.ZERO) > 0) {
            Payment payment = Payment.builder()
                    .transactionId(paymentIntentId)
                    .bookingId(booking.getId())
                    .amount(booking.getTotalAmount())
                    .paymentMethod(paymentMethod != null ? paymentMethod : "STRIPE")
                    .status(Payment.PaymentStatus.SUCCESS)
                    .createdAt(Instant.now())
                    .build();
            paymentRepository.save(payment);
        }

        loyaltyService.awardPoints(user, booking.getTotalAmount());

        int used = booking.getRewardPointsUsed() != null ? booking.getRewardPointsUsed() : 0;
        if (used > 0) {
            user.setRewardPoints(Math.max(0, user.getRewardPoints() - used));
            userRepository.save(user);

            LoyaltyTransaction tx = LoyaltyTransaction.builder()
                    .userId(user.getId())
                    .description("Points Redeemed for Booking " + booking.getBookingCode())
                    .pointsChange(-used)
                    .createdAt(Instant.now())
                    .build();
            loyaltyTransactionRepository.save(tx);
        }

        try {
            emailService.sendBookingConfirmationEmail(
                    user.getEmail(), user.getName(), booking.getBookingCode(),
                    resort.getName(), booking.getTotalAmount().toString());
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email: {}", e.getMessage());
        }

        try {
            notificationService.createNotification(
                    user, booking, Notification.NotificationType.BOOKING_CONFIRMED,
                    Notification.NotificationChannel.EMAIL, user.getEmail(),
                    "Your booking " + booking.getBookingCode() + " at " +
                            resort.getName() + " has been confirmed successfully.");
        } catch (Exception e) {
            log.error("Failed to create confirmation notification: {}", e.getMessage());
        }

        return booking;
    }

    public Booking cancelAndRefundBooking(String bookingId) {
        Booking booking = getBookingById(bookingId);

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled");
        }

        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No successful payment record found for this booking"));

        try {
            stripeService.refundPayment(payment.getTransactionId(), payment.getAmount());
            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            paymentRepository.save(payment);

            booking.setStatus(Booking.BookingStatus.CANCELLED);
            booking = bookingRepository.save(booking);

            User user = getUser(booking.getUserId());
            Resort resort = getResort(booking.getResortId());

            loyaltyService.revokePoints(user, booking.getTotalAmount());

            String message = "Your booking " + booking.getBookingCode() + " at " +
                    resort.getName() + " has been cancelled successfully. Your refund amount is ₹" +
                    payment.getAmount() + ".";

            try {
                emailService.sendBookingCancellationEmail(
                        user.getEmail(), user.getName(), booking.getBookingCode(),
                        resort.getName(), payment.getAmount().toString());
            } catch (Exception e) {
                log.error("Failed to send cancellation email: {}", e.getMessage());
            }

            try {
                notificationService.createNotification(
                        user, booking, Notification.NotificationType.BOOKING_CANCELLED,
                        Notification.NotificationChannel.EMAIL, user.getEmail(), message);
            } catch (Exception e) {
                log.error("Failed to create cancellation notification: {}", e.getMessage());
            }

            return booking;
        } catch (Exception e) {
            log.error("Refund failed for booking {}: {}", bookingId, e.getMessage());
            throw new RuntimeException("Refund processing failed: " + e.getMessage(), e);
        }
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<BookingHistoryResponse> getUserBookingHistory(String userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    /**
     * Return bookings belonging to properties owned by the authenticated owner.
     * We resolve ownership through the resorts collection instead of trusting a
     * client-supplied ownerId on the booking document.
     */
    public List<Booking> getOwnerBookings(String ownerId) {
        if (ownerId == null || ownerId.isBlank()) {
            return List.of();
        }

        java.util.Set<String> ownedResortIds = resortRepository.findByOwnerId(ownerId)
                .stream()
                .map(Resort::getId)
                .filter(id -> id != null && !id.isBlank())
                .collect(java.util.stream.Collectors.toSet());

        if (ownedResortIds.isEmpty()) {
            return List.of();
        }

        return bookingRepository.findAll().stream()
                .filter(booking -> booking.getResortId() != null)
                .filter(booking -> ownedResortIds.contains(booking.getResortId()))
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .toList();
    }

    public Booking getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with ID: " + bookingId));
    }

    public Booking updateBookingStatus(String bookingId, Booking.BookingStatus status) {
        if (status == null) throw new IllegalArgumentException("Booking status cannot be null");
        Booking booking = getBookingById(bookingId);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    private BookingHistoryResponse toHistoryResponse(Booking booking) {
        Resort resort = booking.getResortId() != null
                ? resortRepository.findById(booking.getResortId()).orElse(null) : null;
        Room room = booking.getRoomId() != null
                ? roomRepository.findById(booking.getRoomId()).orElse(null) : null;

        BookingHistoryResponse.BookingHistoryResponseBuilder builder =
                BookingHistoryResponse.builder()
                        .bookingId(booking.getId())
                        .bookingCode(booking.getBookingCode())
                        .checkInDate(booking.getCheckInDate())
                        .checkOutDate(booking.getCheckOutDate())
                        .guestsCount(booking.getGuestsCount())
                        .roomsCount(booking.getRoomsCount())
                        .totalAmount(booking.getTotalAmount())
                        .status(booking.getStatus())
                        .bookingSource(booking.getBookingSource())
                        .createdAt(booking.getCreatedAt());

        if (resort != null) {
            builder.resortName(resort.getName()).resortLocation(resort.getLocation());
        }
        if (room != null) {
            builder.roomNumber(room.getRoomNumber()).roomType(room.getRoomType());
        }
        return builder.build();
    }

    private User getUser(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    private Resort getResort(String id) {
        return resortRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resort not found with ID: " + id));
    }

    private void validateDatesAndAmount(LocalDate checkIn, LocalDate checkOut, BigDecimal amount) {
        if (checkIn == null || checkOut == null)
            throw new IllegalArgumentException("Check-in and check-out dates are required");
        if (!checkOut.isAfter(checkIn))
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0)
            throw new IllegalArgumentException("Booking amount cannot be negative");
    }
}
