package com.inventory.service;

import com.inventory.model.Purchase;
import com.inventory.repository.PurchaseRepository;
import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;
    private final DashboardUpdateService dashboardUpdateService;

    public PurchaseService(
            PurchaseRepository purchaseRepository,
            ProductRepository productRepository,
            NotificationService notificationService,
            DashboardUpdateService dashboardUpdateService) {

        this.purchaseRepository = purchaseRepository;
        this.productRepository = productRepository;
        this.notificationService = notificationService;
        this.dashboardUpdateService = dashboardUpdateService;
    }

    // Check low-stock status
    private boolean isLowStock(Product product) {

        int minimumStock = product.getMinimumStock() != null
                ? product.getMinimumStock()
                : 5;

        return product.getQuantity() <= minimumStock;
    }

    // Generate low-stock notification
    private void generateLowStockNotification(Product product) {

        int minimumStock = product.getMinimumStock() != null
                ? product.getMinimumStock()
                : 5;

        String title = "Low Stock Alert";

        String message = product.getProductName()
                + " has only "
                + product.getQuantity()
                + " units remaining. Minimum stock level is "
                + minimumStock
                + ".";

        notificationService.createNotification(
                title,
                message,
                "LOW_STOCK",
                product.getProductId().longValue()
        );
    }

    // Check and generate notification after stock reduction
    private void checkLowStockTransition(
            Product product,
            boolean wasLowStock) {

        if (!wasLowStock && isLowStock(product)) {
            generateLowStockNotification(product);
        }
    }

    // 1. Add Purchase
    @Transactional
    public Purchase addPurchase(Purchase purchase) {

        Product product = productRepository.findById(
                purchase.getProductId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with ID: "
                                        + purchase.getProductId()));

        if (purchase.getQuantityPurchased() == null
                || purchase.getQuantityPurchased() <= 0) {

            throw new RuntimeException(
                    "Purchase quantity must be greater than zero!");
        }

        // Increase product stock
        int updatedQuantity = product.getQuantity()
                + purchase.getQuantityPurchased();

        product.setQuantity(updatedQuantity);

        productRepository.save(product);

        // Save purchase record
        purchase.setProductName(product.getProductName());

        Purchase savedPurchase = purchaseRepository.save(purchase);

        dashboardUpdateService.publishUpdateAfterCommit(
                "PURCHASE_ADDED");

        return savedPurchase;
    }

    // 2. Get All Purchases
    public List<Purchase> getAllPurchases() {

        return purchaseRepository.findAll();
    }

    // 3. Get Purchase By ID
    public Purchase getPurchaseById(Integer id) {

        return purchaseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Purchase not found with ID: " + id));
    }

    // 4. Update Purchase
    @Transactional
    public Purchase updatePurchase(
            Integer id,
            Purchase updatedPurchase) {

        if (updatedPurchase.getQuantityPurchased() == null
                || updatedPurchase.getQuantityPurchased() <= 0) {

            throw new RuntimeException(
                    "Purchase quantity must be greater than zero!");
        }

        Purchase existingPurchase = getPurchaseById(id);

        // Find old product
        Product oldProduct = productRepository.findById(
                existingPurchase.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Old product not found!"));

        // Find new product
        Product newProduct = productRepository.findById(
                updatedPurchase.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("New product not found!"));

        boolean sameProduct = oldProduct.getProductId()
                .equals(newProduct.getProductId());

        // Capture original low-stock status
        boolean oldProductWasLow = isLowStock(oldProduct);

        if (sameProduct) {

            int difference = updatedPurchase.getQuantityPurchased()
                    - existingPurchase.getQuantityPurchased();

            int newStock = oldProduct.getQuantity() + difference;

            if (newStock < 0) {
                throw new RuntimeException("Insufficient stock!");
            }

            oldProduct.setQuantity(newStock);

            productRepository.save(oldProduct);

            checkLowStockTransition(oldProduct, oldProductWasLow);

        } else {

            // Remove previous purchase quantity from old product
            int oldStock = oldProduct.getQuantity()
                    - existingPurchase.getQuantityPurchased();

            if (oldStock < 0) {
                throw new RuntimeException(
                        "Cannot change purchase: insufficient stock!");
            }

            oldProduct.setQuantity(oldStock);

            productRepository.save(oldProduct);

            checkLowStockTransition(oldProduct, oldProductWasLow);

            // Add purchased quantity to new product
            newProduct.setQuantity(
                    newProduct.getQuantity()
                            + updatedPurchase.getQuantityPurchased());

            productRepository.save(newProduct);
        }

        // Update purchase details
        existingPurchase.setProductId(newProduct.getProductId());
        existingPurchase.setProductName(newProduct.getProductName());

        existingPurchase.setQuantityPurchased(
                updatedPurchase.getQuantityPurchased());

        existingPurchase.setTotalAmount(
                updatedPurchase.getTotalAmount());

        existingPurchase.setPurchaseDate(
                updatedPurchase.getPurchaseDate());

        Purchase savedPurchase =
                purchaseRepository.save(existingPurchase);

        dashboardUpdateService.publishUpdateAfterCommit(
                "PURCHASE_UPDATED");

        return savedPurchase;
    }

    // 5. Delete Purchase
    @Transactional
    public void deletePurchase(Integer id) {

        Purchase purchase = getPurchaseById(id);

        Product product = productRepository.findById(
                purchase.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found!"));

        // Capture original stock status
        boolean wasLowStock = isLowStock(product);

        // Calculate remaining stock
        int updatedStock = product.getQuantity()
                - purchase.getQuantityPurchased();

        if (updatedStock < 0) {
            throw new RuntimeException(
                    "Cannot delete purchase: insufficient stock!");
        }

        // Update product stock
        product.setQuantity(updatedStock);

        productRepository.save(product);

        // Generate notification if stock crosses minimum
        checkLowStockTransition(product, wasLowStock);

        // Delete purchase record
        purchaseRepository.delete(purchase);

        dashboardUpdateService.publishUpdateAfterCommit(
                "PURCHASE_DELETED");
    }
}