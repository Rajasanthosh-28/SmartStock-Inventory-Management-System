import api from "./api";

// Get all sales
export const getSales = async () => {
  const response = await api.get("/sales");
  return response.data;
};

// Get sale by ID
export const getSaleById = async (id) => {
  const response = await api.get(`/sales/${id}`);
  return response.data;
};

// Add new sale
export const addSale = async (sale) => {
  const response = await api.post("/sales", sale);
  return response.data;
};

// Update sale
export const updateSale = async (id, sale) => {
  const response = await api.put(`/sales/${id}`, sale);
  return response.data;
};

// Delete sale
export const deleteSale = async (id) => {
  const response = await api.delete(`/sales/${id}`);
  return response.data;
};