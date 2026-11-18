package inventory.dao;

import inventory.DBConnection;
import inventory.model.Supplier;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SupplierDAO {

    // 1. Add Supplier
    public boolean addSupplier(Supplier supplier) {

        String sql = "INSERT INTO suppliers "
                + "(supplier_id, supplier_name, phone_number, email, address) "
                + "VALUES (?, ?, ?, ?, ?)";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return false;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setInt(1, supplier.getSupplierId());
                ps.setString(2, supplier.getSupplierName());
                ps.setString(3, supplier.getPhoneNumber());
                ps.setString(4, supplier.getEmail());
                ps.setString(5, supplier.getAddress());

                return ps.executeUpdate() > 0;
            }

        } catch (SQLException e) {
            System.out.println("Add Supplier Error: " + e.getMessage());
            return false;
        }
    }

    // 2. View All Suppliers
    public List<Supplier> getAllSuppliers() {

        List<Supplier> suppliers = new ArrayList<>();

        String sql = "SELECT * FROM suppliers";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return suppliers;

            try (PreparedStatement ps = con.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {

                    Supplier supplier = new Supplier(
                            rs.getInt("supplier_id"),
                            rs.getString("supplier_name"),
                            rs.getString("phone_number"),
                            rs.getString("email"),
                            rs.getString("address")
                    );

                    suppliers.add(supplier);
                }
            }

        } catch (SQLException e) {
            System.out.println("View Suppliers Error: " + e.getMessage());
        }

        return suppliers;
    }

    // 3. Search Supplier
    public Supplier getSupplierById(int supplierId) {

        String sql = "SELECT * FROM suppliers WHERE supplier_id = ?";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return null;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setInt(1, supplierId);

                try (ResultSet rs = ps.executeQuery()) {

                    if (rs.next()) {

                        return new Supplier(
                                rs.getInt("supplier_id"),
                                rs.getString("supplier_name"),
                                rs.getString("phone_number"),
                                rs.getString("email"),
                                rs.getString("address")
                        );
                    }
                }
            }

        } catch (SQLException e) {
            System.out.println("Search Supplier Error: " + e.getMessage());
        }

        return null;
    }

    // 4. Update Supplier
    public boolean updateSupplier(Supplier supplier) {

        String sql = "UPDATE suppliers SET supplier_name = ?, "
                + "phone_number = ?, email = ?, address = ? "
                + "WHERE supplier_id = ?";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return false;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setString(1, supplier.getSupplierName());
                ps.setString(2, supplier.getPhoneNumber());
                ps.setString(3, supplier.getEmail());
                ps.setString(4, supplier.getAddress());
                ps.setInt(5, supplier.getSupplierId());

                return ps.executeUpdate() > 0;
            }

        } catch (SQLException e) {
            System.out.println("Update Supplier Error: " + e.getMessage());
            return false;
        }
    }

    // 5. Delete Supplier
    public boolean deleteSupplier(int supplierId) {

        String sql = "DELETE FROM suppliers WHERE supplier_id = ?";

        try (Connection con = DBConnection.getConnection()) {

            if (con == null) return false;

            try (PreparedStatement ps = con.prepareStatement(sql)) {

                ps.setInt(1, supplierId);

                return ps.executeUpdate() > 0;
            }

        } catch (SQLException e) {
            System.out.println("Delete Supplier Error: " + e.getMessage());
            return false;
        }
    }
}
