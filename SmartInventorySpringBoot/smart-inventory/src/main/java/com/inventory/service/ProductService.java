package com.inventory.service;

import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final NotificationService notificationService;

    // Constructor Injection
    public ProductService(
            ProductRepository productRepository,
            NotificationService notificationService) {

        this.productRepository = productRepository;
        this.notificationService = notificationService;
    }

    // Check whether product stock is low
    private boolean isLowStock(Product product) {

        int minimumStock = product.getMinimumStock() != null
                ? product.getMinimumStock()
                : 5;

        return product.getQuantity() <= minimumStock;
    }

    // Generate Low Stock Notification
    private void generateLowStockNotification(Product product) {

        String title = "Low Stock Alert";

        String message = product.getProductName()
                + " has only "
                + product.getQuantity()
                + " units remaining. Minimum stock level is "
                + product.getMinimumStock()
                + ".";

        notificationService.createNotification(
                title,
                message,
                "LOW_STOCK",
                product.getProductId().longValue()
        );
    }

    // Add Product
    public Product addProduct(Product product) {

        Product savedProduct = productRepository.save(product);

        if (isLowStock(savedProduct)) {
            generateLowStockNotification(savedProduct);
        }

        return savedProduct;
    }

    // View All Products
    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }

    // Search Product by ID
    public Product getProductById(Integer id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with ID: " + id
                        ));
    }

    // Update Product
    public Product updateProduct(
            Integer id,
            Product updatedProduct) {

        Product existingProduct = getProductById(id);

        // Check previous stock status
        boolean wasLowStock = isLowStock(existingProduct);

        // Update product details
        existingProduct.setProductName(updatedProduct.getProductName());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setQuantity(updatedProduct.getQuantity());
        existingProduct.setMinimumStock(updatedProduct.getMinimumStock());
        existingProduct.setExpiryDate(updatedProduct.getExpiryDate());

        // Save updated product
        Product savedProduct = productRepository.save(existingProduct);

        // Check new stock status
        boolean isNowLowStock = isLowStock(savedProduct);

        // Notify only when stock changes from normal to low
        if (!wasLowStock && isNowLowStock) {
            generateLowStockNotification(savedProduct);
        }

        return savedProduct;
    }

    // Delete Product
    public void deleteProduct(Integer id) {

        Product product = getProductById(id);

        productRepository.delete(product);
    }
}