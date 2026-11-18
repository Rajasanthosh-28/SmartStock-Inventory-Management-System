package com.inventory.repository;

import com.inventory.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    // Get all notifications, newest first
    List<Notification> findAllByOrderByCreatedAtDesc();

    // Get unread notifications
    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();

    // Count unread notifications
    long countByIsReadFalse();

    // Get notifications by type
    List<Notification> findByTypeOrderByCreatedAtDesc(String type);

    // Check whether a notification already exists
    boolean existsByTypeAndReferenceId(String type, Long referenceId);
}