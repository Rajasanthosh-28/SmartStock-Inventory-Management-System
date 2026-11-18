package com.inventory.controller;

import com.inventory.model.Supplier;
import com.inventory.service.SupplierService;

import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // Add Supplier
    @PostMapping
    public Supplier addSupplier(@Valid @RequestBody Supplier supplier) {
       return supplierService.addSupplier(supplier);
    }

    // Get All Suppliers
    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    // Get Supplier By ID
    @GetMapping("/{id}")
    public Supplier getSupplierById(@PathVariable Integer id) {
        return supplierService.getSupplierById(id);
    }

    // Update Supplier
   @PutMapping("/{id}")
   public Supplier updateSupplier(
        @PathVariable Integer id,
        @Valid @RequestBody Supplier supplier) {

      return supplierService.updateSupplier(id, supplier);
    }

    // Delete Supplier
    @DeleteMapping("/{id}")
    public String deleteSupplier(@PathVariable Integer id) {
        supplierService.deleteSupplier(id);
        return "Supplier deleted successfully!";
    }
}