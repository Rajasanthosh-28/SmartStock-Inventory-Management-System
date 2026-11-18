import api from "./api";

// Get all suppliers
export const getSuppliers = async () => {
  const response = await api.get("/suppliers");
  return response.data;
};

// Get supplier by ID
export const getSupplierById = async (id) => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

// Add supplier
export const addSupplier = async (supplier) => {
  const response = await api.post("/suppliers", supplier);
  return response.data;
};

// Update supplier
export const updateSupplier = async (id, supplier) => {
  const response = await api.put(`/suppliers/${id}`, supplier);
  return response.data;
};

// Delete supplier
export const deleteSupplier = async (id) => {
  const response = await api.delete(`/suppliers/${id}`);
  return response.data;
};