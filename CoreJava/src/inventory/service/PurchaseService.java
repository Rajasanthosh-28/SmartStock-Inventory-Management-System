package inventory.service;

import inventory.DBConnection;
import inventory.dao.PurchaseDAO;
import inventory.model.Product;
import inventory.model.Purchase;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDate;

public class PurchaseService {

    private final PurchaseDAO purchaseDAO = new PurchaseDAO();

    private final InventoryService inventoryService;

    public PurchaseService(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // 1. Record Purchase using JDBC Transaction
    public void recordPurchase(int productId, int quantityPurchased,
                               double purchasePrice) {

        if (quantityPurchased <= 0 || purchasePrice <= 0) {
            System.out.println("Invalid quantity or purchase price!");
            return;
        }

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) {
                System.out.println("Database connection failed!");
                return;
            }

            con.setAutoCommit(false);

            try {

                // Lock product row and get its details
                Product product = null;

                String selectSQL =
                        "SELECT * FROM products WHERE product_id = ? FOR UPDATE";

                try (PreparedStatement ps = con.prepareStatement(selectSQL)) {

                    ps.setInt(1, productId);

                    try (java.sql.ResultSet rs = ps.executeQuery()) {

                        if (rs.next()) {

                            java.sql.Date expiry =
                                    rs.getDate("expiry_date");

                            product = new Product(
                                    rs.getInt("product_id"),
                                    rs.getString("product_name"),
                                    rs.getString("category"),
                                    rs.getDouble("price"),
                                    rs.getInt("quantity"),
                                    rs.getInt("minimum_stock"),
                                    expiry == null ? null : expiry.toLocalDate()
                            );
                        }
                    }
                }

                if (product == null) {
                    con.rollback();
                    System.out.println("Product not found!");
                    return;
                }

                int updatedStock =
                        product.getQuantity() + quantityPurchased;

                // Update stock using the same connection
                String updateSQL =
                        "UPDATE products SET quantity = ? WHERE product_id = ?";

                try (PreparedStatement ps = con.prepareStatement(updateSQL)) {

                    ps.setInt(1, updatedStock);
                    ps.setInt(2, productId);

                    if (ps.executeUpdate() != 1) {
                        throw new SQLException("Stock update failed!");
                    }
                }

                double totalAmount =
                        purchasePrice * quantityPurchased;

                // Create purchase record
                Purchase purchase = new Purchase(
                        0,
                        product.getProductId(),
                        product.getProductName(),
                        quantityPurchased,
                        totalAmount,
                        LocalDate.now()
                );

                // Insert purchase using the same transaction
                if (!purchaseDAO.addPurchase(con, purchase)) {
                    throw new SQLException("Purchase insertion failed!");
                }

                // Commit both operations
                con.commit();

                System.out.println("\n========== PURCHASE SUCCESSFUL ==========");
                System.out.println("Product Name: " + product.getProductName());
                System.out.println("Quantity Purchased: " + quantityPurchased);
                System.out.println("Purchase Price: Rs. " + purchasePrice);
                System.out.println("Total Amount: Rs. " + totalAmount);
                System.out.println("Updated Stock: " + updatedStock);
                System.out.println("==========================================");

            } catch (SQLException e) {

                con.rollback();

                System.out.println("Purchase failed! Transaction rolled back.");
                System.out.println("Reason: " + e.getMessage());
            }

        } catch (SQLException e) {
            System.out.println("Database Transaction Error: " + e.getMessage());
        }
    }

    // 2. View Purchase History
    public void viewPurchases() {

        var purchases = purchaseDAO.getAllPurchases();

        if (purchases.isEmpty()) {
            System.out.println("No purchase records available.");
            return;
        }

        for (Purchase purchase : purchases) {
            purchase.displayPurchase();
        }
    }

    // 3. Monthly Purchase Total
    public double getMonthlyPurchaseTotal(int year, int month) {
        return purchaseDAO.getMonthlyPurchaseTotal(year, month);
    }

    // 4. Monthly Purchase Count
    public int getMonthlyPurchaseCount(int year, int month) {
        return purchaseDAO.getMonthlyPurchaseCount(year, month);
    }
}