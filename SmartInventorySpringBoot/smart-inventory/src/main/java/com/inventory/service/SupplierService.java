package com.inventory.service;

import com.inventory.model.Supplier;
import com.inventory.repository.SupplierRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // Add Supplier
    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    // Get All Suppliers
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // Get Supplier By ID
    public Supplier getSupplierById(Integer id) {
        return supplierRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found with ID: " + id));
    }

    // Update Supplier
    public Supplier updateSupplier(Integer id, Supplier updatedSupplier) {

        Supplier existingSupplier = getSupplierById(id);

        existingSupplier.setSupplierName(updatedSupplier.getSupplierName());
        existingSupplier.setPhoneNumber(updatedSupplier.getPhoneNumber());
        existingSupplier.setEmail(updatedSupplier.getEmail());
        existingSupplier.setAddress(updatedSupplier.getAddress());

        return supplierRepository.save(existingSupplier);
    }

    // Delete Supplier
    public void deleteSupplier(Integer id) {
        Supplier supplier = getSupplierById(id);
        supplierRepository.delete(supplier);
    }
}