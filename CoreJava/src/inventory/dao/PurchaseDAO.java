package inventory.dao;

import inventory.DBConnection;
import inventory.model.Purchase;

import java.sql.*;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

public class PurchaseDAO {

    // 1. Add Purchase
   // Add Purchase using an existing transaction
      public boolean addPurchase(Connection con, Purchase purchase) {

           String sql = "INSERT INTO purchases "
               + "(product_id, product_name, quantity_purchased, total_amount, purchase_date) "
               + "VALUES (?, ?, ?, ?, ?)";

           try (PreparedStatement ps = con.prepareStatement(sql)) {

                 ps.setInt(1, purchase.getProductId());
                 ps.setString(2, purchase.getProductName());
                 ps.setInt(3, purchase.getQuantityPurchased());
                 ps.setDouble(4, purchase.getTotalAmount());
                 ps.setDate(5, Date.valueOf(purchase.getPurchaseDate()));
 
                 return ps.executeUpdate() > 0;

             } catch (SQLException e) {

                 System.out.println("Purchase Insert Error: " + e.getMessage());
                 return false;
             }
           }

    // 2. View All Purchases
    public List<Purchase> getAllPurchases() {

        List<Purchase> purchases = new ArrayList<>();

        String sql = "SELECT * FROM purchases ORDER BY purchase_id DESC";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return purchases;

            try (PreparedStatement ps = con.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {

                    Purchase purchase = new Purchase(
                            rs.getInt("purchase_id"),
                            rs.getInt("product_id"),
                            rs.getString("product_name"),
                            rs.getInt("quantity_purchased"),
                            rs.getDouble("total_amount"),
                            rs.getDate("purchase_date").toLocalDate()
                    );

                    purchases.add(purchase);
                }
            }

        } catch (SQLException e) {
            System.out.println("Purchase Retrieval Error: " + e.getMessage());
        }

        return purchases;
    }

    // 3. Monthly Purchase Total
    public double getMonthlyPurchaseTotal(int year, int month) {

        String sql = "SELECT COALESCE(SUM(total_amount), 0) FROM purchases "
                + "WHERE YEAR(purchase_date) = ? AND MONTH(purchase_date) = ?";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return 0;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setInt(1, year);
                ps.setInt(2, month);

                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) return rs.getDouble(1);
                }
            }

        } catch (SQLException e) {
            System.out.println("Monthly Purchase Error: " + e.getMessage());
        }

        return 0;
    }

    // 4. Monthly Purchase Count
    public int getMonthlyPurchaseCount(int year, int month) {

        String sql = "SELECT COUNT(*) FROM purchases "
                + "WHERE YEAR(purchase_date) = ? AND MONTH(purchase_date) = ?";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return 0;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setInt(1, year);
                ps.setInt(2, month);

                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) return rs.getInt(1);
                }
            }

        } catch (SQLException e) {
            System.out.println("Monthly Purchase Count Error: " + e.getMessage());
        }

        return 0;
    }
}
