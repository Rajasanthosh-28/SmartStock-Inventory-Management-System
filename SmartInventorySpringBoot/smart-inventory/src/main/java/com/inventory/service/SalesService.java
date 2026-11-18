package com.inventory.service;

import com.inventory.model.Sale;
import com.inventory.model.Product;

import com.inventory.repository.SalesRepository;
import com.inventory.repository.ProductRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SalesService {

    private final SalesRepository salesRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;

    public SalesService(
            SalesRepository salesRepository,
            ProductRepository productRepository,
            NotificationService notificationService) {

        this.salesRepository = salesRepository;
        this.productRepository = productRepository;
        this.notificationService = notificationService;
    }

    // Check low stock
    private boolean isLowStock(Product product) {

        int minimumStock = product.getMinimumStock() != null
                ? product.getMinimumStock()
                : 5;

        return product.getQuantity() <= minimumStock;
    }

    // Generate low-stock notification
    private void generateLowStockNotification(Product product) {

        String title = "Low Stock Alert";

        String message = product.getProductName()
                + " has only "
                + product.getQuantity()
                + " units remaining. Minimum stock level is "
                + (product.getMinimumStock() != null
                    ? product.getMinimumStock()
                    : 5)
                + ".";

        notificationService.createNotification(
                title,
                message,
                "LOW_STOCK",
                product.getProductId().longValue()
        );
    }

    // 1. Add Sale
    @Transactional
    public Sale addSale(Sale sale) {

        Product product = productRepository.findById(sale.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found!"));

        if (sale.getQuantitySold() == null
                || sale.getQuantitySold() <= 0) {

            throw new RuntimeException("Invalid sale quantity!");
        }

        if (product.getQuantity() < sale.getQuantitySold()) {
            throw new RuntimeException("Insufficient stock!");
        }

        // Check previous stock status
        boolean wasLowStock = isLowStock(product);

        // Deduct stock
        product.setQuantity(
                product.getQuantity() - sale.getQuantitySold()
        );

        productRepository.save(product);

        // Check new stock status
        if (!wasLowStock && isLowStock(product)) {
            generateLowStockNotification(product);
        }

        sale.setProductName(product.getProductName());

        return salesRepository.save(sale);
    }

    // 2. Get All Sales
    public List<Sale> getAllSales() {

        return salesRepository.findAll();
    }

    // 3. Get Sale By ID
    public Sale getSaleById(Integer id) {

        return salesRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sale not found with ID: " + id
                        ));
    }

    // 4. Update Sale
    @Transactional
    public Sale updateSale(Integer id, Sale updatedSale) {

        Sale existingSale = getSaleById(id);

        if (updatedSale.getQuantitySold() == null
                || updatedSale.getQuantitySold() <= 0) {

            throw new RuntimeException("Invalid sale quantity!");
        }

        // Find previous product
        Product oldProduct = productRepository.findById(
                existingSale.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Previous product not found!"));

        // Find updated product
        Product newProduct = productRepository.findById(
                updatedSale.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Updated product not found!"));

        // Capture stock status before changes
        boolean oldProductWasLow = isLowStock(oldProduct);

        boolean newProductWasLow = oldProduct.getProductId()
                .equals(newProduct.getProductId())
                ? oldProductWasLow
                : isLowStock(newProduct);

        // Restore previous sale quantity
        oldProduct.setQuantity(
                oldProduct.getQuantity() + existingSale.getQuantitySold()
        );

        // Check available stock
        if (newProduct.getQuantity() < updatedSale.getQuantitySold()) {
            throw new RuntimeException("Insufficient stock!");
        }

        // Deduct updated sale quantity
        newProduct.setQuantity(
                newProduct.getQuantity() - updatedSale.getQuantitySold()
        );

        // Save updated stock
        productRepository.save(oldProduct);

        if (!oldProduct.getProductId().equals(newProduct.getProductId())) {
            productRepository.save(newProduct);
        }

        // Generate notification if a product crosses low-stock threshold
        if (!oldProductWasLow && isLowStock(oldProduct)) {
            generateLowStockNotification(oldProduct);
        }

        if (!oldProduct.getProductId().equals(newProduct.getProductId())
                && !newProductWasLow
                && isLowStock(newProduct)) {

            generateLowStockNotification(newProduct);
        }

        // Update sale details
        existingSale.setProductId(newProduct.getProductId());
        existingSale.setProductName(newProduct.getProductName());
        existingSale.setQuantitySold(updatedSale.getQuantitySold());
        existingSale.setTotalAmount(updatedSale.getTotalAmount());
        existingSale.setSaleDate(updatedSale.getSaleDate());

        return salesRepository.save(existingSale);
    }

    // 5. Delete Sale
    @Transactional
    public void deleteSale(Integer id) {

        Sale sale = getSaleById(id);

        Product product = productRepository.findById(
                sale.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found!"));

        // Restore stock
        product.setQuantity(
                product.getQuantity() + sale.getQuantitySold()
        );

        productRepository.save(product);

        salesRepository.delete(sale);
    }
}