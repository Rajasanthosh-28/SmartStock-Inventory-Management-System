package inventory.model;

import java.time.LocalDate;

public class Product {

    // Instance variables
    private int productId;
    private String productName;
    private String category;
    private double price;
    private int quantity;
    private int minimumStock;
    private LocalDate expiryDate;

    // Constructor
    public Product(int productId, String productName, String category,
                   double price, int quantity, int minimumStock,
                   LocalDate expiryDate) {

        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
        this.minimumStock = minimumStock;
        this.expiryDate = expiryDate;
    }

    // Getters
    public int getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public String getCategory() {
        return category;
    }

    public double getPrice() {
        return price;
    }

    public int getQuantity() {
        return quantity;
    }

    public int getMinimumStock() {
        return minimumStock;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    // Setters
    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void setMinimumStock(int minimumStock) {
        this.minimumStock = minimumStock;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    // Display product details
    public void displayProduct() {

        System.out.println("--------------------------------");
        System.out.println("Product ID       : " + productId);
        System.out.println("Product Name     : " + productName);
        System.out.println("Category         : " + category);
        System.out.println("Price            : " + price);
        System.out.println("Available Stock  : " + quantity);
        System.out.println("Minimum Stock    : " + minimumStock);
        System.out.println("Expiry Date      : " + expiryDate);
        System.out.println("--------------------------------");
    }
}