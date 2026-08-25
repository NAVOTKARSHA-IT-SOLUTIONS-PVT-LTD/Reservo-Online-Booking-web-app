package com.reservo.backend.service;

import com.reservo.backend.dto.BookingHistoryResponse;
import com.reservo.backend.entity.*;
import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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


    // ============================================================
    // CREATE BOOKING
    // ============================================================

    @Transactional
    public Booking createBooking(
            Long userId,
            Long resortId,
            Long roomId,
            LocalDate checkIn,
            LocalDate checkOut,
            BigDecimal amount,
            String guestName,
            String guestPhone,
            String couponCode,
            BigDecimal discountAmount,
            Integer pointsUsed,
            BigDecimal pointsValue
    ) {

        // --------------------------------------------------------
        // 1. FIND USER
        // --------------------------------------------------------

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with ID: " + userId
                        )
                );


        // --------------------------------------------------------
        // 2. FIND RESORT
        // --------------------------------------------------------

        Resort resort = resortRepository.findById(resortId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Resort not found with ID: " + resortId
                        )
                );


        // --------------------------------------------------------
        // 3. FIND ROOM
        // --------------------------------------------------------

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with ID: " + roomId
                        )
                );


        // --------------------------------------------------------
        // 4. VALIDATE DATES
        // --------------------------------------------------------

        if (checkIn == null || checkOut == null) {
            throw new IllegalArgumentException(
                    "Check-in and check-out dates are required"
            );
        }

        if (!checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException(
                    "Check-out date must be after check-in date"
            );
        }


        // --------------------------------------------------------
        // 5. VALIDATE AMOUNT
        // --------------------------------------------------------

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Booking amount must be greater than zero"
            );
        }


        // --------------------------------------------------------
        // 6. CHECK ROOM AVAILABILITY
        // --------------------------------------------------------

        if (room.getStatus() != Room.RoomStatus.AVAILABLE) {

            throw new IllegalStateException(
                    "Room " + room.getRoomNumber()
                            + " is currently not available"
            );
        }


        // --------------------------------------------------------
        // 7. GENERATE BOOKING CODE
        // --------------------------------------------------------

        String code =
                "RS"
                        + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 8)
                        .toUpperCase();


        // --------------------------------------------------------
        // 8. CREATE BOOKING
        // --------------------------------------------------------

        Booking booking = Booking.builder()
                .bookingCode(code)
                .user(user)
                .resort(resort)
                .room(room)
                .checkInDate(checkIn)
                .checkOutDate(checkOut)
                .totalAmount(amount)
                .guestName(guestName)
                .guestPhone(guestPhone)
                .appliedCouponCode(couponCode)
                .discountAmount(discountAmount != null ? discountAmount : BigDecimal.ZERO)
                .rewardPointsUsed(pointsUsed != null ? pointsUsed : 0)
                .rewardPointsValue(pointsValue != null ? pointsValue : BigDecimal.ZERO)
                .status(Booking.BookingStatus.PENDING)
                .bookingSource(Booking.BookingSource.DIRECT)
                .build();


        booking = bookingRepository.save(booking);


        log.info(
                "Booking {} created successfully for user {}",
                booking.getBookingCode(),
                user.getId()
        );


        // --------------------------------------------------------
        // 9. CREATE BOOKING NOTIFICATION
        // --------------------------------------------------------

        String notificationMessage =
                "Your booking "
                        + booking.getBookingCode()
                        + " at "
                        + resort.getName()
                        + " has been confirmed successfully.";


        try {

            notificationService.createNotification(
                    user,
                    booking,
                    Notification.NotificationType.BOOKING_CONFIRMED,
                    Notification.NotificationChannel.EMAIL,
                    user.getEmail(),
                    notificationMessage
            );

            log.info(
                    "Booking confirmation notification created for booking {}",
                    booking.getBookingCode()
            );

        } catch (Exception e) {

            /*
             * Notification failure should not cancel the booking.
             */
            log.error(
                    "Failed to create notification for booking {}: {}",
                    booking.getBookingCode(),
                    e.getMessage()
            );
        }


        // --------------------------------------------------------
        // 10. SEND BOOKING EMAIL
        // --------------------------------------------------------

        try {

            emailService.sendBookingConfirmationEmail(
                    user.getEmail(),
                    user.getName(),
                    booking.getBookingCode(),
                    resort.getName(),
                    booking.getTotalAmount().toString()
            );

            log.info(
                    "Booking confirmation email sent to {}",
                    user.getEmail()
            );

        } catch (Exception e) {

            /*
             * Email failure should not cancel the booking.
             */
            log.error(
                    "Failed to send booking confirmation email to {}: {}",
                    user.getEmail(),
                    e.getMessage()
            );
        }


        return booking;
    }


    // ============================================================
    // CONFIRM BOOKING
    // ============================================================

    @Transactional
    public Booking confirmBooking(
            String bookingCode,
            String paymentIntentId,
            String paymentMethod
    ) {

        Booking booking =
                bookingRepository.findByBookingCode(bookingCode)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found with code: "
                                                + bookingCode
                                )
                        );


        // --------------------------------------------------------
        // PREVENT DUPLICATE CONFIRMATION
        // --------------------------------------------------------

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            return booking;
        }


        // --------------------------------------------------------
        // 1. CONFIRM BOOKING
        // --------------------------------------------------------

        booking.setStatus(
                Booking.BookingStatus.CONFIRMED
        );

        booking = bookingRepository.save(booking);


        // --------------------------------------------------------
        // 2. SAVE PAYMENT
        // --------------------------------------------------------

        Payment payment = Payment.builder()
                .transactionId(paymentIntentId)
                .booking(booking)
                .amount(booking.getTotalAmount())
                .paymentMethod(
                        paymentMethod != null
                                ? paymentMethod
                                : "STRIPE"
                )
                .status(Payment.PaymentStatus.SUCCESS)
                .createdAt(Instant.now())
                .build();

        paymentRepository.save(payment);


        // --------------------------------------------------------
        // 3. AWARD LOYALTY POINTS & DEDUCT REDEEMED POINTS
        // --------------------------------------------------------

        loyaltyService.awardPoints(
                booking.getUser(),
                booking.getTotalAmount()
        );

        if (booking.getRewardPointsUsed() != null && booking.getRewardPointsUsed() > 0) {
            User u = booking.getUser();
            u.setRewardPoints(Math.max(0, u.getRewardPoints() - booking.getRewardPointsUsed()));
            userRepository.save(u);

            LoyaltyTransaction tx = LoyaltyTransaction.builder()
                    .user(u)
                    .description("Points Redeemed for Booking " + booking.getBookingCode())
                    .pointsChange(-booking.getRewardPointsUsed())
                    .createdAt(Instant.now())
                    .build();
            loyaltyTransactionRepository.save(tx);
            log.info("Deducted {} points from user {} for booking {}", booking.getRewardPointsUsed(), u.getEmail(), booking.getBookingCode());
        }


        log.info(
                "Booking {} successfully paid and confirmed with transaction ID: {}",
                bookingCode,
                paymentIntentId
        );


        // --------------------------------------------------------
        // 4. SEND EMAIL
        // --------------------------------------------------------

        User user = booking.getUser();

        try {

            emailService.sendBookingConfirmationEmail(
                    user.getEmail(),
                    user.getName(),
                    booking.getBookingCode(),
                    booking.getResort().getName(),
                    booking.getTotalAmount().toString()
            );

            log.info(
                    "Booking confirmation email sent to {}",
                    user.getEmail()
            );

        } catch (Exception e) {

            log.error(
                    "Failed to send booking confirmation email to {}: {}",
                    user.getEmail(),
                    e.getMessage()
            );
        }


        // --------------------------------------------------------
        // 5. SAVE EMAIL NOTIFICATION
        // --------------------------------------------------------

        String notificationMessage =
                "Your booking "
                        + booking.getBookingCode()
                        + " at "
                        + booking.getResort().getName()
                        + " has been confirmed successfully.";


        notificationService.createNotification(
                user,
                booking,
                Notification.NotificationType.BOOKING_CONFIRMED,
                Notification.NotificationChannel.EMAIL,
                user.getEmail(),
                notificationMessage
        );


        return booking;
    }


    // ============================================================
    // CANCEL + REFUND BOOKING
    // ============================================================

    @Transactional
    public Booking cancelAndRefundBooking(
            Long bookingId
    ) {

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found with ID: "
                                                + bookingId
                                )
                        );


        // --------------------------------------------------------
        // CHECK ALREADY CANCELLED
        // --------------------------------------------------------

        if (booking.getStatus()
                == Booking.BookingStatus.CANCELLED) {

            throw new IllegalStateException(
                    "Booking is already cancelled"
            );
        }


        // --------------------------------------------------------
        // FIND PAYMENT
        // --------------------------------------------------------

        Payment payment =
                paymentRepository.findByBookingId(bookingId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No successful payment record found for this booking"
                                )
                        );


        try {

            // ----------------------------------------------------
            // 1. STRIPE REFUND
            // ----------------------------------------------------

            stripeService.refundPayment(
                    payment.getTransactionId(),
                    payment.getAmount()
            );


            // ----------------------------------------------------
            // 2. MARK PAYMENT REFUNDED
            // ----------------------------------------------------

            payment.setStatus(
                    Payment.PaymentStatus.REFUNDED
            );

            paymentRepository.save(payment);


            // ----------------------------------------------------
            // 3. MARK BOOKING CANCELLED
            // ----------------------------------------------------

            booking.setStatus(
                    Booking.BookingStatus.CANCELLED
            );

            booking = bookingRepository.save(booking);


            // ----------------------------------------------------
            // 4. REVOKE LOYALTY POINTS
            // ----------------------------------------------------

            loyaltyService.revokePoints(
                    booking.getUser(),
                    booking.getTotalAmount()
            );


            log.info(
                    "Booking {} cancelled and payment refunded successfully.",
                    booking.getBookingCode()
            );


            // ----------------------------------------------------
            // 5. SEND CANCELLATION EMAIL
            // ----------------------------------------------------

            User user = booking.getUser();

            String cancellationMessage =
                    "Your booking "
                            + booking.getBookingCode()
                            + " at "
                            + booking.getResort().getName()
                            + " has been cancelled successfully. "
                            + "Your refund amount is ₹"
                            + payment.getAmount()
                            + ".";


            try {

                emailService.sendBookingCancellationEmail(
                        user.getEmail(),
                        user.getName(),
                        booking.getBookingCode(),
                        booking.getResort().getName(),
                        payment.getAmount().toString()
                );

            } catch (Exception e) {

                log.error(
                        "Failed to send cancellation email: {}",
                        e.getMessage()
                );
            }


            // ----------------------------------------------------
            // 6. SAVE CANCELLATION NOTIFICATION
            // ----------------------------------------------------

            notificationService.createNotification(
                    user,
                    booking,
                    Notification.NotificationType.BOOKING_CANCELLED,
                    Notification.NotificationChannel.EMAIL,
                    user.getEmail(),
                    cancellationMessage
            );


        } catch (Exception e) {

            log.error(
                    "Stripe refund failed for booking ID: {}, Error: {}",
                    bookingId,
                    e.getMessage()
            );

            throw new RuntimeException(
                    "Refund processing failed. Please try again or contact support: "
                            + e.getMessage()
            );
        }

        return booking;
    }


    // ============================================================
    // EXISTING USER BOOKINGS
    // ============================================================

    public List<Booking> getUserBookings(
            Long userId
    ) {

        return bookingRepository.findByUserId(userId);
    }


    // ============================================================
    // NEW BOOKING HISTORY
    // ============================================================

    @Transactional(readOnly = true)
    public List<BookingHistoryResponse> getUserBookingHistory(
            Long userId
    ) {

        List<Booking> bookings =
                bookingRepository
                        .findByUserIdOrderByCreatedAtDesc(userId);

        return bookings.stream()
                .map(booking ->
                        BookingHistoryResponse.builder()

                                .bookingId(
                                        booking.getId()
                                )

                                .bookingCode(
                                        booking.getBookingCode()
                                )

                                .resortName(
                                        booking.getResort().getName()
                                )

                                .resortLocation(
                                        booking.getResort().getLocation()
                                )

                                .roomNumber(
                                        booking.getRoom().getRoomNumber()
                                )

                                .roomType(
                                        booking.getRoom()
                                                .getType()
                                                .name()
                                )

                                .checkInDate(
                                        booking.getCheckInDate()
                                )

                                .checkOutDate(
                                        booking.getCheckOutDate()
                                )

                                .guestsCount(
                                        booking.getGuestsCount()
                                )

                                .roomsCount(
                                        booking.getRoomsCount()
                                )

                                .totalAmount(
                                        booking.getTotalAmount()
                                )

                                .status(
                                        booking.getStatus()
                                )

                                .bookingSource(
                                        booking.getBookingSource()
                                )

                                .createdAt(
                                        booking.getCreatedAt()
                                )

                                .build()
                )
                .toList();
    }


    // ============================================================
    // GET ALL BOOKINGS
    // ============================================================

    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }


    // ============================================================
    // GET BOOKING BY ID
    // ============================================================

    public Booking getBookingById(
            Long bookingId
    ) {

        return bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with ID: "
                                        + bookingId
                        )
                );
    }


    // ============================================================
    // UPDATE BOOKING STATUS
    // ============================================================

    public Booking updateBookingStatus(
            Long bookingId,
            Booking.BookingStatus status
    ) {

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Booking not found with ID: "
                                                + bookingId
                                )
                        );

        booking.setStatus(status);

        return bookingRepository.save(booking);
    }
}

