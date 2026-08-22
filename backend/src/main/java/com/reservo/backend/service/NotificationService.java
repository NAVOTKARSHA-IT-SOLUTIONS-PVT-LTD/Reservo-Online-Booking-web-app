package com.reservo.backend.service;

import com.reservo.backend.dto.NotificationResponse;
import com.reservo.backend.entity.Booking;
import com.reservo.backend.entity.Notification;
import com.reservo.backend.entity.User;
import com.reservo.backend.exception.ResourceNotFoundException;
import com.reservo.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;


    // ============================================================
    // CREATE NOTIFICATION
    // ============================================================

    /**
     * Creates and saves a new notification.
     *
     * New notifications are:
     * - SENT
     * - unread
     *
     * This method is called from BookingService and other services
     * whenever an important event occurs.
     */
    @Transactional
    public Notification createNotification(
            User user,
            Booking booking,
            Notification.NotificationType type,
            Notification.NotificationChannel channel,
            String recipient,
            String message
    ) {

        Notification notification = Notification.builder()
                .user(user)
                .booking(booking)
                .type(type)
                .channel(channel)
                .recipient(recipient)
                .message(message)

                // Notification delivery status
                .status(Notification.NotificationStatus.SENT)

                // New notification should be unread
                .read(false)

                .sentAt(Instant.now())
                .createdAt(Instant.now())
                .build();

        return notificationRepository.save(notification);
    }


    // ============================================================
    // GET ALL NOTIFICATIONS
    // ============================================================

    /**
     * Returns all notifications belonging to a user.
     *
     * GET /api/v1/notifications?userId=1
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(
            Long userId
    ) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // ============================================================
    // GET UNREAD NOTIFICATIONS
    // ============================================================

    /**
     * Returns only unread notifications.
     *
     * GET /api/v1/notifications/unread?userId=1
     *
     * IMPORTANT:
     * We use the "read" field here instead of
     * NotificationStatus.PENDING.
     *
     * SENT means the notification was delivered.
     * read=false means the user has not read it.
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(
            Long userId
    ) {

        return notificationRepository
                .findByUserIdAndReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // ============================================================
    // MARK ONE NOTIFICATION AS READ
    // ============================================================

    /**
     * Marks a single notification as read.
     *
     * PATCH /api/v1/notifications/{id}/read
     */
    @Transactional
    public void markAsRead(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found with ID: " + id
                                )
                        );

        notification.setRead(true);

        notificationRepository.save(notification);
    }


    // ============================================================
    // MARK ALL NOTIFICATIONS AS READ
    // ============================================================

    /**
     * Marks all notifications belonging to a user as read.
     *
     * PATCH /api/v1/notifications/read-all?userId=1
     */
    @Transactional
    public void markAllAsRead(Long userId) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdOrderByCreatedAtDesc(userId);

        if (notifications.isEmpty()) {
            return;
        }

        notifications.forEach(notification ->
                notification.setRead(true)
        );

        notificationRepository.saveAll(notifications);
    }


    // ============================================================
    // DELETE NOTIFICATION
    // ============================================================

    /**
     * Deletes a notification by ID.
     *
     * DELETE /api/v1/notifications/{id}
     */
    @Transactional
    public void deleteNotification(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Notification not found with ID: " + id
                                )
                        );

        notificationRepository.delete(notification);
    }


    // ============================================================
    // CONVERT ENTITY TO RESPONSE DTO
    // ============================================================

    /**
     * Converts Notification entity into NotificationResponse.
     *
     * This prevents exposing the complete Notification entity
     * directly to the frontend.
     */
    private NotificationResponse convertToResponse(
            Notification notification
    ) {

        return NotificationResponse.builder()

                // Notification information
                .id(notification.getId())

                // Booking information
                .bookingId(
                        notification.getBooking() != null
                                ? notification.getBooking().getId()
                                : null
                )

                .bookingCode(
                        notification.getBooking() != null
                                ? notification.getBooking().getBookingCode()
                                : null
                )

                // Notification details
                .type(notification.getType())

                .channel(notification.getChannel())

                .recipient(notification.getRecipient())

                .message(notification.getMessage())

                // Delivery status
                .status(notification.getStatus())

                // Read/unread status
                .read(notification.isRead())

                // Timestamps
                .sentAt(notification.getSentAt())

                .createdAt(notification.getCreatedAt())

                .build();
    }
}