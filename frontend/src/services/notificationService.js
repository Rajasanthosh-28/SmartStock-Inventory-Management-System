import { Client } from "@stomp/stompjs";
import api from "./api";


const getCacheKey = (key) => {
    const user = JSON.parse(
        sessionStorage.getItem("adminUser") || "null"
    );

    if (!user?.email) {
        return null;
    }

    return `smartstock-notification-${user.email.toLowerCase()}-${key}`;
};

const getCachedData = (key) => {
    try {
        const cacheKey = getCacheKey(key);

        if (!cacheKey) return null;

        const cached = localStorage.getItem(cacheKey);

        return cached ? JSON.parse(cached) : null;

    } catch (error) {
        console.error("Notification cache loading failed:", error);
        return null;
    }
};

const saveCachedData = (key, data) => {
    try {
        const cacheKey = getCacheKey(key);

        if (!cacheKey) return;

        localStorage.setItem(cacheKey, JSON.stringify(data));

    } catch (error) {
        console.error("Notification cache saving failed:", error);
    }
};

const fetchNotificationData = async (key, endpoint, fallback) => {

    if (!navigator.onLine) {
        const cached = getCachedData(key);

        return cached !== null ? cached : fallback;
    }

    try {
        const response = await api.get(endpoint);

        saveCachedData(key, response.data);

        return response.data;

    } catch (error) {

        console.warn(`Notification request failed: ${key}`);

        const cached = getCachedData(key);

        if (cached !== null) {
            console.warn(`Using cached notification data: ${key}`);
            return cached;
        }

        throw error;
    }
};


export const getNotifications = async () => {
    return fetchNotificationData(
        "all",
        "/notifications",
        []
    );
};

export const getUnreadNotifications = async () => {
    return fetchNotificationData(
        "unread",
        "/notifications/unread",
        []
    );
};

export const getUnreadCount = async () => {
    return fetchNotificationData(
        "unread-count",
        "/notifications/unread-count",
        { count: 0 }
    );
};

// These actions require a server connection.
export const markNotificationRead = async (id) => {

    if (!navigator.onLine) {
        throw new Error("You need an internet connection to mark notifications as read.");
    }

    const response = await api.patch(`/notifications/${id}/read`);

    return response.data;
};

export const markAllNotificationsRead = async () => {

    if (!navigator.onLine) {
        throw new Error("You need an internet connection to mark notifications as read.");
    }

    const response = await api.patch("/notifications/read-all");

    return response.data;
};


export const connectNotificationSocket = ({
    onNotification,
    onUnreadCount,
    onDashboardUpdate,
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

        brokerURL: "wss://smartstock-backend-r5xq.onrender.com/ws-notifications",

        connectHeaders: {
            Authorization: `Bearer ${token}`
        },

        reconnectDelay: 0,

        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,

        onConnect: () => {

            console.log("Notification WebSocket connected.");

            client.subscribe("/topic/notifications", (message) => {
                try {
                    const notification = JSON.parse(message.body);
                    onNotification?.(notification);
                } catch (error) {
                    console.error("Notification parsing error:", error);
                }
            });

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

            client.subscribe("/topic/dashboard", (message) => {
                try {
                    const event = JSON.parse(message.body);
                    console.log("Dashboard WebSocket event:", event);
                    onDashboardUpdate?.(event);
                } catch (error) {
                    console.error("Dashboard event parsing error:", error);
                }
            });

            onConnected?.();
        },

        onStompError: (frame) => {
            if (!navigator.onLine) return;

            console.error("WebSocket STOMP error:", frame.headers);
            onError?.("Notification connection error.");
        },

       onWebSocketError: (error) => {
    console.warn(
        "Notification WebSocket unavailable. It will reconnect when internet is restored."
    );
}
    });

    return client;
};


export const disconnectNotificationSocket = async (client) => {

    if (client && client.active) {
        await client.deactivate();
        console.log("Notification WebSocket disconnected.");
    }

};