import { useEffect, useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import {
  Plus,
  Search,
  RefreshCw,
  Package,
  Pencil,
  Trash2,
  X
} from "lucide-react";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from "../services/productService";

import "./Products.css";

const emptyProduct = {
  productId: "",
  productName: "",
  category: "",
  price: "",
  quantity: "",
  minimumStock: 5,
  expiryDate: ""
};

function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("productLoadError");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyProduct);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.productId);

    setFormData({
      productId: product.productId,
      productName: product.productName ?? "",
      category: product.category ?? "",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      minimumStock: product.minimumStock ?? 5,
      expiryDate: product.expiryDate ?? ""
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const product = {
        productId: Number(formData.productId),
        productName: formData.productName.trim(),
        category: formData.category.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        minimumStock: Number(formData.minimumStock),
        expiryDate: formData.expiryDate || null
      };

      if (
        !Number.isInteger(product.productId) ||
        product.productId <= 0
      ) {
        throw new Error("invalidProductId");
      }

      if (
        !product.productName ||
        !Number.isFinite(product.price) ||
        product.price <= 0 ||
        !Number.isInteger(product.quantity) ||
        product.quantity < 0 ||
        !Number.isInteger(product.minimumStock) ||
        product.minimumStock < 0
      ) {
        throw new Error("invalidProductDetails");
      }

      if (editingId !== null) {
        await updateProduct(editingId, product);
      } else {
        await addProduct(product);
      }

      setShowForm(false);
      setFormData(emptyProduct);
      setEditingId(null);

      await loadProducts();
    } catch (err) {
      setError(
        ["invalidProductId", "invalidProductDetails"].includes(err.message)
          ? err.message
          : "productSaveError"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(t("confirmDeleteProduct"));

    if (!confirmed) return;

    try {
      setError("");
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError("productDeleteError");
    }
  };

  const filteredProducts = products.filter((product) =>
    [
      product.productName,
      product.category,
      String(product.productId)
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="products-page">

      <div className="products-heading">
        <div>
          <h2>{t("productManagement")}</h2>
          <p>{t("manageInventoryProducts")}</p>
        </div>

        <button className="add-product-btn" onClick={openAddForm}>
          <Plus size={19} />
          {t("addProduct")}
        </button>
      </div>

      <div className="products-summary">
        <div className="product-summary-card">
          <Package size={25} />
          <div>
            <span>{t("totalProducts")}</span>
            <h3>{products.length}</h3>
          </div>
        </div>

        <div className="product-summary-card">
          <Package size={25} />
          <div>
            <span>{t("totalUnits")}</span>
            <h3>
              {products.reduce(
                (total, product) => total + Number(product.quantity || 0),
                0
              )}
            </h3>
          </div>
        </div>

        <div className="product-summary-card">
          <Package size={25} />
          <div>
            <span>{t("lowStockProducts")}</span>
            <h3>
              {
                products.filter(
                  (product) =>
                    Number(product.quantity) <=
                    Number(product.minimumStock ?? 5)
                ).length
              }
            </h3>
          </div>
        </div>
      </div>

      <div className="products-table-card">

        <div className="products-toolbar">
          <div>
            <h3>{t("allProducts")}</h3>
            <p>{filteredProducts.length} {t("productsFound")}</p>
          </div>

          <div className="products-actions">
            <div className="products-search">
              <Search size={18} />
              <input
                type="text"
                placeholder={t("searchProducts")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="refresh-products"
              onClick={loadProducts}
              title={t("refreshProducts")}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {error && <div className="products-error">{t(error)}</div>}

        {loading ? (
          <div className="products-message">{t("loadingProducts")}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="products-message">
            {t("noProductsFound")}
          </div>
        ) : (
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
                  <th>{t("productId")}</th>
                  <th>{t("productName")}</th>
                  <th>{t("category")}</th>
                  <th>{t("price")}</th>
                  <th>{t("quantity")}</th>
                  <th>{t("stockStatus")}</th>
                  <th>{t("expiryDate")}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const lowStock =
                    Number(product.quantity) <=
                    Number(product.minimumStock ?? 5);

                  return (
                    <tr key={product.productId}>
                      <td>#{product.productId}</td>
                      <td className="product-name">
                        {product.productName}
                      </td>
                      <td>{product.category || t("uncategorized")}</td>
                      <td>₹{Number(product.price).toLocaleString("en-IN")}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <span
                          className={
                            lowStock
                              ? "stock-badge low-stock"
                              : "stock-badge in-stock"
                          }
                        >
                          {lowStock ? t("lowStock") : t("inStock")}
                        </span>
                      </td>
                      <td>{product.expiryDate || "—"}</td>
                      <td>
                        <div className="product-row-actions">
                          <button
                            className="edit-product"
                            onClick={() => openEditForm(product)}
                            title={t("edit")}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            className="delete-product"
                            onClick={() => handleDelete(product.productId)}
                            title={t("delete")}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {showForm && (
        <div className="product-modal-overlay">
          <div className="product-modal">

            <div className="product-modal-header">
              <div>
                <h3>
                  {editingId !== null ? t("editProduct") : t("addNewProduct")}
                </h3>
                <p>{t("enterProductInformation")}</p>
              </div>

              <button
                className="close-product-modal"
                onClick={() => setShowForm(false)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="product-form-grid">

                <label>
                  {t("productIdRequired")}
                  <input
                    type="number"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    disabled={editingId !== null}
                    required
                  />
                </label>

                <label>
                  {t("productNameRequired")}
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </label>

                <label>
                  {t("category")}
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    maxLength={50}
                  />
                </label>

                <label>
                  {t("priceRequired")}
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </label>

                <label>
                  {t("quantityRequired")}
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                  />
                </label>

                <label>
                  {t("minimumStock")}
                  <input
                    type="number"
                    name="minimumStock"
                    value={formData.minimumStock}
                    onChange={handleChange}
                    min="0"
                    step="1"
                  />
                </label>

                <label className="full-width">
                  {t("expiryDate")}
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                </label>

              </div>

              <div className="product-form-buttons">
                <button
                  type="button"
                  className="cancel-product-btn"
                  onClick={() => setShowForm(false)}
                >
                  {t("cancel")}
                </button>

                <button
                  type="submit"
                  className="save-product-btn"
                  disabled={saving}
                >
                  {saving
                    ? t("saving")
                    : editingId !== null
                      ? t("updateProduct")
                      : t("saveProduct")}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
}

export default Products;