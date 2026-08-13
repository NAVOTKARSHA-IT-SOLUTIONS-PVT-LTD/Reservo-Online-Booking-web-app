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
            BigDecimal amount
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with ID: " + userId
                        )
                );

        Resort resort = resortRepository.findById(resortId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Resort not found with ID: " + resortId
                        )
                );

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with ID: " + roomId
                        )
                );

        String code =
                "RS"
                        + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();

        Booking booking = Booking.builder()
                .bookingCode(code)
                .user(user)
                .resort(resort)
                .room(room)
                .checkInDate(checkIn)
                .checkOutDate(checkOut)
                .totalAmount(amount)
                .status(Booking.BookingStatus.PENDING)
                .bookingSource(Booking.BookingSource.DIRECT)
                .build();

        return bookingRepository.save(booking);
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

        // Prevent duplicate confirmation
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
        // 3. AWARD LOYALTY POINTS
        // --------------------------------------------------------

        loyaltyService.awardPoints(
                booking.getUser(),
                booking.getTotalAmount()
        );


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