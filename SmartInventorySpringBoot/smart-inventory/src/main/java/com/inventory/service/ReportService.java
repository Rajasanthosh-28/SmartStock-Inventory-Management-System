package com.inventory.service;

import com.inventory.repository.ProductRepository;
import com.inventory.repository.SalesRepository;
import com.inventory.repository.PurchaseRepository;
import com.inventory.model.DashboardSummary;
import com.inventory.model.Product;
import com.inventory.model.Sale;
import com.inventory.model.Purchase;
import com.inventory.model.SalesPurchaseChartDTO;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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
                .mapToLong(Product::getQuantity)
                .sum();
    }

    // Total Sales Amount
    public BigDecimal getTotalSales() {
        return salesRepository.findAll()
                .stream()
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Total Purchase Amount
    public BigDecimal getTotalPurchases() {
        return purchaseRepository.findAll()
                .stream()
                .map(Purchase::getTotalAmount)
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
                .map(Sale::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Monthly Purchase Total
    public BigDecimal getMonthlyPurchasesTotal(int year, int month) {
        return purchaseRepository.findAll()
                .stream()
                .filter(purchase ->
                        purchase.getPurchaseDate().getYear() == year
                        && purchase.getPurchaseDate().getMonthValue() == month)
                .map(Purchase::getTotalAmount)
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

    // ==========================================
    // SALES AND PURCHASES GRAPH
    // ==========================================

    public List<SalesPurchaseChartDTO> getSalesPurchaseChart(
            String period,
            LocalDate startDate,
            LocalDate endDate,
            Integer year,
            Integer startYear,
            Integer endYear) {

        Map<String, BigDecimal[]> chartData = new LinkedHashMap<>();

        // DATE TO DATE
        if ("DATE".equalsIgnoreCase(period)) {

            if (startDate == null || endDate == null) {
                throw new IllegalArgumentException(
                        "Start date and end date are required.");
            }

            if (startDate.isAfter(endDate)) {
                throw new IllegalArgumentException(
                        "Start date cannot be after end date.");
            }

            for (LocalDate date = startDate;
                 !date.isAfter(endDate);
                 date = date.plusDays(1)) {

                String label = date.toString();

                chartData.put(label, new BigDecimal[]{
                        BigDecimal.ZERO,
                        BigDecimal.ZERO
                });
            }

            // Actual Sales
            for (Sale sale : salesRepository.findAll()) {

                LocalDate date = sale.getSaleDate();

                if (!date.isBefore(startDate)
                        && !date.isAfter(endDate)) {

                    String label = date.toString();

                    chartData.get(label)[0] =
                            chartData.get(label)[0]
                                    .add(sale.getTotalAmount());
                }
            }

            // Actual Purchases
            for (Purchase purchase : purchaseRepository.findAll()) {

                LocalDate date = purchase.getPurchaseDate();

                if (!date.isBefore(startDate)
                        && !date.isAfter(endDate)) {

                    String label = date.toString();

                    chartData.get(label)[1] =
                            chartData.get(label)[1]
                                    .add(purchase.getTotalAmount());
                }
            }
        }

        // MONTH TO MONTH
        else if ("MONTH".equalsIgnoreCase(period)) {

            if (year == null) {
                throw new IllegalArgumentException(
                        "Year is required for monthly filtering.");
            }

            for (int month = 1; month <= 12; month++) {

                String label = String.format(
                        "%04d-%02d", year, month);

                chartData.put(label, new BigDecimal[]{
                        BigDecimal.ZERO,
                        BigDecimal.ZERO
                });
            }

            // Actual Sales
            for (Sale sale : salesRepository.findAll()) {

                LocalDate date = sale.getSaleDate();

                if (date.getYear() == year) {

                    String label = String.format(
                            "%04d-%02d",
                            date.getYear(),
                            date.getMonthValue());

                    chartData.get(label)[0] =
                            chartData.get(label)[0]
                                    .add(sale.getTotalAmount());
                }
            }

            // Actual Purchases
            for (Purchase purchase : purchaseRepository.findAll()) {

                LocalDate date = purchase.getPurchaseDate();

                if (date.getYear() == year) {

                    String label = String.format(
                            "%04d-%02d",
                            date.getYear(),
                            date.getMonthValue());

                    chartData.get(label)[1] =
                            chartData.get(label)[1]
                                    .add(purchase.getTotalAmount());
                }
            }
        }

        // YEAR TO YEAR
        else if ("YEAR".equalsIgnoreCase(period)) {

            if (startYear == null || endYear == null) {
                throw new IllegalArgumentException(
                        "Start year and end year are required.");
            }

            if (startYear > endYear) {
                throw new IllegalArgumentException(
                        "Start year cannot be greater than end year.");
            }

            if (endYear - startYear > 50) {
                throw new IllegalArgumentException(
                        "Year range cannot exceed 50 years.");
            }

            for (int currentYear = startYear;
                 currentYear <= endYear;
                 currentYear++) {

                String label = String.valueOf(currentYear);

                chartData.put(label, new BigDecimal[]{
                        BigDecimal.ZERO,
                        BigDecimal.ZERO
                });
            }

            // Actual Sales
            for (Sale sale : salesRepository.findAll()) {

                int saleYear = sale.getSaleDate().getYear();

                if (saleYear >= startYear && saleYear <= endYear) {

                    String label = String.valueOf(saleYear);

                    chartData.get(label)[0] =
                            chartData.get(label)[0]
                                    .add(sale.getTotalAmount());
                }
            }

            // Actual Purchases
            for (Purchase purchase : purchaseRepository.findAll()) {

                int purchaseYear = purchase.getPurchaseDate().getYear();

                if (purchaseYear >= startYear
                        && purchaseYear <= endYear) {

                    String label = String.valueOf(purchaseYear);

                    chartData.get(label)[1] =
                            chartData.get(label)[1]
                                    .add(purchase.getTotalAmount());
                }
            }
        }

        else {
            throw new IllegalArgumentException(
                    "Invalid period. Use DATE, MONTH or YEAR.");
        }

        // Convert calculated data into DTO response
        List<SalesPurchaseChartDTO> result = new ArrayList<>();

        chartData.forEach((label, values) -> {

            result.add(new SalesPurchaseChartDTO(
                    label,
                    values[0],
                    values[1]
            ));
        });

        return result;
    }
}