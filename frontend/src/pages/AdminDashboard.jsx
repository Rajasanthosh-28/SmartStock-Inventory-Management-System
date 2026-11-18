import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Truck,
  Users,
  LogOut,
  RefreshCw
} from "lucide-react";

import api from "../services/api";
import adminAuthService from "../services/adminAuthService";

import "./AdminDashboard.css";

function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalSuppliers: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = adminAuthService.getUser();

  const fetchDashboard = async () => {

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/dashboard");

      setStats(response.data);

    } catch (err) {

      if (err.response?.status === 401 ||
          err.response?.status === 403) {

        adminAuthService.logout();
        navigate("/admin/login", { replace: true });
        return;
      }

      setError("Unable to load dashboard statistics.");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    adminAuthService.logout();
    navigate("/admin/login", { replace: true });
  };

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package
    },
    {
      title: "Total Sales",
      value: stats.totalSales,
      icon: ShoppingCart
    },
    {
      title: "Total Purchases",
      value: stats.totalPurchases,
      icon: Truck
    },
    {
      title: "Total Suppliers",
      value: stats.totalSuppliers,
      icon: Users
    }
  ];

  return (

    <div className="admin-dashboard">

      <header className="admin-dashboard-header">

        <div>
          <h1>Admin Dashboard</h1>
          <p>Smart Inventory Management System</p>
        </div>

        <div className="admin-header-actions">

          <span className="admin-welcome">
            Welcome, {user?.fullName || "Administrator"}
          </span>

          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </header>

      <section className="admin-dashboard-content">

        <div className="admin-overview-heading">

          <div>
            <h2>Overview</h2>
            <p>Current inventory system statistics</p>
          </div>

          <button
            className="admin-refresh-button"
            onClick={fetchDashboard}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

        </div>

        {error && (
          <div className="admin-dashboard-error">
            {error}
          </div>
        )}

        {loading ? (

          <div className="admin-dashboard-loading">
            Loading dashboard statistics...
          </div>

        ) : (

          <div className="admin-stat-grid">

            {cards.map((card) => {

              const Icon = card.icon;

              return (

                <div className="admin-stat-card" key={card.title}>

                  <div className="admin-stat-icon">
                    <Icon size={23} />
                  </div>

                  <div>
                    <p>{card.title}</p>
                    <h3>{card.value}</h3>
                  </div>

                </div>

              );

            })}

          </div>

        )}

      </section>

      <footer className="admin-dashboard-footer">
        © 2026 Smart Inventory System
      </footer>

    </div>

  );
}

export default AdminDashboard;