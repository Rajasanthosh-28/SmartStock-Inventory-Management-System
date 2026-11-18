package inventory.dao;

import inventory.DBConnection;
import inventory.model.Product;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {

    // Add Product
    public boolean addProduct(Product product) {

        String sql = "INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return false;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setInt(1, product.getProductId());
                ps.setString(2, product.getProductName());
                ps.setString(3, product.getCategory());
                ps.setDouble(4, product.getPrice());
                ps.setInt(5, product.getQuantity());
                ps.setInt(6, product.getMinimumStock());

                if (product.getExpiryDate() == null) {
                    ps.setNull(7, Types.DATE);
                } else {
                    ps.setDate(7, Date.valueOf(product.getExpiryDate()));
                }

                return ps.executeUpdate() > 0;
            }

        } catch (SQLException e) {
            System.out.println("Add Product Error: " + e.getMessage());
            return false;
        }
    }

    // Get All Products
    public List<Product> getAllProducts() {

        List<Product> products = new ArrayList<>();

        String sql = "SELECT * FROM products";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return products;

            try (PreparedStatement ps = con.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {

                    Date expiry = rs.getDate("expiry_date");

                    Product product = new Product(
                            rs.getInt("product_id"),
                            rs.getString("product_name"),
                            rs.getString("category"),
                            rs.getDouble("price"),
                            rs.getInt("quantity"),
                            rs.getInt("minimum_stock"),
                            expiry == null ? null : expiry.toLocalDate()
                    );

                    products.add(product);
                }
            }

        } catch (SQLException e) {
            System.out.println("View Products Error: " + e.getMessage());
        }

        return products;
    }

    // Find Product by ID
    public Product getProductById(int productId) {

        String sql = "SELECT * FROM products WHERE product_id = ?";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return null;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setInt(1, productId);

                try (ResultSet rs = ps.executeQuery()) {

                    if (rs.next()) {

                        Date expiry = rs.getDate("expiry_date");

                        return new Product(
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

        } catch (SQLException e) {
            System.out.println("Search Product Error: " + e.getMessage());
        }

        return null;
    }

    // Update Stock
    public boolean updateStock(int productId, int quantity) {

        String sql = "UPDATE products SET quantity = ? WHERE product_id = ?";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return false;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setInt(1, quantity);
                ps.setInt(2, productId);

                return ps.executeUpdate() > 0;
            }

        } catch (SQLException e) {
            System.out.println("Update Stock Error: " + e.getMessage());
            return false;
        }
    }

    // Delete Product
    public boolean deleteProduct(int productId) {

        String sql = "DELETE FROM products WHERE product_id = ?";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return false;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setInt(1, productId);

                return ps.executeUpdate() > 0;
            }

        } catch (SQLException e) {
            System.out.println("Delete Product Error: " + e.getMessage());
            return false;
        }
    }
}