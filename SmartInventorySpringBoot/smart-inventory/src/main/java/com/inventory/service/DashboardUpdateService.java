package com.inventory.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardUpdateService {

    private static final String DASHBOARD_TOPIC = "/topic/dashboard";

    private final SimpMessagingTemplate messagingTemplate;

    public DashboardUpdateService(
            SimpMessagingTemplate messagingTemplate) {

        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Publish dashboard update only after successful transaction commit.
     */
    public void publishUpdateAfterCommit(String eventType) {

        Runnable publishEvent = () -> {

            Map<String, Object> event = new HashMap<>();

            event.put("eventType", eventType);
            event.put("timestamp", Instant.now().toString());

            messagingTemplate.convertAndSend(DASHBOARD_TOPIC, (Object) event);

            System.out.println(
                    "Dashboard update broadcast successfully: "
                            + eventType
            );
        };

        if (TransactionSynchronizationManager
                .isSynchronizationActive()) {

            TransactionSynchronizationManager
                    .registerSynchronization(
                            new TransactionSynchronization() {

                                @Override
                                public void afterCommit() {
                                    publishEvent.run();
                                }
                            }
                    );

        } else {

            publishEvent.run();
        }
    }
}