package inventory.service;

import inventory.dao.SupplierDAO;
import inventory.model.Supplier;

import java.util.List;

public class SupplierService {

    private final SupplierDAO supplierDAO = new SupplierDAO();

    // 1. Add Supplier
    public void addSupplier(Supplier supplier) {

        if (supplierDAO.getSupplierById(supplier.getSupplierId()) != null) {
            System.out.println("Supplier ID already exists!");
            return;
        }

        if (supplierDAO.addSupplier(supplier)) {
            System.out.println("Supplier added successfully!");
        } else {
            System.out.println("Failed to add supplier!");
        }
    }

    // 2. View All Suppliers
    public void viewSuppliers() {

        List<Supplier> suppliers = supplierDAO.getAllSuppliers();

        if (suppliers.isEmpty()) {
            System.out.println("No suppliers available.");
            return;
        }

        System.out.println("\n========== SUPPLIER LIST ==========");

        for (Supplier supplier : suppliers) {
            supplier.displaySupplier();
        }
    }

    // 3. Search Supplier
    public void searchSupplier(int supplierId) {

        Supplier supplier = supplierDAO.getSupplierById(supplierId);

        if (supplier != null) {
            supplier.displaySupplier();
        } else {
            System.out.println("Supplier not found!");
        }
    }

    // 4. Update Supplier
    public void updateSupplier(int supplierId, String name,
                               String phone, String email, String address) {

        Supplier supplier = supplierDAO.getSupplierById(supplierId);

        if (supplier == null) {
            System.out.println("Supplier not found!");
            return;
        }

        supplier.setSupplierName(name);
        supplier.setPhoneNumber(phone);
        supplier.setEmail(email);
        supplier.setAddress(address);

        if (supplierDAO.updateSupplier(supplier)) {
            System.out.println("Supplier updated successfully!");
        } else {
            System.out.println("Failed to update supplier!");
        }
    }

    // 5. Delete Supplier
    public void deleteSupplier(int supplierId) {

        if (supplierDAO.getSupplierById(supplierId) == null) {
            System.out.println("Supplier not found!");
            return;
        }

        if (supplierDAO.deleteSupplier(supplierId)) {
            System.out.println("Supplier deleted successfully!");
        } else {
            System.out.println("Failed to delete supplier!");
        }
    }

    // 6. Find Supplier by ID
    public Supplier getSupplierById(int supplierId) {

        return supplierDAO.getSupplierById(supplierId);
    }
}