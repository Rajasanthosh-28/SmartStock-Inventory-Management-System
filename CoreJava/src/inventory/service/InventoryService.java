package inventory.service;

import inventory.model.Product;
import inventory.dao.ProductDAO;

import java.time.LocalDate;
import java.util.List;

public class InventoryService {

    private final ProductDAO productDAO = new ProductDAO();

    // 1. Add Product
    public void addProduct(Product product) {

        if (productDAO.getProductById(product.getProductId()) != null) {
            System.out.println("Product ID already exists!");
            return;
        }

        if (productDAO.addProduct(product)) {
            System.out.println("Product added successfully!");
        } else {
            System.out.println("Failed to add product!");
        }
    }

    // 2. View All Products
    public void viewProducts() {

        List<Product> products = productDAO.getAllProducts();

        if (products.isEmpty()) {
            System.out.println("No products available.");
            return;
        }

        System.out.println("\n========== PRODUCT LIST ==========");

        for (Product p : products) {
            p.displayProduct();
        }
    }

    // 3. Search Product
    public void searchProduct(int productId) {

        Product product = getProductById(productId);

        if (product != null) {
            product.displayProduct();
        } else {
            System.out.println("Product not found!");
        }
    }

    // 4. Update Stock
    public void updateStock(int productId, int newQuantity) {

        if (newQuantity < 0) {
            System.out.println("Quantity cannot be negative!");
            return;
        }

        if (getProductById(productId) == null) {
            System.out.println("Product not found!");
            return;
        }

        if (productDAO.updateStock(productId, newQuantity)) {
            System.out.println("Stock updated successfully!");
        } else {
            System.out.println("Failed to update stock!");
        }
    }

    // 5. Delete Product
    public void deleteProduct(int productId) {

        if (getProductById(productId) == null) {
            System.out.println("Product not found!");
            return;
        }

        if (productDAO.deleteProduct(productId)) {
            System.out.println("Product deleted successfully!");
        } else {
            System.out.println("Failed to delete product!");
        }
    }

    // 6. Low Stock Alerts
    public void lowStockAlerts() {

        boolean found = false;

        System.out.println("\n========== LOW STOCK ALERTS ==========");

        for (Product p : productDAO.getAllProducts()) {

            if (p.getQuantity() <= p.getMinimumStock()) {

                System.out.println(
                    "LOW STOCK: " + p.getProductName()
                    + " | Available: " + p.getQuantity()
                    + " | Minimum: " + p.getMinimumStock()
                );

                found = true;
            }
        }

        if (!found) {
            System.out.println("No low-stock products.");
        }
    }

    // 7. Expiry Alerts
    public void expiryAlerts() {

        LocalDate today = LocalDate.now();

        boolean found = false;

        System.out.println("\n========== EXPIRY ALERTS ==========");

        for (Product p : productDAO.getAllProducts()) {

            LocalDate expiryDate = p.getExpiryDate();

            if (expiryDate != null &&
                !expiryDate.isAfter(today.plusDays(30))) {

                System.out.println(
                    "EXPIRY ALERT: " + p.getProductName()
                    + " | Expiry Date: " + expiryDate
                );

                found = true;
            }
        }

        if (!found) {
            System.out.println("No products expiring within 30 days.");
        }
    }

    // 8. Find Product by ID
    public Product getProductById(int productId) {

        return productDAO.getProductById(productId);
    }
}
