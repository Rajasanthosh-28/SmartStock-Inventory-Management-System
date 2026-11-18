package inventory;

import inventory.model.Product;
import inventory.model.Supplier;
import inventory.service.SupplierService;
import inventory.service.InventoryService;
import inventory.service.SalesService;
import inventory.service.PurchaseService;
import inventory.service.ReportService;
import inventory.service.StockPredictionService;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        // Create service objects
        InventoryService inventoryService = new InventoryService();

        SalesService salesService = new SalesService(inventoryService);

        PurchaseService purchaseService = new PurchaseService(inventoryService);

        SupplierService supplierService = new SupplierService();

        ReportService reportService = new ReportService(salesService,purchaseService);

        StockPredictionService predictionService =new StockPredictionService(inventoryService, salesService);

        int choice = 0;

        do {

            System.out.println("\n==================================");
            System.out.println("   SMART INVENTORY MANAGEMENT");
            System.out.println("==================================");

            System.out.println("1. Add Product");
            System.out.println("2. View All Products");
            System.out.println("3. Search Product");
            System.out.println("4. Update Stock");
            System.out.println("5. Delete Product");
            System.out.println("6. Low Stock Alerts");
            System.out.println("7. Expiry Alerts");
            System.out.println("8. Sell Product");
            System.out.println("9. View Sales History");
            System.out.println("10. Reserved");
            System.out.println("11. Record Purchase");
            System.out.println("12. View Purchase History");
            System.out.println("13. Add Supplier");
            System.out.println("14. View All Suppliers");
            System.out.println("15. Search Supplier");
            System.out.println("16. Update Supplier");
            System.out.println("17. Delete Supplier");
            System.out.println("18. Generate Monthly Report");
            System.out.println("19. Stock Prediction");
            System.out.println("20. Exit");

            System.out.println("==================================");
            System.out.print("Enter your choice: ");

            try {

                choice = Integer.parseInt(sc.nextLine());

                switch (choice) {

                    // Add Product
                    case 1:

                        System.out.print("Enter Product ID: ");
                        int id = Integer.parseInt(sc.nextLine());

                        System.out.print("Enter Product Name: ");
                        String name = sc.nextLine();

                        System.out.print("Enter Category: ");
                        String category = sc.nextLine();

                        System.out.print("Enter Price: ");
                        double price = Double.parseDouble(sc.nextLine());

                        System.out.print("Enter Quantity: ");
                        int quantity = Integer.parseInt(sc.nextLine());

                        System.out.print("Enter Minimum Stock: ");
                        int minimumStock = Integer.parseInt(sc.nextLine());

                        System.out.print("Enter Expiry Date (YYYY-MM-DD): ");
                        LocalDate expiryDate = LocalDate.parse(sc.nextLine());

                        Product product = new Product(
                                id,
                                name,
                                category,
                                price,
                                quantity,
                                minimumStock,
                                expiryDate
                        );

                        inventoryService.addProduct(product);

                        break;

                    // View Products
                    case 2:

                        inventoryService.viewProducts();

                        break;

                    // Search Product
                    case 3:

                        System.out.print("Enter Product ID: ");
                        int searchId = Integer.parseInt(sc.nextLine());

                        inventoryService.searchProduct(searchId);

                        break;

                    // Update Stock
                    case 4:

                        System.out.print("Enter Product ID: ");
                        int updateId = Integer.parseInt(sc.nextLine());

                        System.out.print("Enter New Quantity: ");
                        int newQuantity = Integer.parseInt(sc.nextLine());

                        inventoryService.updateStock(updateId, newQuantity);

                        break;

                    // Delete Product
                    case 5:

                        System.out.print("Enter Product ID: ");
                        int deleteId = Integer.parseInt(sc.nextLine());

                        inventoryService.deleteProduct(deleteId);

                        break;

                    // Low Stock Alerts
                    case 6:

                        inventoryService.lowStockAlerts();

                        break;

                    // Expiry Alerts
                    case 7:

                        inventoryService.expiryAlerts();

                        break;

                    // Sell Product
                    case 8:

                        System.out.print("Enter Product ID to sell: ");
                        int saleProductId = Integer.parseInt(sc.nextLine());

                        System.out.print("Enter Quantity to sell: ");
                        int saleQuantity = Integer.parseInt(sc.nextLine());

                        salesService.sellProduct(
                                saleProductId,
                                saleQuantity
                        );

                        break;

                    // Sales History
                    case 9:

                        salesService.viewSales();

                        break;

                    case 10:
                        System.out.println("This option is currently reserved.");
                        break;
                    
                    case 11:
                        System.out.print("Enter Product ID: ");
                        int purchaseProductId = Integer.parseInt(sc.nextLine());

                        System.out.print("Enter Purchase Quantity: ");
                        int purchaseQuantity = Integer.parseInt(sc.nextLine());

                        System.out.print("Enter Purchase Unit Price: ");
                        double purchasePrice = Double.parseDouble(sc.nextLine());

                        purchaseService.recordPurchase(
                           purchaseProductId,
                           purchaseQuantity,
                           purchasePrice
                          );
                        break;

                    case 12:
                         purchaseService.viewPurchases();
                         break;

                    case 13:
                         System.out.print("Enter Supplier ID: ");
                         int supplierId = Integer.parseInt(sc.nextLine());

                         System.out.print("Enter Supplier Name: ");
                         String supplierName = sc.nextLine();

                         System.out.print("Enter Phone Number: ");
                         String phoneNumber = sc.nextLine();

                         System.out.print("Enter Email: ");
                         String email = sc.nextLine();

                         System.out.print("Enter Address: ");
                         String address = sc.nextLine();

                         Supplier supplier = new Supplier(
                            supplierId, supplierName, phoneNumber, email, address
                          );

                         supplierService.addSupplier(supplier);
                         break;

                    case 14:
                         supplierService.viewSuppliers();
                         break;

                    case 15:
                         System.out.print("Enter Supplier ID: ");
                         int searchSupplierId = Integer.parseInt(sc.nextLine());

                         supplierService.searchSupplier(searchSupplierId);
                         break;

                    case 16:
                         System.out.print("Enter Supplier ID: ");
                         int updateSupplierId = Integer.parseInt(sc.nextLine());

                         System.out.print("Enter New Supplier Name: ");
                         String newName = sc.nextLine();

                         System.out.print("Enter New Phone Number: ");
                         String newPhone = sc.nextLine();

                         System.out.print("Enter New Email: ");
                         String newEmail = sc.nextLine();

                         System.out.print("Enter New Address: ");
                         String newAddress = sc.nextLine();

                         supplierService.updateSupplier(
                         updateSupplierId, newName, newPhone, newEmail, newAddress
                         );
                         break;

                    case 17:
                         System.out.print("Enter Supplier ID to Delete: ");
                         int deleteSupplierId = Integer.parseInt(sc.nextLine());

                         supplierService.deleteSupplier(deleteSupplierId);
                         break;

                    case 18:
                         System.out.print("Enter Year: ");
                         int year = Integer.parseInt(sc.nextLine());

                         System.out.print("Enter Month (1-12): ");
                         int month = Integer.parseInt(sc.nextLine());

                        if (month < 1 || month > 12) {
                           System.out.println("Invalid month!");
                           break;
                          }

                        reportService.generateMonthlyReport(year, month);
                        break;

                    case 19:
                        System.out.print("Enter Product ID: ");
                        int predictionProductId = Integer.parseInt(sc.nextLine());

                        predictionService.predictStock(predictionProductId);
                        break;

                    case 20:
                        System.out.println("Thank you for using Smart Inventory System!");
                        sc.close();
                        return;

                    default:

                        System.out.println("Invalid choice! Please try again.");

                }

            } catch (NumberFormatException e) {

                System.out.println("Invalid input! Please enter a valid number.");

            } catch (DateTimeParseException e) {

                System.out.println("Invalid date! Use YYYY-MM-DD format.");

            }

        } while (choice != 20);

        sc.close();
    }
}