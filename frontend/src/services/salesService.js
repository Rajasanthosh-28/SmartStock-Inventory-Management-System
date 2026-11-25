import api from "./api";

export const getSales = async () => {
  const response = await api.get("/sales");
  return response.data;
};

export const getSaleById = async (id) => {
  const response = await api.get(`/sales/${id}`);
  return response.data;
};

export const addSale = async (sale) => {
  const response = await api.post("/sales", sale);
  return response.data;
};

export const updateSale = async (id, sale) => {
  const response = await api.put(`/sales/${id}`, sale);
  return response.data;
};

export const deleteSale = async (id) => {
  const response = await api.delete(`/sales/${id}`);
  return response.data;
};