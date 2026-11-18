package com.inventory.service;

import com.inventory.repository.ProductRepository;
import com.inventory.repository.SalesRepository;
import com.inventory.repository.PurchaseRepository;
import com.inventory.model.DashboardSummary;
import com.inventory.model.Product;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ReportService {

    private final ProductRepository productRepository;
    private final SalesRepository salesRepository;
    private final PurchaseRepository purchaseRepository;

    public ReportService(
            ProductRepository productRepository,
            SalesRepository salesRepository,
            PurchaseRepository purchaseRepository) {

        this.productRepository = productRepository;
        this.salesRepository = salesRepository;
        this.purchaseRepository = purchaseRepository;
    }

    // Total Products
    public long getTotalProducts() {
        return productRepository.count();
    }

    // Total Available Stock
    public long getTotalStock() {
        return productRepository.findAll()
                .stream()
                .mapToLong(product -> product.getQuantity())
                .sum();
    }

    // Total Sales Amount
    public BigDecimal getTotalSales() {
        return salesRepository.findAll()
                .stream()
                .map(sale -> sale.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Total Purchase Amount
    public BigDecimal getTotalPurchases() {
        return purchaseRepository.findAll()
                .stream()
                .map(purchase -> purchase.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Get Low Stock Products
    public List<Product> getLowStockProducts() {
        return productRepository.findAll()
                .stream()
                .filter(product ->
                        product.getMinimumStock() != null
                        && product.getQuantity() <= product.getMinimumStock())
                .toList();
    }
    // Total Number of Low Stock Products
      public long getLowStockCount() {

        return getLowStockProducts().size();
      }

    // Monthly Sales Total
    public BigDecimal getMonthlySalesTotal(int year, int month) {
        return salesRepository.findAll()
                .stream()
                .filter(sale ->
                        sale.getSaleDate().getYear() == year
                        && sale.getSaleDate().getMonthValue() == month)
                .map(sale -> sale.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Monthly Purchase Total
    public BigDecimal getMonthlyPurchasesTotal(int year, int month) {
        return purchaseRepository.findAll()
                .stream()
                .filter(purchase ->
                        purchase.getPurchaseDate().getYear() == year
                        && purchase.getPurchaseDate().getMonthValue() == month)
                .map(purchase -> purchase.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Combined Dashboard Summary
    public DashboardSummary getDashboardSummary() {
        return new DashboardSummary(
                getTotalProducts(),
                getTotalStock(),
                getTotalSales(),
                getTotalPurchases()
        );
    }
}