import { useEffect, useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Boxes,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Truck,
  ArrowUpRight,
  Activity,
  Clock
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import {
  getDashboardSummary,
  getLowStockCount,
  getSuppliers
} from "../services/dashboardService";

import "./Dashboard.css";

// Dashboard summary cards
const createSummaryCards = (data, t) => [
  {
    title: t("totalProducts"),
    value: data.totalProducts,
    description: t("productsInInventory"),
    icon: Package,
    color: "blue"
  },
  {
    title: t("totalStock"),
    value: data.totalStock,
    description: t("unitsAvailable"),
    icon: Boxes,
    color: "purple"
  },
  {
    title: t("totalSales"),
    value: `₹${Number(data.totalSales).toLocaleString("en-IN")}`,
    description: t("totalSalesAmount"),
    icon: TrendingUp,
    color: "green"
  },
  {
    title: t("totalPurchases"),
    value: `₹${Number(data.totalPurchases).toLocaleString("en-IN")}`,
    description: t("totalPurchaseAmount"),
    icon: ShoppingCart,
    color: "orange"
  },
  {
    title: t("lowStockItems"),
    value: data.lowStockCount,
    description: t("productsNeedAttention"),
    icon: AlertTriangle,
    color: "red"
  },
  {
    title: t("totalSuppliers"),
    value: data.totalSuppliers,
    description: t("registeredSuppliers"),
    icon: Truck,
    color: "cyan"
  }
];

// Temporary sample chart data
const monthlyData = [
  { month: "jan", sales: 12000, purchases: 18000 },
  { month: "feb", sales: 18000, purchases: 15000 },
  { month: "mar", sales: 15000, purchases: 22000 },
  { month: "apr", sales: 25000, purchases: 19000 },
  { month: "may", sales: 22000, purchases: 28000 },
  { month: "jun", sales: 32000, purchases: 24000 },
  { month: "jul", sales: 28000, purchases: 30000 },
  { month: "aug", sales: 38000, purchases: 26000 },
  { month: "sep", sales: 34000, purchases: 32000 },
  { month: "oct", sales: 42000, purchases: 35000 },
  { month: "nov", sales: 48000, purchases: 39000 },
  { month: "dec", sales: 52000, purchases: 43000 }
];
// Temporary activity data
const recentActivities = [
  {
    title: "inventoryDashboardCreated",
    description: "workspaceReady",
    time: "justNow",
    type: "success"
  },
  {
    title: "salesManagement",
    description: "manageSalesRecords",
    time: "recently",
    type: "sales"
  },
  {
    title: "purchaseManagement",
    description: "monitorPurchaseRecords",
    time: "recently",
    type: "purchase"
  }
];

function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalSales: 0,
    totalPurchases: 0,
    lowStockCount: 0,
    totalSuppliers: 0
  });

  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState("");

  // Fetch dashboard information
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setErrorKey("");

        const results = await Promise.allSettled([
          getDashboardSummary(),
          getLowStockCount(),
          getSuppliers()
        ]);

        const summary =
          results[0].status === "fulfilled"
            ? results[0].value
            : {};

        const lowStock =
          results[1].status === "fulfilled"
            ? results[1].value
            : 0;

        const suppliers =
          results[2].status === "fulfilled"
            ? results[2].value
            : [];

        const lowStockCount =
          typeof lowStock === "number"
            ? lowStock
            : Number(
                lowStock?.count ??
                lowStock?.lowStockCount ??
                0
              );

        const totalSuppliers = Array.isArray(suppliers)
          ? suppliers.length
          : 0;

        setDashboardData({
          totalProducts: Number(summary.totalProducts ?? 0),
          totalStock: Number(summary.totalStock ?? 0),
          totalSales: Number(summary.totalSales ?? 0),
          totalPurchases: Number(summary.totalPurchases ?? 0),
          lowStockCount,
          totalSuppliers
        });

        if (
          results.every(
            (result) => result.status === "rejected"
          )
        ) {
          setErrorKey("backendConnectionError");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setErrorKey("dashboardLoadError");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const summaryCards = createSummaryCards(dashboardData, t);

  return (
    <div className="dashboard">
        
      {/* Error Message */}
      {errorKey && (
        <div className="dashboard-error">
          {t(errorKey)}
        </div>
      )}

      {/* Dashboard Heading */}
            {/* Dashboard Heading */}
      <div className="dashboard-heading">
        <div>
          <h2>{t("inventoryOverview")}</h2>
          <p>{t("monitorInventory")}</p>
        </div>

        <button
          className="overview-button"
          onClick={() => navigate("/reports")}
          type="button"
        >
          {t("viewReports")}
          <ArrowUpRight size={16} />
        </button>
      </div>
      {/* Summary Cards */}
      <div className="summary-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              className="summary-card"
              key={card.title}
            >
              <div className="card-top">
                <div className={`card-icon ${card.color}`}>
                  <Icon size={22} />
                </div>

                <span className="card-menu">
                  •••
                </span>
              </div>

              <h3>{card.title}</h3>

              <div className="card-value">
                {loading
                  ? t("loading")
                  : card.value}
              </div>

              <p className="card-description">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">

        {/* Sales and Purchases Chart */}
        <div className="chart-card">
          <div className="section-header">
            <div>
              <h3>{t("salesPurchases")}</h3>

              <p>
                {t("monthlyFinancialPerformance")}
              </p>
            </div>

            <span className="chart-period">
              {t("yearly")}
            </span>
          </div>

          <div className="chart-container">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#2563eb"
                      stopOpacity={0.25}
                    />

                    <stop
                      offset="95%"
                      stopColor="#2563eb"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="purchaseGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#16a34a"
                      stopOpacity={0.2}
                    />

                    <stop
                      offset="95%"
                      stopColor="#16a34a"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tickFormatter={(month) => t(month)}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#94a3b8"
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "#94a3b8"
                  }}
                  tickFormatter={(value) =>
                    `₹${value / 1000}k`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                  labelFormatter={(month) => t(month)}
                />

                <Legend
                  formatter={(value) => t(value)}
                />

                <Area
                  type="monotone"
                  dataKey="sales"
                  name="sales"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="purchases"
                  name="purchases"
                  stroke="#16a34a"
                  strokeWidth={3}
                  fill="url(#purchaseGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-card">
          <div className="section-header">
            <div>
              <h3>{t("recentActivity")}</h3>

              <p>
                {t("latestInventoryActivities")}
              </p>
            </div>

            <Activity
              size={20}
              color="#2563eb"
            />
          </div>

          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div
                className="activity-item"
                key={index}
              >
                <div
                  className={`activity-icon ${activity.type}`}
                >
                  <Clock size={17} />
                </div>

                <div className="activity-details">
                  <strong>
                    {t(activity.title)}
                  </strong>

                  <p>
                    {t(activity.description)}
                  </p>

                  <span>
                    {t(activity.time)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div>
          <h2>
            {t("welcomeSmartStock")}
          </h2>

          <p>
            {t("inventoryWorkspaceReady")}
            {" "}
            {t("startManagingInventory")}
          </p>
        </div>

        <Package size={55} />
      </div>

      {/* Data Information */}
      <p className="demo-notice">
        {t("summaryBackendData")}
        {" "}
        {t("chartSampleData")}
      </p>

    </div>
  );
}

export default Dashboard;