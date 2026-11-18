package inventory.service;

import inventory.DBConnection;
import inventory.dao.SalesDAO;
import inventory.model.Product;
import inventory.model.Sale;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDate;

public class SalesService {

    private final SalesDAO salesDAO = new SalesDAO();

    private final InventoryService inventoryService;

    public SalesService(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // 1. Sell Product using JDBC Transaction
    public void sellProduct(int productId, int quantitySold) {

        if (quantitySold <= 0) {
            System.out.println("Quantity must be greater than zero!");
            return;
        }

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) {
                System.out.println("Database connection failed!");
                return;
            }

            con.setAutoCommit(false);

            try {

                // Get product details and lock its stock row
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

                if (quantitySold > product.getQuantity()) {
                    con.rollback();
                    System.out.println("Insufficient stock!");
                    System.out.println(
                            "Available Stock: " + product.getQuantity()
                    );
                    return;
                }

                int remainingStock =
                        product.getQuantity() - quantitySold;

                double totalAmount =
                        product.getPrice() * quantitySold;

                // Update stock using the same connection
                String updateSQL =
                        "UPDATE products SET quantity = ? WHERE product_id = ?";

                try (PreparedStatement ps = con.prepareStatement(updateSQL)) {

                    ps.setInt(1, remainingStock);
                    ps.setInt(2, productId);

                    if (ps.executeUpdate() != 1) {
                        throw new SQLException("Stock update failed!");
                    }
                }

                // Create sale record
                Sale sale = new Sale(
                        0,
                        product.getProductId(),
                        product.getProductName(),
                        quantitySold,
                        totalAmount,
                        LocalDate.now()
                );

                // Insert sale using the same transaction
                if (!salesDAO.addSale(con, sale)) {
                    throw new SQLException("Sale insertion failed!");
                }

                // Save both operations permanently
                con.commit();

                System.out.println("\n========== SALE SUCCESSFUL ==========");
                System.out.println("Product Name: " + product.getProductName());
                System.out.println("Quantity Sold: " + quantitySold);
                System.out.println("Total Amount: Rs. " + totalAmount);
                System.out.println("Remaining Stock: " + remainingStock);
                System.out.println("======================================");

            } catch (SQLException e) {

                con.rollback();

                System.out.println("Sale failed! Transaction rolled back.");
                System.out.println("Reason: " + e.getMessage());
            }

        } catch (SQLException e) {
            System.out.println("Database Transaction Error: " + e.getMessage());
        }
    }

    // 2. View Sales History
    public void viewSales() {

        var sales = salesDAO.getAllSales();

        if (sales.isEmpty()) {
            System.out.println("No sales records available.");
            return;
        }

        for (Sale sale : sales) {
            sale.displaySale();
        }
    }

    // 3. Monthly Sales Total
    public double getMonthlySalesTotal(int year, int month) {
        return salesDAO.getMonthlySalesTotal(year, month);
    }

    // 4. Monthly Sales Count
    public int getMonthlySalesCount(int year, int month) {
        return salesDAO.getMonthlySalesCount(year, month);
    }

    // 5. Last 30 Days Sales
    public int getLast30DaysSales(int productId) {
        return salesDAO.getLast30DaysSales(productId);
    }
}