package com.reservo.backend.service;

import com.reservo.backend.dto.NotificationResponse;
import com.reservo.backend.entity.Booking;
import com.reservo.backend.entity.Notification;
import com.reservo.backend.entity.User;
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

    /**
     * Create and save a notification.
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
                .status(Notification.NotificationStatus.SENT)
                .sentAt(Instant.now())
                .createdAt(Instant.now())
                .build();

        return notificationRepository.save(notification);
    }

    /**
     * Get all notifications of a user.
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    /**
     * Get pending/unread notifications.
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(Long userId) {

        return notificationRepository
                .findByUserIdAndStatusOrderByCreatedAtDesc(
                        userId,
                        Notification.NotificationStatus.PENDING
                )
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    /**
     * Convert entity to DTO.
     */
    private NotificationResponse convertToResponse(
            Notification notification
    ) {

        return NotificationResponse.builder()
                .id(notification.getId())

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

                .type(notification.getType())

                .channel(notification.getChannel())

                .recipient(notification.getRecipient())

                .message(notification.getMessage())

                .status(notification.getStatus())

                .sentAt(notification.getSentAt())

                .createdAt(notification.getCreatedAt())

                .build();
    }
}