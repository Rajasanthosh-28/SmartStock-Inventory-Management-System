import { useCallback, useEffect, useState } from "react";

import { useTranslation } from "../context/TranslationContext";
import { useNotifications } from "../context/NotificationContext";

import {
  Bell,
  AlertTriangle,
  Package,
  CheckCircle,
  RefreshCw,
  Search,
  CheckCheck,
  Clock
} from "lucide-react";

import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead
} from "../services/notificationService";

import "./Notifications.css";

function Notifications() {

  const { t } = useTranslation();

  const {
    latestNotification,
    setUnreadCount
  } = useNotifications();

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ======================================
  // LOAD NOTIFICATIONS FROM BACKEND
  // ======================================

  const loadNotifications = useCallback(async () => {

    try {
      setLoading(true);
      setError("");

      const data = await getNotifications();

      setNotifications(Array.isArray(data) ? data : []);

      const countData = await getUnreadCount();

      setUnreadCount(Number(countData.count) || 0);

    } catch (err) {

      console.error("Notification loading error:", err);

      setError(t("notificationsLoadError"));

    } finally {
      setLoading(false);
    }

  }, [setUnreadCount, t]);


  // Initial loading
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);


  // ======================================
  // HANDLE NEW REAL-TIME NOTIFICATIONS
  // ======================================

  useEffect(() => {

    if (!latestNotification) return;

    setNotifications((previous) => {

      const alreadyExists = previous.some(
        (item) => item.id === latestNotification.id
      );

      if (alreadyExists) {
        return previous;
      }

      return [latestNotification, ...previous];

    });

  }, [latestNotification]);


  // ======================================
  // MARK ONE NOTIFICATION AS READ
  // ======================================

  const markAsRead = async (id) => {

    try {

      await markNotificationRead(id);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === id
            ? { ...item, read: true }
            : item
        )
      );

      const countData = await getUnreadCount();

      setUnreadCount(Number(countData.count) || 0);

    } catch (err) {

      console.error("Mark as read error:", err);

      setError("Unable to update notification. Please try again.");

    }

  };


  // ======================================
  // MARK ALL NOTIFICATIONS AS READ
  // ======================================

  const markAllAsRead = async () => {

    try {

      await markAllNotificationsRead();

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          read: true
        }))
      );

      setUnreadCount(0);

    } catch (err) {

      console.error("Mark all as read error:", err);

      setError("Unable to update notifications. Please try again.");

    }

  };


  // ======================================
  // FILTER NOTIFICATIONS
  // ======================================

  const filteredNotifications = notifications.filter((item) => {

    const title = (item.title || "").toLowerCase();
    const message = (item.message || "").toLowerCase();

    const searchValue = search.toLowerCase();

    const matchesSearch =
      title.includes(searchValue) ||
      message.includes(searchValue);

    const matchesFilter =
      filter === "All" ||
      (filter === "Unread" && !item.read) ||
      (filter === "Read" && item.read);

    return matchesSearch && matchesFilter;

  });


  // ======================================
  // COUNTS
  // ======================================

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const readCount = notifications.length - unreadCount;


  // ======================================
  // DATE FORMATTING
  // ======================================

  const formatDate = (date) => {

    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleString();

  };


  // ======================================
  // NOTIFICATION ICON
  // ======================================

  const getNotificationIcon = (type) => {

    const normalizedType = (type || "").toUpperCase();

    if (
      normalizedType.includes("LOW_STOCK") ||
      normalizedType.includes("WARNING")
    ) {
      return <AlertTriangle size={21} />;
    }

    if (
      normalizedType.includes("SALE") ||
      normalizedType.includes("PURCHASE")
    ) {
      return <Package size={21} />;
    }

    return <Bell size={21} />;

  };


  // ======================================
  // PAGE UI
  // ======================================

  return (

    <div className="notifications-page">

      {/* Header */}

      <div className="notifications-header">

        <div>
          <h1>{t("notifications")}</h1>

          <p>{t("notificationsDescription")}</p>
        </div>

        <button
          className="notification-refresh-btn"
          onClick={loadNotifications}
          disabled={loading}
          type="button"
        >
          <RefreshCw size={17} />
          Refresh
        </button>

      </div>


      {/* Summary Cards */}

      <div className="notification-summary-grid">

        <div className="notification-summary-card">

          <div className="notification-summary-icon blue">
            <Bell size={23} />
          </div>

          <div>
            <h2>{notifications.length}</h2>
            <p>{t("totalNotifications")}</p>
          </div>

        </div>


        <div className="notification-summary-card">

          <div className="notification-summary-icon orange">
            <AlertTriangle size={23} />
          </div>

          <div>
            <h2>{unreadCount}</h2>
            <p>{t("unreadNotifications")}</p>
          </div>

        </div>


        <div className="notification-summary-card">

          <div className="notification-summary-icon green">
            <CheckCircle size={23} />
          </div>

          <div>
            <h2>{readCount}</h2>
            <p>{t("readNotifications")}</p>
          </div>

        </div>

      </div>


      {/* Notification Content */}

      <div className="notifications-content-card">

        {/* Toolbar */}

        <div className="notifications-toolbar">

          <div className="notification-search">

            <Search size={18} />

            <input
              type="text"
              placeholder={t("searchNotifications")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>


          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">
              {t("allNotifications")}
            </option>

            <option value="Unread">
              {t("unread")}
            </option>

            <option value="Read">
              {t("read")}
            </option>

          </select>


          <button
            className="mark-all-read-btn"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            type="button"
          >
            <CheckCheck size={17} />
            {t("markAllRead")}
          </button>

        </div>


        {/* Error */}

        {error && (
          <div className="notification-error">
            {error}
          </div>
        )}


        {/* Loading */}

        {loading ? (

          <div className="notification-empty">
            {t("loadingNotifications")}
          </div>

        ) : filteredNotifications.length > 0 ? (

          /* Notification List */

          <div className="notification-list">

            {filteredNotifications.map((item) => (

              <div
                className={`notification-item ${
                  item.read ? "read" : "unread"
                }`}
                key={item.id}
              >

                <div className="notification-item-icon">
                  {getNotificationIcon(item.type)}
                </div>


                <div className="notification-item-content">

                  <div className="notification-item-heading">

                    <h3>{item.title}</h3>

                    {!item.read && (
                      <span className="notification-new-badge">
                        {t("new")}
                      </span>
                    )}

                  </div>


                  <p>{item.message}</p>


                  <span className="notification-time">

                    <Clock size={14} />

                    {formatDate(item.createdAt)}

                    {item.referenceId != null && (
                      <> | ID: #{item.referenceId}</>
                    )}

                  </span>

                </div>


                {!item.read && (

                  <button
                    className="notification-read-btn"
                    onClick={() => markAsRead(item.id)}
                    type="button"
                  >
                    {t("markAsRead")}
                  </button>

                )}

              </div>

            ))}

          </div>

        ) : (

          /* Empty State */

          <div className="notification-empty">

            <Bell size={35} />

            <h3>{t("noNotificationsFound")}</h3>

            <p>{t("notificationsEmptyDescription")}</p>

          </div>

        )}

      </div>

    </div>

  );

}

export default Notifications;