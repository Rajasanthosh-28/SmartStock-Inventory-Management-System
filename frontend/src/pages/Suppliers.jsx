import { useEffect, useState } from "react";
import { useTranslation } from "../context/TranslationContext";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Truck,
  Users,
  Mail,
  Phone,
  MapPin,
  X,
  RefreshCw
} from "lucide-react";

import {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier
} from "../services/supplierService";

import "./Suppliers.css";

function Suppliers() {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const emptyForm = {
    supplierId: "",
    supplierName: "",
    phoneNumber: "",
    email: "",
    address: ""
  };

  const [formData, setFormData] = useState(emptyForm);

  // Load suppliers
  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error("Error loading suppliers:", err);
      setError(t("supplierLoadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // Open add modal
  const handleAdd = () => {
    setEditingSupplier(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);

    setFormData({
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName || "",
      phoneNumber: supplier.phoneNumber || "",
      email: supplier.email || "",
      address: supplier.address || ""
    });

    setShowModal(true);
  };

  // Save supplier
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const supplierData = {
        supplierId: Number(formData.supplierId),
        supplierName: formData.supplierName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        address: formData.address.trim()
      };

      if (editingSupplier) {
        await updateSupplier(editingSupplier.supplierId, supplierData);
        alert(t("supplierUpdated"));
      } else {
        await addSupplier(supplierData);
        alert(t("supplierAdded"));
      }

      setShowModal(false);
      setFormData(emptyForm);
      setEditingSupplier(null);

      await loadSuppliers();
    } catch (err) {
      console.error("Error saving supplier:", err);

      const message =
        t("supplierSaveError");

      alert(t("supplierSaveError"));
    }
  };

  // Delete supplier
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      t("confirmDeleteSupplier")
    );

    if (!confirmed) return;

    try {
      await deleteSupplier(id);
      alert(t("supplierDeleted"));
      await loadSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);

      alert(
        err.response?.data?.message ||
        t("supplierDeleteError")
      );
    }
  };

  // Search suppliers
  const filteredSuppliers = suppliers.filter((supplier) => {
    const search = searchTerm.toLowerCase();

    return (
      String(supplier.supplierId).includes(search) ||
      supplier.supplierName?.toLowerCase().includes(search) ||
      supplier.phoneNumber?.toLowerCase().includes(search) ||
      supplier.email?.toLowerCase().includes(search) ||
      supplier.address?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="suppliers-page">

      {/* Page Header */}
      <div className="suppliers-header">
        <div>
          <h1> {t("suppliers")} </h1>
          <p> {t("suppliersDescription")} </p>
        </div>

        <button className="supplier-primary-btn" onClick={handleAdd}>
          <Plus size={18} />
          Add Supplier
        </button>
      </div>

      {/* Summary Card */}
      <div className="supplier-summary-grid">
        <div className="supplier-summary-card">
          <div className="supplier-summary-icon">
            <Users size={23} />
          </div>

          <div>
            <p> {t("totalSuppliers")} </p>
            <h2>{suppliers.length}</h2>
            <span> {t("registeredSuppliers")} </span>
          </div>
        </div>
      </div>

      {/* Supplier Table Section */}
      <div className="supplier-table-container">

        <div className="supplier-table-header">
          <div>
            <h2> {t("supplierDirectory")} </h2>
            <p> {t("supplierDirectoryDescription")} </p>
          </div>

          <div className="supplier-table-actions">
            <div className="supplier-search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder={t("searchSuppliers")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="supplier-refresh-btn"
              onClick={loadSuppliers}
              title={t("refreshSuppliers")}
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {error && (
          <div className="supplier-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="supplier-loading">
            Loading suppliers...
          </div>
        ) : (
          <div className="supplier-table-wrapper">
            <table className="supplier-table">
              <thead>
                <tr>
                  <th> {t("supplierId")} </th>
                  <th> {t("supplierName")} </th>
                  <th> {t("phoneNumber")} </th>
                  <th> {t("emailAddress")} </th>
                  <th> {t("address")} </th>
                  <th> {t("actions")} </th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier.supplierId}>
                      <td>
                        <span className="supplier-id">
                          #{supplier.supplierId}
                        </span>
                      </td>

                      <td>
                        <div className="supplier-name-cell">
                          <div className="supplier-avatar">
                            <Truck size={17} />
                          </div>

                          <span>{supplier.supplierName}</span>
                        </div>
                      </td>

                      <td>
                        <span className="supplier-contact">
                          <Phone size={14} />
                          {supplier.phoneNumber || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="supplier-contact">
                          <Mail size={14} />
                          {supplier.email || "—"}
                        </span>
                      </td>

                      <td>
                        <span className="supplier-contact">
                          <MapPin size={14} />
                          {supplier.address || "—"}
                        </span>
                      </td>

                      <td>
                        <div className="supplier-action-buttons">
                          <button
                            className="supplier-edit-btn"
                            onClick={() => handleEdit(supplier)}
                            title={t("editSupplier")}
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            className="supplier-delete-btn"
                            onClick={() => handleDelete(supplier.supplierId)}
                            title={t("deleteSupplier")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="supplier-empty">
                      {searchTerm
                        ? t("noSuppliersMatch")
                        : t("noSuppliersFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="supplier-table-footer">
          {t("showing")} {filteredSuppliers.length} {t("of")} {suppliers.length} {t("suppliersCount")}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="supplier-modal-overlay">
          <div className="supplier-modal">

            <div className="supplier-modal-header">
              <div>
                <h2>
                  {editingSupplier ? t("editSupplierHeading") : t("addNewSupplier")}
                </h2>

                <p>
                  {editingSupplier
                    ? t("updateSupplierInformation")
                    : t("enterSupplierDetails")}
                </p>
              </div>

              <button
                className="supplier-modal-close"
                onClick={() => setShowModal(false)}
                type="button"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="supplier-form-grid">

                <div className="supplier-form-group">
                  <label> {t("supplierIdRequired")} </label>

                  <input
                    type="number"
                    name="supplierId"
                    placeholder={t("enterSupplierId")}
                    value={formData.supplierId}
                    onChange={handleChange}
                    disabled={Boolean(editingSupplier)}
                    required
                    min="1"
                  />
                </div>

                <div className="supplier-form-group">
                  <label> {t("supplierNameRequired")} </label>

                  <input
                    type="text"
                    name="supplierName"
                    placeholder={t("enterSupplierName")}
                    value={formData.supplierName}
                    onChange={handleChange}
                    maxLength="100"
                    required
                  />
                </div>

                <div className="supplier-form-group">
                  <label> {t("phoneNumber")} </label>

                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder={t("enterPhoneNumber")}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    maxLength="20"
                  />
                </div>

                <div className="supplier-form-group">
                  <label> {t("emailAddress")} </label>

                  <input
                    type="email"
                    name="email"
                    placeholder={t("enterEmailAddress")}
                    value={formData.email}
                    onChange={handleChange}
                    maxLength="100"
                  />
                </div>

                <div className="supplier-form-group supplier-full-width">
                  <label> {t("address")} </label>

                  <textarea
                    name="address"
                    placeholder={t("enterSupplierAddress")}
                    value={formData.address}
                    onChange={handleChange}
                    maxLength="255"
                    rows="3"
                  />
                </div>

              </div>

              <div className="supplier-modal-actions">
                <button
                  type="button"
                  className="supplier-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="supplier-primary-btn"
                >
                  {editingSupplier ? t("updateSupplier") : t("saveSupplier")}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Suppliers;