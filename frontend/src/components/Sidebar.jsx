import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShoppingBag,
  Truck,
  ChartNoAxesCombined,
  Bell,
  Settings,
  Boxes
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useTranslation } from "../context/TranslationContext";

import "./Sidebar.css";

function Sidebar() {

  const { t } = useTranslation();

  const menuItems = [
    {
      title: t("mainMenu"),
      items: [
        { name: t("dashboard"), path: "/dashboard", icon: LayoutDashboard },
        { name: t("products"), path: "/products", icon: Package },
        { name: t("sales"), path: "/sales", icon: ShoppingCart },
        { name: t("purchases"), path: "/purchases", icon: ShoppingBag },
        { name: t("suppliers"), path: "/suppliers", icon: Truck }
      ]
    },
    {
      title: t("management"),
      items: [
        {
          name: t("reportsAnalytics"),
          path: "/reports",
          icon: ChartNoAxesCombined
        },
        {
          name: t("notifications"),
          path: "/notifications",
          icon: Bell
        }
      ]
    }
  ];

  return (
    <aside className="sidebar">

      {/* LOGO */}

      <div className="sidebar-logo">

        <div className="logo-icon">
          <Boxes size={25} />
        </div>

        <div>
          <h2>{t("smartStock")}</h2>
          <span>{t("inventoryManagement")}</span>
        </div>

      </div>

      {/* NAVIGATION */}

      <div className="sidebar-menu">

        {menuItems.map((group) => (

          <div className="menu-group" key={group.title}>

            <p className="menu-heading">
              {group.title}
            </p>

            {group.items.map((item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `menu-item ${isActive ? "active" : ""}`
                  }
                  key={item.path}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </NavLink>
              );

            })}

          </div>

        ))}

      </div>

      {/* BOTTOM MENU */}

      <div className="sidebar-bottom">

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={19} />
          <span>{t("settings")}</span>
        </NavLink>

        {/* ADMIN PROFILE */}

        <NavLink
          to="/profile"
          className="sidebar-profile"
        >

          <div className="profile-avatar">
            A
          </div>

          <div className="profile-info">

            <strong>{t("adminUser")}</strong>

            <span>{t("administrator")}</span>

          </div>

        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;