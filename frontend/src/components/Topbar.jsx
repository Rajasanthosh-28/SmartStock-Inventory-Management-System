import {
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
  Sun,
  Moon
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../context/TranslationContext";
import { useNotifications } from "../context/NotificationContext";

import "./Topbar.css";

function Topbar({ darkMode, toggleTheme }) {

  const { t, language } = useTranslation();
  const { unreadCount } = useNotifications();

  const location = useLocation();
  const navigate = useNavigate();

  const pageKeys = {
    "/": "dashboard",
    "/dashboard": "dashboard",
    "/products": "products",
    "/sales": "sales",
    "/purchases": "purchases",
    "/suppliers": "suppliers",
    "/reports": "reportsAnalytics",
    "/notifications": "notifications",
    "/settings": "settings",
    "/profile": "profile"
  };

  const locale =
    language === "ta"
      ? "ta-IN"
      : language === "hi"
      ? "hi-IN"
      : "en-IN";

  const today = new Date().toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  const pageTitle = t(pageKeys[location.pathname] || "dashboard");

  const openNotifications = () => {
    navigate("/notifications");
  };

  return (
    <header className="topbar">

      <div className="topbar-left">
        <h1>{pageTitle}</h1>
        <p>{t("topbarWelcome")}</p>
      </div>

      <div className="topbar-right">

        <div className="topbar-search">
          <Search size={18} />

          <input
            type="text"
            placeholder={t("searchAnything")}
          />

          <span>Ctrl K</span>
        </div>

        <div className="topbar-date">
          <CalendarDays size={17} />
          <span>{today}</span>
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={darkMode ? t("switchLightMode") : t("switchDarkMode")}
          aria-label={t("toggleTheme")}
          type="button"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          className="notification-button"
          onClick={openNotifications}
          aria-label={`${t("notifications")}, ${unreadCount} unread`}
          title={t("notifications")}
          type="button"
        >
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="notification-count">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}

        </button>

        <button
          className="topbar-profile"
          aria-label={t("adminUser")}
          type="button"
        >
          <div className="topbar-avatar">A</div>

          <div className="topbar-user">
            <strong>{t("adminUser")}</strong>
            <span>{t("administrator")}</span>
          </div>

          <ChevronDown size={16} />
        </button>

      </div>

    </header>
  );
}

export default Topbar;