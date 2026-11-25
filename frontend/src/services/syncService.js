import api from "./api";
import adminAuthService from "./adminAuthService";

import {
  getPendingOperations,
  removePendingOperation,
  updatePendingOperation,
  saveProductsOffline
} from "./offlineDb";

let syncInProgress = false;

const getAdminEmail = () => {
  const user = adminAuthService.getUser();

  if (!user?.email) {
    throw new Error("Admin account information is unavailable.");
  }

  return user.email;
};

const normalizeProduct = (product) => ({
  productId: Number(product.productId),
  productName: product.productName,
  category: product.category ?? null,
  price: Number(product.price),
  quantity: Number(product.quantity),
  minimumStock: Number(product.minimumStock ?? 5),
  expiryDate: product.expiryDate || null
});

const productsMatch = (first, second) => {
  if (!first || !second) {
    return false;
  }

  return JSON.stringify(normalizeProduct(first)) ===
    JSON.stringify(normalizeProduct(second));
};

export const syncPendingChanges = async () => {
  if (syncInProgress) {
    return { message: "Synchronization already running." };
  }

  if (!navigator.onLine) {
    return { message: "No internet connection." };
  }

  const email = getAdminEmail();

  syncInProgress = true;

  const result = {
    synced: 0,
    conflicts: 0,
    failed: 0
  };

  try {
    const operations = await getPendingOperations(email);

    if (operations.length === 0) {
      return {
        ...result,
        message: "Everything is already synchronized."
      };
    }

    const response = await api.get("/products");

    const serverProducts = new Map(
      response.data.map((product) => [
        Number(product.productId),
        product
      ])
    );

    for (const operation of operations) {
      if (!navigator.onLine) {
        break;
      }

      const {
        id,
        type,
        productId,
        product,
        baseProduct
      } = operation;

      const serverProduct = serverProducts.get(
        Number(productId)
      );

      try {
        if (type === "CREATE") {
          if (serverProduct) {
            if (productsMatch(serverProduct, product)) {
              // Previous sync may have succeeded before interruption.
              await removePendingOperation(id);
              result.synced++;
            } else {
              await updatePendingOperation(id, {
                status: "CONFLICT",
                conflictReason: "Product ID already exists on server."
              });

              result.conflicts++;
            }

            continue;
          }

          const createResponse = await api.post(
            "/products",
            product
          );

          serverProducts.set(
            Number(productId),
            createResponse.data
          );

          await removePendingOperation(id);
          result.synced++;
        }

        else if (type === "UPDATE") {
          if (!serverProduct) {
            await updatePendingOperation(id, {
              status: "CONFLICT",
              conflictReason: "Product no longer exists on server."
            });

            result.conflicts++;
            continue;
          }

          if (productsMatch(serverProduct, product)) {
            await removePendingOperation(id);
            result.synced++;
            continue;
          }

          if (!productsMatch(serverProduct, baseProduct)) {
            await updatePendingOperation(id, {
              status: "CONFLICT",
              conflictReason: "Product was changed on server by another user."
            });

            result.conflicts++;
            continue;
          }

          const updateResponse = await api.put(
            `/products/${productId}`,
            product
          );

          serverProducts.set(
            Number(productId),
            updateResponse.data
          );

          await removePendingOperation(id);
          result.synced++;
        }

        else if (type === "DELETE") {
          if (!serverProduct) {
            await removePendingOperation(id);
            result.synced++;
            continue;
          }

          if (!productsMatch(serverProduct, baseProduct)) {
            await updatePendingOperation(id, {
              status: "CONFLICT",
              conflictReason: "Product changed on server before deletion."
            });

            result.conflicts++;
            continue;
          }

          await api.delete(`/products/${productId}`);

          serverProducts.delete(Number(productId));

          await removePendingOperation(id);
          result.synced++;
        }

      } catch (operationError) {
        console.error(
          `Synchronization failed for product ${productId}:`,
          operationError
        );

        result.failed++;

        // Stop on request failure. Keep remaining operations.
        break;
      }
    }

    // Refresh local cache while preserving pending changes.
    try {
      await saveProductsOffline(
        email,
        Array.from(serverProducts.values())
      );
    } catch (cacheError) {
      console.error("Offline cache refresh failed:", cacheError);
    }

    return {
      ...result,
      message: "Synchronization completed."
    };

  } finally {
    syncInProgress = false;
  }
};