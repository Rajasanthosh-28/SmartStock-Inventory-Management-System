package com.inventory.controller;

import com.inventory.service.ReportService;
import com.inventory.model.DashboardSummary;
import com.inventory.model.Product;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // Combined Dashboard Summary
    @GetMapping("/dashboard")
    public DashboardSummary getDashboardSummary() {
        return reportService.getDashboardSummary();
    }

    // Total Products
    @GetMapping("/total-products")
    public long getTotalProducts() {
        return reportService.getTotalProducts();
    }

    // Total Available Stock
    @GetMapping("/total-stock")
    public long getTotalStock() {
        return reportService.getTotalStock();
    }

    // Total Sales Amount
    @GetMapping("/total-sales")
    public BigDecimal getTotalSales() {
        return reportService.getTotalSales();
    }

    // Total Purchase Amount
    @GetMapping("/total-purchases")
    public BigDecimal getTotalPurchases() {
        return reportService.getTotalPurchases();
    }

    // Low Stock Products
    @GetMapping("/low-stock")
    public List<Product> getLowStockProducts() {
        return reportService.getLowStockProducts();
    }

    // Monthly Sales
    @GetMapping("/monthly-sales")
    public BigDecimal getMonthlySales(
            @RequestParam int year,
            @RequestParam int month) {

        return reportService.getMonthlySalesTotal(year, month);
    }

    // Monthly Purchases
    @GetMapping("/monthly-purchases")
    public BigDecimal getMonthlyPurchases(
            @RequestParam int year,
            @RequestParam int month) {

        return reportService.getMonthlyPurchasesTotal(year, month);
    }

    // Low Stock Product Count
    @GetMapping("/low-stock-count")
    public long getLowStockCount() {

       return reportService.getLowStockCount();
     }
}