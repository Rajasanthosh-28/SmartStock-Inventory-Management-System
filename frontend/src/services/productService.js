import api from "./api";
import adminAuthService from "./adminAuthService";

import {
  saveProductsOffline,
  getOfflineProducts,
  queueOfflineProductOperation
} from "./offlineDb";

const getAdminEmail = () => {
  const user = adminAuthService.getUser();

  if (!user?.email) {
    throw new Error("Admin account information is unavailable.");
  }

  return user.email;
};

// Identify temporary network or server availability failures.
const isNetworkFailure = (error) => {
  if (!error.response) {
    return true;
  }

  return [502, 503, 504].includes(error.response.status);
};

export const getProducts = async () => {
  const user = adminAuthService.getUser();
  const email = user?.email;

  if (!navigator.onLine) {
    if (!email) {
      throw new Error("Admin account information is unavailable.");
    }

    const cachedProducts = await getOfflineProducts(email);

    if (cachedProducts.length > 0) {
      return cachedProducts;
    }

    throw new Error("No offline products are available.");
  }

  try {
    const response = await api.get("/products");
    const products = response.data;

    if (email && Array.isArray(products)) {
      try {
        await saveProductsOffline(email, products);
      } catch (storageError) {
        console.error("Offline product caching failed:", storageError);
      }
    }

    return products;

  } catch (error) {
    if (email) {
      try {
        const cachedProducts = await getOfflineProducts(email);

        if (cachedProducts.length > 0) {
          console.warn("Using cached offline products.");
          return cachedProducts;
        }
      } catch (offlineError) {
        console.error("Offline product loading failed:", offlineError);
      }
    }

    throw error;
  }
};

export const getProductById = async (id) => {
  if (!navigator.onLine) {
    const products = await getOfflineProducts(getAdminEmail());

    const product = products.find(
      (item) => Number(item.productId) === Number(id)
    );

    if (!product) {
      throw new Error("Product is not available offline.");
    }

    return product;
  }

  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const addProduct = async (product) => {
  if (!navigator.onLine) {
    await queueOfflineProductOperation(
      getAdminEmail(),
      "CREATE",
      product,
      product.productId
    );

    return product;
  }

  try {
    const response = await api.post("/products", product);
    return response.data;

  } catch (error) {
    if (!isNetworkFailure(error)) {
      throw error;
    }

    console.warn("Backend unavailable. Queueing product creation.");

    await queueOfflineProductOperation(
      getAdminEmail(),
      "CREATE",
      product,
      product.productId
    );

    return product;
  }
};

export const updateProduct = async (id, product) => {
  if (!navigator.onLine) {
    await queueOfflineProductOperation(
      getAdminEmail(),
      "UPDATE",
      product,
      Number(id)
    );

    return product;
  }

  try {
    const response = await api.put(`/products/${id}`, product);
    return response.data;

  } catch (error) {
    if (!isNetworkFailure(error)) {
      throw error;
    }

    console.warn("Backend unavailable. Queueing product update.");

    await queueOfflineProductOperation(
      getAdminEmail(),
      "UPDATE",
      product,
      Number(id)
    );

    return product;
  }
};

export const deleteProduct = async (id) => {
  if (!navigator.onLine) {
    await queueOfflineProductOperation(
      getAdminEmail(),
      "DELETE",
      null,
      Number(id)
    );

    return {
      success: true,
      offline: true
    };
  }

  try {
    const response = await api.delete(`/products/${id}`);
    return response.data;

  } catch (error) {
    if (!isNetworkFailure(error)) {
      throw error;
    }

    console.warn("Backend unavailable. Queueing product deletion.");

    await queueOfflineProductOperation(
      getAdminEmail(),
      "DELETE",
      null,
      Number(id)
    );

    return {
      success: true,
      offline: true
    };
  }
};