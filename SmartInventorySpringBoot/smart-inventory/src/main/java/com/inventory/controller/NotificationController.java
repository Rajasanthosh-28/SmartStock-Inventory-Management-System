package com.inventory.controller;

import com.inventory.dto.NotificationDTO;
import com.inventory.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Get all notifications
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getAllNotifications() {

        return ResponseEntity.ok(
                notificationService.getAllNotifications()
        );
    }

    // Get unread notifications
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications()
        );
    }

    // Get unread notification count
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {

        return ResponseEntity.ok(
                Map.of(
                        "count",
                        notificationService.getUnreadCount()
                )
        );
    }

    // Mark one notification as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long id) {

        notificationService.markAsRead(id);

        return ResponseEntity.ok(
                Map.of("message", "Notification marked as read")
        );
    }

    // Mark all notifications as read
    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead() {

        notificationService.markAllAsRead();

        return ResponseEntity.ok(
                Map.of("message", "All notifications marked as read")
        );
    }
}