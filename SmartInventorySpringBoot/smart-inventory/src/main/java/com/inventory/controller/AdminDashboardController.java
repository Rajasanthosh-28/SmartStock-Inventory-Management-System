package com.inventory.controller;

import com.inventory.repository.ProductRepository;
import com.inventory.repository.SalesRepository;
import com.inventory.repository.PurchaseRepository;
import com.inventory.repository.SupplierRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    private final ProductRepository productRepository;
    private final SalesRepository salesRepository;
    private final PurchaseRepository purchaseRepository;
    private final SupplierRepository supplierRepository;

    public AdminDashboardController(
            ProductRepository productRepository,
            SalesRepository salesRepository,
            PurchaseRepository purchaseRepository,
            SupplierRepository supplierRepository) {

        this.productRepository = productRepository;
        this.salesRepository = salesRepository;
        this.purchaseRepository = purchaseRepository;
        this.supplierRepository = supplierRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardStatistics() {

        return Map.of(
                "totalProducts", productRepository.count(),
                "totalSales", salesRepository.count(),
                "totalPurchases", purchaseRepository.count(),
                "totalSuppliers", supplierRepository.count()
        );
    }
}