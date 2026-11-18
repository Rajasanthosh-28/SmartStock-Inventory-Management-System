package com.inventory.service;

import com.inventory.dto.NotificationDTO;
import com.inventory.model.Notification;
import com.inventory.repository.NotificationRepository;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(
            NotificationRepository notificationRepository,
            SimpMessagingTemplate messagingTemplate) {

        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // Convert database entity into DTO
    private NotificationDTO convertToDTO(Notification notification) {

        return new NotificationDTO(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.getReferenceId(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }

    // Get all notifications
    public List<NotificationDTO> getAllNotifications() {

        return notificationRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Get unread notifications
    public List<NotificationDTO> getUnreadNotifications() {

        return notificationRepository
                .findByIsReadFalseOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Get unread notification count
    public long getUnreadCount() {

        return notificationRepository.countByIsReadFalse();
    }

    // Create and broadcast a notification
    @Transactional
    public NotificationDTO createNotification(
            String title,
            String message,
            String type,
            Long referenceId) {

        Notification notification = new Notification();

        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        notification.setRead(false);

        Notification savedNotification =
                notificationRepository.save(notification);

        NotificationDTO dto = convertToDTO(savedNotification);

        // Send notification to connected frontend clients
        messagingTemplate.convertAndSend(
                "/topic/notifications",
                dto
        );

        // Update unread count instantly
        broadcastUnreadCount();

        return dto;
    }

    // Mark one notification as read
    @Transactional
    public void markAsRead(Long id) {

        Notification notification = notificationRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));

        if (!notification.isRead()) {

            notification.setRead(true);

            notificationRepository.save(notification);

            broadcastUnreadCount();
        }
    }

    // Mark all notifications as read
    @Transactional
    public void markAllAsRead() {

        List<Notification> notifications =
                notificationRepository.findAll();

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);

        broadcastUnreadCount();
    }

    // Broadcast updated unread count
    private void broadcastUnreadCount() {

        long unreadCount = getUnreadCount();

        messagingTemplate.convertAndSend(
                "/topic/notifications/unread-count",
                unreadCount
        );
    }
}