import api from "./api";

// Get all purchases
export const getPurchases = async () => {
  const response = await api.get("/purchases");
  return response.data;
};

// Get purchase by ID
export const getPurchaseById = async (id) => {
  const response = await api.get(`/purchases/${id}`);
  return response.data;
};

// Add purchase
export const addPurchase = async (purchase) => {
  const response = await api.post("/purchases", purchase);
  return response.data;
};

// Update purchase
export const updatePurchase = async (id, purchase) => {
  const response = await api.put(`/purchases/${id}`, purchase);
  return response.data;
};

// Delete purchase
export const deletePurchase = async (id) => {
  const response = await api.delete(`/purchases/${id}`);
  return response.data;
};