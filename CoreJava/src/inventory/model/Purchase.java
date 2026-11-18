package inventory.model;

import java.time.LocalDate;

public class Purchase {

    // Instance variables
    private int purchaseId;
    private int productId;
    private String productName;
    private int quantityPurchased;
    private double totalAmount;
    private LocalDate purchaseDate;

    // Constructor
    public Purchase(int purchaseId, int productId,
                    String productName, int quantityPurchased,
                    double totalAmount, LocalDate purchaseDate) {

        this.purchaseId = purchaseId;
        this.productId = productId;
        this.productName = productName;
        this.quantityPurchased = quantityPurchased;
        this.totalAmount = totalAmount;
        this.purchaseDate = purchaseDate;
    }

    // Getters
    public int getPurchaseId() {
        return purchaseId;
    }

    public int getProductId() {
        return productId;
    }

    public String getProductName() {
        return productName;
    }

    public int getQuantityPurchased() {
        return quantityPurchased;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    // Display Purchase Details
    public void displayPurchase() {

        System.out.println("\n========== PURCHASE DETAILS ==========");

        System.out.println("Purchase ID       : " + purchaseId);
        System.out.println("Product ID        : " + productId);
        System.out.println("Product Name      : " + productName);
        System.out.println("Quantity Purchased: " + quantityPurchased);
        System.out.println("Total Amount      : Rs. " + totalAmount);
        System.out.println("Purchase Date     : " + purchaseDate);

        System.out.println("======================================");
    }
}