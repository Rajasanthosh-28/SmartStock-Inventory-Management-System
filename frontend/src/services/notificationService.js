import { Client } from "@stomp/stompjs";
import api from "./api";

// ========================================
// REST API SERVICES
// ========================================

// Get all notifications
export const getNotifications = async () => {
    const response = await api.get("/notifications");
    return response.data;
};

// Get unread notifications
export const getUnreadNotifications = async () => {
    const response = await api.get("/notifications/unread");
    return response.data;
};

// Get unread notification count
export const getUnreadCount = async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data;
};

// Mark notification as read
export const markNotificationRead = async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
};

// Mark all notifications as read
export const markAllNotificationsRead = async () => {
    const response = await api.patch("/notifications/read-all");
    return response.data;
};

// ========================================
// WEBSOCKET CONNECTION
// ========================================

export const connectNotificationSocket = ({
    onNotification,
    onUnreadCount,
    onConnected,
    onError
}) => {

    const token = sessionStorage.getItem("adminToken");

    if (!token) {
        console.error("Admin JWT token not found.");
        onError?.("Admin authentication token not found.");
        return null;
    }

    const client = new Client({

        brokerURL: "ws://localhost:8080/ws-notifications",

        connectHeaders: {
            Authorization: `Bearer ${token}`
        },

        reconnectDelay: 5000,

        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        onConnect: () => {

            console.log("Notification WebSocket connected.");

            // Subscribe to notifications
            client.subscribe("/topic/notifications", (message) => {

                try {
                    const notification = JSON.parse(message.body);
                    onNotification?.(notification);

                } catch (error) {
                    console.error("Notification parsing error:", error);
                }

            });

            // Subscribe to unread count
            client.subscribe(
                "/topic/notifications/unread-count",
                (message) => {

                    try {
                        const data = JSON.parse(message.body);
                        onUnreadCount?.(data);

                    } catch (error) {
                        console.error("Unread count parsing error:", error);
                    }

                }
            );

            onConnected?.();
        },

        onStompError: (frame) => {
            console.error("WebSocket STOMP error:", frame.headers);
            onError?.("Notification connection error.");
        },

        onWebSocketError: (error) => {
            console.error("WebSocket error:", error);
            onError?.("Unable to connect to notification server.");
        }

    });

    client.activate();

    return client;
};

// ========================================
// DISCONNECT WEBSOCKET
// ========================================

export const disconnectNotificationSocket = async (client) => {

    if (client && client.active) {
        await client.deactivate();
        console.log("Notification WebSocket disconnected.");
    }

};