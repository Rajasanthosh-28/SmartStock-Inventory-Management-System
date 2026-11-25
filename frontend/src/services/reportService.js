import api from "./api";
import adminAuthService from "./adminAuthService";


const getCacheKey = (key) => {
  const user = adminAuthService.getUser();

  if (!user?.email) {
    return null;
  }

  return `smartstock-report-${user.email.toLowerCase()}-${key}`;
};

const getCachedReport = (key) => {
  try {
    const cacheKey = getCacheKey(key);

    if (!cacheKey) return null;

    const cached = localStorage.getItem(cacheKey);

    return cached ? JSON.parse(cached) : null;

  } catch (error) {
    console.error("Report cache loading failed:", error);
    return null;
  }
};

const saveCachedReport = (key, data) => {
  try {
    const cacheKey = getCacheKey(key);

    if (!cacheKey) return;

    localStorage.setItem(cacheKey, JSON.stringify(data));

  } catch (error) {
    console.error("Report cache saving failed:", error);
  }
};

const fetchReport = async (key, request, fallback) => {

  if (!navigator.onLine) {
    const cached = getCachedReport(key);

    if (cached !== null) {
      return cached;
    }

    return fallback;
  }

  try {
    const response = await request();

    saveCachedReport(key, response.data);

    return response.data;

  } catch (error) {

    console.warn(`Report request failed: ${key}`);

    const cached = getCachedReport(key);

    if (cached !== null) {
      console.warn(`Using cached report: ${key}`);
      return cached;
    }

    return fallback;
  }
};


export const getDashboardReport = async () => {
  return fetchReport(
    "dashboard",
    () => api.get("/reports/dashboard"),
    {}
  );
};

export const getTotalProducts = async () => {
  return fetchReport(
    "total-products",
    () => api.get("/reports/total-products"),
    0
  );
};

export const getTotalStock = async () => {
  return fetchReport(
    "total-stock",
    () => api.get("/reports/total-stock"),
    0
  );
};

export const getTotalSales = async () => {
  return fetchReport(
    "total-sales",
    () => api.get("/reports/total-sales"),
    0
  );
};

export const getTotalPurchases = async () => {
  return fetchReport(
    "total-purchases",
    () => api.get("/reports/total-purchases"),
    0
  );
};

export const getLowStockProducts = async () => {
  return fetchReport(
    "low-stock",
    () => api.get("/reports/low-stock"),
    []
  );
};

export const getLowStockCount = async () => {
  return fetchReport(
    "low-stock-count",
    () => api.get("/reports/low-stock-count"),
    0
  );
};

export const getMonthlySales = async (year, month) => {
  return fetchReport(
    `monthly-sales-${year}-${month}`,
    () => api.get(
      `/reports/monthly-sales?year=${year}&month=${month}`
    ),
    0
  );
};

export const getMonthlyPurchases = async (year, month) => {
  return fetchReport(
    `monthly-purchases-${year}-${month}`,
    () => api.get(
      `/reports/monthly-purchases?year=${year}&month=${month}`
    ),
    0
  );
};