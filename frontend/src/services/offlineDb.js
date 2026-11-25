import { openDB } from "idb";

const DB_NAME = "SmartStockOfflineDB";
const DB_VERSION = 2;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("products")) {
      const store = db.createObjectStore("products", {
        keyPath: ["accountEmail", "productId"]
      });

      store.createIndex("accountEmail", "accountEmail");
    }
    if (!db.objectStoreNames.contains("pendingOperations")) {
  const store = db.createObjectStore("pendingOperations", {
    keyPath: "id",
    autoIncrement: true
  });

  store.createIndex("accountEmail", "accountEmail");
  store.createIndex("productId", "productId");
}
  }
});

const getAccountEmail = (email) => {
  if (!email || typeof email !== "string") {
    throw new Error("Admin account email is required.");
  }

  return email.trim().toLowerCase();
};

export const saveProductsOffline = async (email, products) => {
  const accountEmail = getAccountEmail(email);
  const db = await dbPromise;

  const tx = db.transaction(
    ["products", "pendingOperations"],
    "readwrite"
  );

  const productsStore = tx.objectStore("products");
  const operationsStore = tx.objectStore("pendingOperations");

  const existingProducts = await productsStore
    .index("accountEmail")
    .getAllKeys(accountEmail);

  const pendingOperations = await operationsStore
    .index("accountEmail")
    .getAll(accountEmail);

  // Preserve products with pending offline operations.
  const pendingIds = new Set(
    pendingOperations.map((operation) => operation.productId)
  );

  // Remove outdated products that have no pending changes.
  for (const key of existingProducts) {
    const productId = key[1];

    if (!pendingIds.has(productId)) {
      await productsStore.delete(key);
    }
  }

  // Save server products without overwriting pending local changes.
  for (const product of products) {
    if (!pendingIds.has(product.productId)) {
      await productsStore.put({
        ...product,
        accountEmail
      });
    }
  }

  await tx.done;
};

export const getOfflineProducts = async (email) => {
  const accountEmail = getAccountEmail(email);
  const db = await dbPromise;

  return db.getAllFromIndex(
    "products",
    "accountEmail",
    accountEmail
  );
};
export const queueOfflineProductOperation = async (
  email,
  type,
  product,
  productId
) => {
  const accountEmail = getAccountEmail(email);

  if (!["CREATE", "UPDATE", "DELETE"].includes(type)) {
    throw new Error("Invalid offline operation.");
  }

  const db = await dbPromise;

  const tx = db.transaction(
    ["products", "pendingOperations"],
    "readwrite"
  );

  const productsStore = tx.objectStore("products");
  const operationsStore = tx.objectStore("pendingOperations");

  const existingProduct = await productsStore.get([
    accountEmail,
    productId
  ]);

  const accountOperations = await operationsStore
    .index("accountEmail")
    .getAll(accountEmail);

  const existingOperations = accountOperations.filter(
    (operation) => operation.productId === productId
  );

  const previousOperation = existingOperations[0];

  // Validate before modifying the transaction.
  if (type === "CREATE" && existingProduct && 
      previousOperation?.type !== "CREATE") {
    throw new Error("This product ID already exists locally.");
  }

  if (type === "UPDATE" && !existingProduct) {
    throw new Error("Product is not available in offline storage.");
  }

  if (type === "UPDATE" && previousOperation?.type === "DELETE") {
    throw new Error("This product is already marked for deletion.");
  }

  if (type === "DELETE" && !existingProduct) {
    throw new Error("Product is not available in offline storage.");
  }

  // Remove duplicate queued operations.
  for (const operation of existingOperations.slice(1)) {
    await operationsStore.delete(operation.id);
  }

  if (type === "CREATE") {
    await productsStore.put({
      ...product,
      accountEmail
    });

    await operationsStore.put({
      ...(previousOperation || {}),
      accountEmail,
      type: "CREATE",
      productId,
      product,
      status: "PENDING",
      conflictReason: null,
      createdAt: previousOperation?.createdAt || Date.now()
    });
  }

  if (type === "UPDATE") {
    await productsStore.put({
      ...product,
      accountEmail
    });

    await operationsStore.put({
      ...(previousOperation || {}),
      accountEmail,
      type: previousOperation?.type === "CREATE"
        ? "CREATE"
        : "UPDATE",
      productId,
      product,
      baseProduct: previousOperation?.baseProduct || existingProduct,
      status: "PENDING",
      conflictReason: null,
      createdAt: previousOperation?.createdAt || Date.now()
    });
  }

  if (type === "DELETE") {
    await productsStore.delete([
      accountEmail,
      productId
    ]);

    if (previousOperation?.type === "CREATE") {
      await operationsStore.delete(previousOperation.id);
    } else {
      await operationsStore.put({
        ...(previousOperation || {}),
        accountEmail,
        type: "DELETE",
        productId,
        product: null,
        baseProduct: previousOperation?.baseProduct || existingProduct,
        status: "PENDING",
        conflictReason: null,
        createdAt: previousOperation?.createdAt || Date.now()
      });
    }
  }

  await tx.done;
};
export const getPendingOperations = async (email) => {
  const accountEmail = getAccountEmail(email);
  const db = await dbPromise;

  return db.getAllFromIndex(
    "pendingOperations",
    "accountEmail",
    accountEmail
  );
};

export const removePendingOperation = async (id) => {
  const db = await dbPromise;

  return db.delete("pendingOperations", id);
};

export const updatePendingOperation = async (id, updates) => {
  const db = await dbPromise;

  const tx = db.transaction("pendingOperations", "readwrite");

  const operation = await tx.store.get(id);

  if (!operation) {
    await tx.done;
    return;
  }

  await tx.store.put({
    ...operation,
    ...updates
  });

  await tx.done;
};