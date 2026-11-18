import api from "./api";

export const getDashboardReport = async () => {
  const response = await api.get("/reports/dashboard");
  return response.data;
};

export const getTotalProducts = async () => {
  const response = await api.get("/reports/total-products");
  return response.data;
};

export const getTotalStock = async () => {
  const response = await api.get("/reports/total-stock");
  return response.data;
};

export const getTotalSales = async () => {
  const response = await api.get("/reports/total-sales");
  return response.data;
};

export const getTotalPurchases = async () => {
  const response = await api.get("/reports/total-purchases");
  return response.data;
};

export const getLowStockProducts = async () => {
  const response = await api.get("/reports/low-stock");
  return response.data;
};

export const getLowStockCount = async () => {
  const response = await api.get("/reports/low-stock-count");
  return response.data;
};

export const getMonthlySales = async (year, month) => {
  const response = await api.get(
    `/reports/monthly-sales?year=${year}&month=${month}`
  );
  return response.data;
};

export const getMonthlyPurchases = async (year, month) => {
  const response = await api.get(
    `/reports/monthly-purchases?year=${year}&month=${month}`
  );
  return response.data;
};