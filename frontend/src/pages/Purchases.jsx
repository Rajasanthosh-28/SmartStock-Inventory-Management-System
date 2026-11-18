import { useEffect, useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import {
  Plus,
  Search,
  ShoppingCart,
  Package,
  IndianRupee,
  Pencil,
  Trash2,
  X,
  RefreshCw
} from "lucide-react";

import {
  getPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase
} from "../services/purchaseService";

import { getProducts } from "../services/productService";

import "./Purchases.css";

function Purchases() {
  const { t } = useTranslation();
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const initialForm = {
    productId: "",
    quantityPurchased: "",
    totalAmount: "",
    purchaseDate: new Date().toISOString().split("T")[0]
  };

  const [form, setForm] = useState(initialForm);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [purchaseData, productData] = await Promise.all([
        getPurchases(),
        getProducts()
      ]);

      setPurchases(purchaseData);
      setProducts(productData);
    } catch (err) {
      setError(
        t("purchaseLoadError")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPurchases = purchases.filter((purchase) =>
    [
      purchase.purchaseId,
      purchase.productId,
      purchase.productName
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalUnits = purchases.reduce(
    (sum, item) => sum + Number(item.quantityPurchased || 0),
    0
  );

  const totalValue = purchases.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const openAddModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (purchase) => {
    setEditingId(purchase.purchaseId);

    setForm({
      productId: purchase.productId,
      quantityPurchased: purchase.quantityPurchased,
      totalAmount: purchase.totalAmount,
      purchaseDate: purchase.purchaseDate
    });

    setError("");
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const purchaseData = {
        productId: Number(form.productId),
        quantityPurchased: Number(form.quantityPurchased),
        totalAmount: Number(form.totalAmount),
        purchaseDate: form.purchaseDate
      };

      if (
        !purchaseData.productId ||
        purchaseData.quantityPurchased < 1 ||
        purchaseData.totalAmount <= 0 ||
        !purchaseData.purchaseDate
      ) {
        setError(t("invalidPurchaseDetails"));
        return;
      }

      if (editingId) {
        await updatePurchase(editingId, purchaseData);
      } else {
        await addPurchase(purchaseData);
      }

      setShowModal(false);
      setForm(initialForm);

      await loadData();

    } catch (err) {
      setError(
        t("purchaseSaveError")
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("confirmDeletePurchase")
    );

    if (!confirmed) return;

    try {
      setError("");

      await deletePurchase(id);
      await loadData();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        t("purchaseDeleteError")
      );
    }
  };

  return (
    <div className="purchases-page">

      <div className="purchase-page-header">
        <div>
          <span className="purchase-eyebrow"> {t("inventoryManagement")} </span>
          <h1> {t("purchaseManagement")} </h1>
          <p> {t("purchaseManagementDescription")} </p>
        </div>

        <button className="purchase-primary-btn" onClick={openAddModal}>
          <Plus size={19} />
          Add Purchase
        </button>
      </div>

      <div className="purchase-summary-grid">

        <div className="purchase-summary-card">
          <div className="purchase-summary-icon purple">
            <ShoppingCart size={23} />
          </div>
          <div>
            <span> {t("totalPurchases")} </span>
            <h2>{purchases.length}</h2>
          </div>
        </div>

        <div className="purchase-summary-card">
          <div className="purchase-summary-icon blue">
            <Package size={23} />
          </div>
          <div>
            <span> {t("totalUnitsPurchased")} </span>
            <h2>{totalUnits.toLocaleString("en-IN")}</h2>
          </div>
        </div>

        <div className="purchase-summary-card">
          <div className="purchase-summary-icon green">
            <IndianRupee size={23} />
          </div>
          <div>
            <span> {t("totalPurchaseValue")} </span>
            <h2>
              ₹{totalValue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </h2>
          </div>
        </div>

      </div>

      <div className="purchase-table-container">

        <div className="purchase-table-header">
          <div>
            <h2> {t("purchaseRecords")} </h2>
            <p> {t("purchaseRecordsDescription")} </p>
          </div>

          <div className="purchase-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder={t("searchPurchases")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              type="button"
              title={t("refresh")}
              onClick={loadData}
              className="purchase-refresh-btn"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {error && !showModal && (
          <div className="purchase-error">{error}</div>
        )}

        {loading ? (
          <div className="purchase-loading">
            Loading purchases...
          </div>
        ) : (

          <div className="purchase-table-scroll">
            <table className="purchase-table">

              <thead>
                <tr>
                  <th> {t("purchaseId")} </th>
                  <th>{t("product")}</th>
                  <th> {t("quantity")} </th>
                  <th> {t("totalAmount")} </th>
                  <th> {t("purchaseDate")} </th>
                  <th> {t("actions")} </th>
                </tr>
              </thead>

              <tbody>

                {filteredPurchases.length > 0 ? (

                  filteredPurchases.map((purchase) => (

                    <tr key={purchase.purchaseId}>

                      <td>
                        <span className="purchase-id">
                          #{purchase.purchaseId}
                        </span>
                      </td>

                      <td>
                        <div className="purchase-product-cell">
                          <strong>{purchase.productName}</strong>
                          <small>{t("productIdPrefix")}{purchase.productId}</small>
                        </div>
                      </td>

                      <td>
                        <span className="purchase-quantity">
                          {purchase.quantityPurchased} {t("units")}
                        </span>
                      </td>

                      <td className="purchase-amount">
                        ₹{Number(purchase.totalAmount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2
                        })}
                      </td>

                      <td>{purchase.purchaseDate}</td>

                      <td>
                        <div className="purchase-actions">

                          <button
                            className="purchase-edit-btn"
                            title={t("edit")}
                            onClick={() => openEditModal(purchase)}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="purchase-delete-btn"
                            title={t("delete")}
                            onClick={() => handleDelete(purchase.purchaseId)}
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td colSpan="6" className="purchase-empty">
                      No purchase records found.
                    </td>
                  </tr>

                )}

              </tbody>

            </table>
          </div>
        )}

        <div className="purchase-table-footer">
          {t("showing")} {filteredPurchases.length} {t("of")} {purchases.length} {t("purchases")}
        </div>

      </div>

      {showModal && (

        <div className="purchase-modal-overlay">

          <div className="purchase-modal">

            <div className="purchase-modal-header">
              <div>
                <h2>
                  {editingId ? t("editPurchase") : t("addNewPurchase")}
                </h2>
                <p> {t("enterPurchaseInformation")} </p>
              </div>

              <button
                className="purchase-close-btn"
                onClick={() => setShowModal(false)}
                type="button"
              >
                <X size={21} />
              </button>
            </div>

            {error && (
              <div className="purchase-error">{String(error)}</div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="purchase-form-group">
                <label> {t("selectProductRequired")} </label>

                <select
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  required
                >
                  <option value=""> {t("chooseProduct")} </option>

                  {products.map((product) => (
                    <option
                      key={product.productId}
                      value={product.productId}
                    >
                      {product.productName} (ID: {product.productId})
                    </option>
                  ))}

                </select>
              </div>

              <div className="purchase-form-row">

                <div className="purchase-form-group">
                  <label> {t("quantityPurchasedRequired")} </label>

                  <input
                    type="number"
                    name="quantityPurchased"
                    min="1"
                    value={form.quantityPurchased}
                    onChange={handleChange}
                    placeholder={t("enterQuantity")}
                    required
                  />
                </div>

                <div className="purchase-form-group">
                  <label> {t("totalAmountRequired")} </label>

                  <input
                    type="number"
                    name="totalAmount"
                    min="0.01"
                    step="0.01"
                    value={form.totalAmount}
                    onChange={handleChange}
                    placeholder={t("enterAmount")}
                    required
                  />
                </div>

              </div>

              <div className="purchase-form-group">
                <label> {t("purchaseDateRequired")} </label>

                <input
                  type="date"
                  name="purchaseDate"
                  value={form.purchaseDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="purchase-modal-actions">

                <button
                  type="button"
                  className="purchase-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="purchase-primary-btn"
                >
                  {editingId ? t("updatePurchase") : t("savePurchase")}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Purchases;