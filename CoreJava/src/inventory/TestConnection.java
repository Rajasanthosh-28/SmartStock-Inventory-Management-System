package inventory;
import java.sql.Connection;
import java.sql.SQLException;

public class TestConnection {

    public static void main(String[] args) {

        try (Connection connection = DBConnection.getConnection()) {

            if (connection != null && !connection.isClosed()) {
                System.out.println("Java connected to MySQL successfully!");
                System.out.println("Database: smart_inventory");
            }

        } catch (SQLException e) {
            System.out.println("Connection test failed!");
            e.printStackTrace();
        }
    }
}