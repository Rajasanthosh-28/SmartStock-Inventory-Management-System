import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  getUnreadCount,
  connectNotificationSocket,
  disconnectNotificationSocket
} from "../services/notificationService";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {

  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Real-time dashboard update version
  const [dashboardUpdateVersion, setDashboardUpdateVersion] = useState(0);

  useEffect(() => {

    let socketClient = null;
    let mounted = true;

    const loadUnreadCount = async () => {
      try {
        const data = await getUnreadCount();

        if (mounted) {
          setUnreadCount(Number(data.count) || 0);
        }
      } catch (error) {
        console.error(
          "Failed to load unread notification count:",
          error
        );
      }
    };

    // Load existing unread count
    loadUnreadCount();

    // Connect to existing notification WebSocket
    socketClient = connectNotificationSocket({

      // Receive new notifications
      onNotification: (notification) => {
        if (!mounted) return;

        setLatestNotification(notification);
      },

      // Receive unread notification count
      onUnreadCount: (data) => {
        if (!mounted) return;

        setUnreadCount(Number(data.count) || 0);
      },

      // Receive dashboard update events
      onDashboardUpdate: (event) => {
        if (!mounted) return;

        console.log(
          "Real-time dashboard update received:",
          event
        );

        setDashboardUpdateVersion(
          previousVersion => previousVersion + 1
        );
      },

      // WebSocket connected
      onConnected: () => {
        if (mounted) {
          setIsConnected(true);
        }
      },

      // WebSocket error
      onError: (error) => {
        console.error(error);

        if (mounted) {
          setIsConnected(false);
        }
      }
    });

    return () => {

      mounted = false;

      setIsConnected(false);

      if (socketClient) {
        disconnectNotificationSocket(socketClient);
      }
    };

  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        latestNotification,
        isConnected,
        dashboardUpdateVersion
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};


// Custom hook
export const useNotifications = () => {

  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
};