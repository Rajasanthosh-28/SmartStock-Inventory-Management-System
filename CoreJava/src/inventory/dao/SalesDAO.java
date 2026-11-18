package inventory.dao;

import inventory.DBConnection;
import inventory.model.Sale;

import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class SalesDAO {

    // 1. Add Sale using an existing database connection
    public boolean addSale(Connection con, Sale sale) {

        String sql = "INSERT INTO sales "
                + "(product_id, product_name, quantity_sold, total_amount, sale_date) "
                + "VALUES (?, ?, ?, ?, ?)";

        try (PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, sale.getProductId());
            ps.setString(2, sale.getProductName());
            ps.setInt(3, sale.getQuantitySold());
            ps.setDouble(4, sale.getTotalAmount());
            ps.setDate(5, Date.valueOf(sale.getSaleDate()));

            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            System.out.println("Sale Insert Error: " + e.getMessage());
            return false;
        }
    }

    // 2. View All Sales
    public List<Sale> getAllSales() {

        List<Sale> sales = new ArrayList<>();

        String sql = "SELECT * FROM sales ORDER BY sale_id DESC";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return sales;

            try (PreparedStatement ps = con.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {

                    Sale sale = new Sale(
                            rs.getInt("sale_id"),
                            rs.getInt("product_id"),
                            rs.getString("product_name"),
                            rs.getInt("quantity_sold"),
                            rs.getDouble("total_amount"),
                            rs.getDate("sale_date").toLocalDate()
                    );

                    sales.add(sale);
                }
            }

        } catch (SQLException e) {
            System.out.println("Sales Retrieval Error: " + e.getMessage());
        }

        return sales;
    }

    // 3. Monthly Sales Total
    public double getMonthlySalesTotal(int year, int month) {

        String sql = "SELECT COALESCE(SUM(total_amount), 0) FROM sales "
                + "WHERE YEAR(sale_date) = ? AND MONTH(sale_date) = ?";

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
            System.out.println("Monthly Sales Error: " + e.getMessage());
        }

        return 0;
    }

    // 4. Monthly Sales Count
    public int getMonthlySalesCount(int year, int month) {

        String sql = "SELECT COUNT(*) FROM sales "
                + "WHERE YEAR(sale_date) = ? AND MONTH(sale_date) = ?";

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
            System.out.println("Monthly Count Error: " + e.getMessage());
        }

        return 0;
    }

    // 5. Last 30 Days Sales Quantity
    public int getLast30DaysSales(int productId) {

        String sql = "SELECT COALESCE(SUM(quantity_sold), 0) FROM sales "
                + "WHERE product_id = ? AND sale_date BETWEEN ? AND ?";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return 0;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setInt(1, productId);
                ps.setDate(2, Date.valueOf(LocalDate.now().minusDays(30)));
                ps.setDate(3, Date.valueOf(LocalDate.now()));

                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) return rs.getInt(1);
                }
            }

        } catch (SQLException e) {
            System.out.println("Demand Calculation Error: " + e.getMessage());
        }

        return 0;
    }
}