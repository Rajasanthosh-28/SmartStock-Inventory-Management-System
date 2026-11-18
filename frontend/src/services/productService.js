import api from "./api";

// Get all products
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

// Get product by ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Add product
export const addProduct = async (product) => {
  const response = await api.post("/products", product);
  return response.data;
};

// Update product
export const updateProduct = async (id, product) => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};