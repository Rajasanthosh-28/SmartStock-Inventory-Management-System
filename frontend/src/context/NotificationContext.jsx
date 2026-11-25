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

  const [dashboardUpdateVersion, setDashboardUpdateVersion] = useState(0);

  useEffect(() => {

    let socketClient = null;
    let mounted = true;

    let socketTask = Promise.resolve();

    const loadUnreadCount = async () => {

      if (!navigator.onLine) return;

      try {
        const data = await getUnreadCount();

        if (mounted) {
          setUnreadCount(Number(data.count) || 0);
        }

      } catch (error) {

        if (navigator.onLine) {
          console.error(
            "Failed to load unread notification count:",
            error
          );
        }

      }
    };

    const startSocket = () => {

      if (!mounted || !navigator.onLine || !socketClient) {
        return;
      }

      socketTask = socketTask.then(async () => {

        if (
          mounted &&
          navigator.onLine &&
          socketClient &&
          !socketClient.active
        ) {
          await socketClient.activate();
        }

      }).catch(error => {
        if (navigator.onLine) {
          console.error("Notification connection failed:", error);
        }
      });

    };

    const stopSocket = () => {

      setIsConnected(false);

      if (!socketClient) return;

      socketTask = socketTask.then(async () => {

        if (socketClient?.active) {
          await disconnectNotificationSocket(socketClient);
        }

      }).catch(error => {
        console.error("Notification disconnection failed:", error);
      });

    };

    socketClient = connectNotificationSocket({

      onNotification: (notification) => {
        if (!mounted) return;
        setLatestNotification(notification);
      },

      onUnreadCount: (data) => {
        if (!mounted) return;
        setUnreadCount(Number(data.count) || 0);
      },

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

      onConnected: () => {
        if (mounted) {
          setIsConnected(true);
        }
      },

      onError: (error) => {

        if (!mounted) return;

        console.error(error);
        setIsConnected(false);

      }

    });

    if (navigator.onLine) {
      loadUnreadCount();
      startSocket();
    }

    const handleOnline = () => {

      console.log("Internet restored. Reconnecting notifications.");

      loadUnreadCount();
      startSocket();

    };

    const handleOffline = () => {

      console.log("Internet disconnected. Pausing notifications.");

      stopSocket();

    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {

      mounted = false;

      setIsConnected(false);

      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      socketTask = socketTask.then(async () => {
        if (socketClient?.active) {
          await disconnectNotificationSocket(socketClient);
        }
      });

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

export const useNotifications = () => {

  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
};