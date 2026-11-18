package com.inventory.model;

import java.math.BigDecimal;

public class DashboardSummary {

    private long totalProducts;
    private long totalStock;
    private BigDecimal totalSales;
    private BigDecimal totalPurchases;

    public DashboardSummary(
            long totalProducts,
            long totalStock,
            BigDecimal totalSales,
            BigDecimal totalPurchases) {

        this.totalProducts = totalProducts;
        this.totalStock = totalStock;
        this.totalSales = totalSales;
        this.totalPurchases = totalPurchases;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public long getTotalStock() {
        return totalStock;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public BigDecimal getTotalPurchases() {
        return totalPurchases;
    }
}