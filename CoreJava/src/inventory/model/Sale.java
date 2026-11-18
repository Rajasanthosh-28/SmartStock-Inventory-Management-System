package inventory.model;

import java.time.LocalDate;

public class Sale {

    // Instance variables
    private int saleId;
    private int productId;
    private String productName;
    private int quantitySold;
    private double totalAmount;
    private LocalDate saleDate;

    // Constructor
    public Sale(int saleId, int productId, String productName,
                int quantitySold, double totalAmount,
                LocalDate saleDate) {

        this.saleId = saleId;
        this.productId = productId;
        this.productName = productName;
        this.quantitySold = quantitySold;
        this.totalAmount = totalAmount;
        this.saleDate = saleDate;
    }

    // Getters
    public int getSaleId() {
        return saleId;
    }

    public int getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public int getQuantitySold() {
        return quantitySold;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public LocalDate getSaleDate() {
        return saleDate;
    }

    // Display Sale Details
    public void displaySale() {

        System.out.println("\n========== SALE DETAILS ==========");
        System.out.println("Sale ID       : " + saleId);
        System.out.println("Product ID    : " + productId);
        System.out.println("Product Name  : " + productName);
        System.out.println("Quantity Sold : " + quantitySold);
        System.out.println("Total Amount  : Rs. " + totalAmount);
        System.out.println("Sale Date     : " + saleDate);
        System.out.println("==================================");
    }
}