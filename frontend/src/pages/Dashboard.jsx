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
  getSuppliers,
  getSalesPurchaseChart
} from "../services/dashboardService";

import "./Dashboard.css";

// Summary Cards
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

// Recent Activities
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

  const today = new Date();
  const currentYear = today.getFullYear();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

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

  // Graph filter states
  const [period, setPeriod] = useState("MONTH");

  const [startDate, setStartDate] = useState(
    formatDate(firstDayOfMonth)
  );

  const [endDate, setEndDate] = useState(
    formatDate(today)
  );

  const [selectedYear, setSelectedYear] = useState(
    currentYear
  );

  const [startYear, setStartYear] = useState(
    currentYear - 4
  );

  const [endYear, setEndYear] = useState(
    currentYear
  );

  // Graph data states
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState("");

  // Fetch dashboard summary
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
            result => result.status === "rejected"
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

  // Fetch actual graph data whenever filters change
  useEffect(() => {

    const fetchChartData = async () => {

      try {

        setChartLoading(true);
        setChartError("");

        let filters = {
          period
        };

        if (period === "DATE") {

          if (!startDate || !endDate) {
            setChartData([]);
            return;
          }

          if (startDate > endDate) {
            setChartData([]);
            setChartError("Start date cannot be after end date.");
            return;
          }

          filters = {
            period: "DATE",
            startDate,
            endDate
          };

        } else if (period === "MONTH") {

          filters = {
            period: "MONTH",
            year: Number(selectedYear)
          };

        } else if (period === "YEAR") {

          if (Number(startYear) > Number(endYear)) {
            setChartData([]);
            setChartError("Start year cannot be greater than end year.");
            return;
          }

          filters = {
            period: "YEAR",
            startYear: Number(startYear),
            endYear: Number(endYear)
          };

        }

        const response = await getSalesPurchaseChart(filters);

        setChartData(
          Array.isArray(response) ? response : []
        );

      } catch (err) {

        console.error("Graph data error:", err);

        setChartData([]);
        setChartError(
          "Unable to load graph data. Please check the backend."
        );

      } finally {

        setChartLoading(false);

      }
    };

    fetchChartData();

  }, [
    period,
    startDate,
    endDate,
    selectedYear,
    startYear,
    endYear
  ]);

  const summaryCards = createSummaryCards(
    dashboardData,
    t
  );

  // Format graph labels
  const formatChartLabel = (label) => {

    if (period === "MONTH") {

      const [year, month] = label.split("-");

      return new Date(
        Number(year),
        Number(month) - 1
      ).toLocaleDateString("en-IN", {
        month: "short"
      });

    }

    if (period === "DATE") {

      return new Date(
        `${label}T00:00:00`
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
      });

    }

    return label;
  };

  return (

    <div className="dashboard">

      {/* Error Message */}
      {errorKey && (
        <div className="dashboard-error">
          {t(errorKey)}
        </div>
      )}

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

            <TrendingUp
              size={20}
              color="#2563eb"
            />

          </div>

          {/* Graph Filters */}
          <div className="chart-filters">

            <div className="chart-filter-group">

              <label htmlFor="chart-period">
                Graph Period
              </label>

              <select
                id="chart-period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="DATE">
                  Date to Date
                </option>

                <option value="MONTH">
                  Month to Month
                </option>

                <option value="YEAR">
                  Year to Year
                </option>

              </select>

            </div>

            {/* Date Filter */}
            {period === "DATE" && (

              <div className="chart-date-filters">

                <div className="chart-filter-group">

                  <label htmlFor="start-date">
                    From Date
                  </label>

                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                  />

                </div>

                <div className="chart-filter-group">

                  <label htmlFor="end-date">
                    To Date
                  </label>

                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                  />

                </div>

              </div>

            )}

            {/* Month Filter */}
            {period === "MONTH" && (

              <div className="chart-filter-group">

                <label htmlFor="chart-year">
                  Select Year
                </label>

                <select
                  id="chart-year"
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(Number(e.target.value))
                  }
                >

                  {Array.from(
                    { length: 11 },
                    (_, index) => currentYear - 5 + index
                  ).map(year => (

                    <option
                      key={year}
                      value={year}
                    >
                      {year}
                    </option>

                  ))}

                </select>

              </div>

            )}

            {/* Year Filter */}
            {period === "YEAR" && (

              <div className="chart-year-filters">

                <div className="chart-filter-group">

                  <label htmlFor="start-year">
                    From Year
                  </label>

                  <input
                    type="number"
                    id="start-year"
                    min="1900"
                    max="9999"
                    value={startYear}
                    onChange={(e) =>
                      setStartYear(e.target.value)
                    }
                  />

                </div>

                <div className="chart-filter-group">

                  <label htmlFor="end-year">
                    To Year
                  </label>

                  <input
                    type="number"
                    id="end-year"
                    min="1900"
                    max="9999"
                    value={endYear}
                    onChange={(e) =>
                      setEndYear(e.target.value)
                    }
                  />

                </div>

              </div>

            )}

          </div>

          {/* Graph */}
          <div className="chart-container">

            {chartLoading ? (

              <div className="chart-message">
                Loading graph data...
              </div>

            ) : chartError ? (

              <div className="chart-message chart-error">
                {chartError}
              </div>

            ) : chartData.length === 0 ? (

              <div className="chart-message">
                No sales or purchase records available for this period.
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart data={chartData}>

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
                    dataKey="label"
                    tickFormatter={formatChartLabel}
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
                    labelFormatter={(label) =>
                      formatChartLabel(label)
                    }
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

            )}

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
        Actual sales and purchase records from the database.
      </p>

    </div>

  );

}

export default Dashboard;