import { useEffect, useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import {
  Plus,
  Search,
  RefreshCw,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  Pencil,
  Trash2,
  X
} from "lucide-react";

import {
  getSales,
  addSale,
  updateSale,
  deleteSale
} from "../services/salesService";

import "./Sales.css";

const emptySale = {
  productId: "",
  productName: "",
  quantitySold: "",
  totalAmount: "",
  saleDate: new Date().toISOString().split("T")[0]
};

function Sales() {
  const { t } = useTranslation();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorKey, setErrorKey] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptySale);
  const [saving, setSaving] = useState(false);

  const loadSales = async () => {
    try {
      setLoading(true);
      setErrorKey("");
      const data = await getSales();
      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Unable to load sales:", err);
      setErrorKey("salesLoadError");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({ ...emptySale, saleDate: new Date().toISOString().split("T")[0] });
    setErrorKey("");
    setShowForm(true);
  };

  const openEditForm = (sale) => {
    setEditingId(sale.saleId);
    setFormData({
      productId: sale.productId ?? "",
      productName: sale.productName ?? "",
      quantitySold: sale.quantitySold ?? "",
      totalAmount: sale.totalAmount ?? "",
      saleDate: sale.saleDate ?? ""
    });
    setErrorKey("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorKey("");
      const sale = {
        productId: Number(formData.productId),
        productName: formData.productName.trim(),
        quantitySold: Number(formData.quantitySold),
        totalAmount: Number(formData.totalAmount),
        saleDate: formData.saleDate
      };

      if (
        !Number.isInteger(sale.productId) || sale.productId <= 0 ||
        !sale.productName ||
        !Number.isInteger(sale.quantitySold) || sale.quantitySold <= 0 ||
        !Number.isFinite(sale.totalAmount) || sale.totalAmount <= 0 ||
        !sale.saleDate
      ) {
        setErrorKey("invalidSaleDetails");
        return;
      }

      if (editingId !== null) {
        await updateSale(editingId, sale);
      } else {
        await addSale(sale);
      }

      setShowForm(false);
      setFormData(emptySale);
      setEditingId(null);
      await loadSales();
    } catch (err) {
      console.error("Unable to save sale:", err);
      setErrorKey("saleSaveError");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDeleteSale"))) return;
    try {
      setErrorKey("");
      await deleteSale(id);
      await loadSales();
    } catch (err) {
      console.error("Unable to delete sale:", err);
      setErrorKey("saleDeleteError");
    }
  };

  const filteredSales = sales.filter((sale) =>
    [sale.saleId, sale.productName, sale.productId]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalRevenue = sales.reduce(
    (total, sale) => total + Number(sale.totalAmount || 0), 0
  );
  const totalUnitsSold = sales.reduce(
    (total, sale) => total + Number(sale.quantitySold || 0), 0
  );

  return (
    <section className="sales-page">
      <div className="sales-heading">
        <div>
          <h2>{t("salesManagement")}</h2>
          <p>{t("salesManagementDescription")}</p>
        </div>
        <button className="add-sale-btn" onClick={openAddForm}>
          <Plus size={19} />
          {t("recordSale")}
        </button>
      </div>

      <div className="sales-summary">
        <div className="sales-summary-card">
          <div className="sales-icon blue"><ShoppingCart size={23} /></div>
          <div><span>{t("totalTransactions")}</span><h3>{sales.length}</h3></div>
        </div>
        <div className="sales-summary-card">
          <div className="sales-icon green"><IndianRupee size={23} /></div>
          <div>
            <span>{t("totalRevenue")}</span>
            <h3>₹{totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="sales-summary-card">
          <div className="sales-icon purple"><TrendingUp size={23} /></div>
          <div><span>{t("totalUnitsSold")}</span><h3>{totalUnitsSold.toLocaleString("en-IN")}</h3></div>
        </div>
      </div>

      <div className="sales-table-card">
        <div className="sales-toolbar">
          <div>
            <h3>{t("salesHistory")}</h3>
            <p>{filteredSales.length} {t("transactionsFound")}</p>
          </div>
          <div className="sales-actions">
            <div className="sales-search">
              <Search size={18} />
              <input
                type="text"
                placeholder={t("searchSales")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="refresh-sales" onClick={loadSales} title={t("refreshSales")} aria-label={t("refreshSales")}>
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {errorKey && <div className="sales-error" role="alert">{t(errorKey)}</div>}

        {loading ? (
          <div className="sales-message">{t("loadingSales")}</div>
        ) : filteredSales.length === 0 ? (
          <div className="sales-message">{t("noSalesFound")}</div>
        ) : (
          <div className="sales-table-wrapper">
            <table className="sales-table">
              <thead><tr>
                <th>{t("saleId")}</th>
                <th>{t("productId")}</th>
                <th>{t("productName")}</th>
                <th>{t("quantitySold")}</th>
                <th>{t("totalAmount")}</th>
                <th>{t("saleDate")}</th>
                <th>{t("actions")}</th>
              </tr></thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.saleId}>
                    <td>#{sale.saleId}</td>
                    <td>#{sale.productId}</td>
                    <td className="sale-product-name">{sale.productName}</td>
                    <td>{sale.quantitySold}</td>
                    <td className="sale-amount">₹{Number(sale.totalAmount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
                    <td>{sale.saleDate}</td>
                    <td><div className="sale-row-actions">
                      <button className="edit-sale" onClick={() => openEditForm(sale)} title={t("editSale")} aria-label={t("editSale")}><Pencil size={17} /></button>
                      <button className="delete-sale" onClick={() => handleDelete(sale.saleId)} title={t("deleteSale")} aria-label={t("deleteSale")}><Trash2 size={17} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="sale-modal-overlay">
          <div className="sale-modal">
            <div className="sale-modal-header">
              <div>
                <h3>{editingId !== null ? t("editSale") : t("recordNewSale")}</h3>
                <p>{t("enterSaleInformation")}</p>
              </div>
              <button className="close-sale-modal" onClick={() => setShowForm(false)} title={t("close")} aria-label={t("close")}><X size={21} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="sale-form-grid">
                <label>{t("productIdRequired")}
                  <input type="number" name="productId" value={formData.productId} onChange={handleChange} min="1" required />
                </label>
                <label>{t("productNameRequired")}
                  <input type="text" name="productName" value={formData.productName} onChange={handleChange} maxLength={100} required />
                </label>
                <label>{t("quantitySoldRequired")}
                  <input type="number" name="quantitySold" value={formData.quantitySold} onChange={handleChange} min="1" required />
                </label>
                <label>{t("totalAmountRequired")}
                  <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleChange} min="0.01" step="0.01" required />
                </label>
                <label className="sale-full-width">{t("saleDateRequired")}
                  <input type="date" name="saleDate" value={formData.saleDate} onChange={handleChange} required />
                </label>
              </div>
              <div className="sale-form-buttons">
                <button type="button" className="cancel-sale-btn" onClick={() => setShowForm(false)}>{t("cancel")}</button>
                <button type="submit" className="save-sale-btn" disabled={saving}>
                  {saving ? t("saving") : editingId !== null ? t("updateSale") : t("saveSale")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Sales;
