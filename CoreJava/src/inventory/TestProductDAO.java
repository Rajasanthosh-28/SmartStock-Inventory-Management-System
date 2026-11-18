package inventory;

import inventory.dao.ProductDAO;
import inventory.model.Product;

import java.util.List;

public class TestProductDAO {

    public static void main(String[] args) {

        ProductDAO productDAO = new ProductDAO();

        List<Product> products = productDAO.getAllProducts();

        System.out.println("\n===== PRODUCTS FROM MYSQL =====");

        if (products.isEmpty()) {
            System.out.println("No products found in the database.");
        } else {
            for (Product product : products) {
                System.out.println(product);
            }
        }

        System.out.println("\nTotal Products: " + products.size());
    }
}