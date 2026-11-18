import api from "./api";

export const getDashboardSummary = async () => {
  const response = await api.get("/reports/dashboard");
  return response.data;
};

export const getLowStockCount = async () => {
  const response = await api.get("/reports/low-stock-count");
  return response.data;
};

export const getSuppliers = async () => {
  const response = await api.get("/suppliers");
  return response.data;
};