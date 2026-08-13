package com.reservo.backend.controller;

import com.reservo.backend.dto.ApiResponse;
import com.reservo.backend.dto.NotificationResponse;
import com.reservo.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Get all notifications for a user.
     *
     * GET /api/v1/notifications?userId=1
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @RequestParam Long userId
    ) {

        List<NotificationResponse> notifications =
                notificationService.getUserNotifications(userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        notifications,
                        "Notifications retrieved successfully"
                )
        );
    }

    /**
     * Get unread notifications.
     *
     * GET /api/v1/notifications/unread?userId=1
     */
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUnreadNotifications(
            @RequestParam Long userId
    ) {

        List<NotificationResponse> notifications =
                notificationService.getUnreadNotifications(userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        notifications,
                        "Unread notifications retrieved successfully"
                )
        );
    }
}