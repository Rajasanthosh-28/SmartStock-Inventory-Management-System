import { useEffect, useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import {
  BarChart3,
  TrendingUp,
  Package,
  ShoppingCart,
  IndianRupee,
  AlertTriangle,
  RefreshCw,
  CalendarDays
} from "lucide-react";

import {
  getDashboardReport,
  getLowStockProducts,
  getMonthlySales,
  getMonthlyPurchases
} from "../services/reportService";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import "./Reports.css";
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="report-chart-tooltip">
      <p className="tooltip-title">{label}</p>

      {payload.map((item, index) => (
        <p key={index} className="tooltip-value">
          <span>{item.name}</span>
          <strong>{Number(item.value).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
          })}</strong>
        </p>
      ))}
    </div>
  );
};
function Reports() {
  const { t, language } = useTranslation();
  const today = new Date();

  const [summary, setSummary] = useState({});
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(Number(value) || 0);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboard, lowStock, sales, purchases] =
        await Promise.all([
          getDashboardReport(),
          getLowStockProducts(),
          getMonthlySales(year, month),
          getMonthlyPurchases(year, month)
        ]);

      setSummary(dashboard || {});
      setLowStockProducts(Array.isArray(lowStock) ? lowStock : []);

      setMonthlyData([
        {
          name: t("sales"),
          amount: Number(sales) || 0
        },
        {
          name: t("purchases"),
          amount: Number(purchases) || 0
        }
      ]);

    } catch (err) {
      console.error("Report loading error:", err);
      setError(
        t("reportsLoadError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [year, month, language]);

  const monthNames = [
    t("jan"), t("feb"), t("mar"), t("apr"),
    t("may"), t("jun"), t("jul"), t("aug"),
    t("sep"), t("oct"), t("nov"), t("dec")
  ];

  return (
    <div className="reports-page">

      {/* Header */}
      <div className="reports-header">
        <div>
          <h1> {t("reportsAnalytics")} </h1>
          <p> {t("reportsDescription")} </p>
        </div>

        <button
          className="reports-refresh-btn"
          onClick={loadReports}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="reports-filter-card">
        <div className="reports-filter-title">
          <CalendarDays size={19} />
          <span> {t("reportPeriod")} </span>
        </div>

        <div className="reports-filter-controls">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {monthNames.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[2025, 2026, 2027, 2028].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="reports-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="reports-loading">
          Loading reports...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="reports-summary-grid">

            <div className="report-card">
              <div className="report-card-icon blue">
                <Package size={23} />
              </div>
              <div>
                <p> {t("totalProducts")} </p>
                <h2>{summary.totalProducts ?? 0}</h2>
                <span> {t("registeredProducts")} </span>
              </div>
            </div>

            <div className="report-card">
              <div className="report-card-icon purple">
                <ShoppingCart size={23} />
              </div>
              <div>
                <p> {t("totalStock")} </p>
                <h2>{summary.totalStock ?? 0}</h2>
                <span> {t("availableUnits")} </span>
              </div>
            </div>

            <div className="report-card">
              <div className="report-card-icon green">
                <TrendingUp size={23} />
              </div>
              <div>
                <p> {t("totalSales")} </p>
                <h2>{formatCurrency(summary.totalSales)}</h2>
                <span> {t("overallSalesValue")} </span>
              </div>
            </div>

            <div className="report-card">
              <div className="report-card-icon orange">
                <IndianRupee size={23} />
              </div>
              <div>
                <p> {t("totalPurchases")} </p>
                <h2>{formatCurrency(summary.totalPurchases)}</h2>
                <span> {t("overallPurchaseValue")} </span>
              </div>
            </div>

          </div>

          {/* Monthly Chart */}
          <div className="reports-chart-card">
            <div className="reports-section-heading">
              <div>
                <h2> {t("monthlyFinancialOverview")} </h2>
                <p>
                  {t("salesPurchaseComparison")} {monthNames[month - 1]} {year}
                </p>
              </div>

              <div className="reports-chart-icon">
                <BarChart3 size={22} />
              </div>
            </div>

            <div className="reports-chart">
              <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={monthlyData}
    margin={{
      top: 20,
      right: 20,
      left: 15,
      bottom: 5
    }}
  >
    <CartesianGrid
      strokeDasharray="3 3"
      vertical={false}
      stroke="rgba(148, 163, 184, 0.22)"
    />

    <XAxis
      dataKey="name"
      tick={{ fill: "#94a3b8", fontSize: 14 }}
      axisLine={{ stroke: "rgba(148, 163, 184, 0.3)" }}
      tickLine={false}
    />

    <YAxis
      tickFormatter={(value) =>
        `₹${Number(value).toLocaleString("en-IN")}`
      }
      tick={{ fill: "#94a3b8", fontSize: 13 }}
      axisLine={false}
      tickLine={false}
    />

    <Tooltip
      content={<CustomTooltip />}
      cursor={{
        fill: "rgba(59, 130, 246, 0.10)",
        radius: 10
      }}
      isAnimationActive={true}
    />

    <Legend
      wrapperStyle={{
        color: "#60a5fa",
        paddingTop: "12px"
      }}
    />

    <Bar
      dataKey="amount"
      name={t("amount")}
      fill="#3b82f6"
      radius={[9, 9, 0, 0]}
      barSize={75}
      activeBar={{
        fill: "#60a5fa",
        stroke: "#bfdbfe",
        strokeWidth: 2
      }}
      animationDuration={1200}
      animationEasing="ease-out"
    />
  </BarChart>
</ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock */}
          <div className="reports-low-stock-card">
            <div className="reports-section-heading">
              <div>
                <h2> {t("lowStockAnalysis")} </h2>
                <p> {t("stockReplenishmentDescription")} </p>
              </div>

              <div className="reports-low-stock-icon">
                <AlertTriangle size={22} />
              </div>
            </div>

            <div className="reports-low-stock-table-wrapper">
              <table className="reports-low-stock-table">
                <thead>
                  <tr>
                    <th> {t("productId")} </th>
                    <th> {t("productName")} </th>
                    <th> {t("availableStock")} </th>
                    <th> {t("minimumStock")} </th>
                    <th> {t("status")} </th>
                  </tr>
                </thead>

                <tbody>
                  {lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product) => (
                      <tr key={product.productId}>
                        <td>#{product.productId}</td>
                        <td>{product.productName}</td>
                        <td>{product.quantity}</td>
                        <td>{product.minimumStock}</td>
                        <td>
                          <span className="low-stock-badge">
                            Low Stock
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="reports-empty">
                        No low-stock products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="reports-stock-footer">
              <span>
                Total low-stock products:{" "}
                <strong>{lowStockProducts.length}</strong>
              </span>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default Reports;