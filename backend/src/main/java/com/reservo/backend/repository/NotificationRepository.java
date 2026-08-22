package com.reservo.backend.repository;

import com.reservo.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    /**
     * Get all notifications for a user.
     * Newest notifications appear first.
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Get unread notifications for a user.
     */
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(
            Long userId
    );
}