package inventory.service;

import inventory.model.Product;

public class StockPredictionService {

    private InventoryService inventoryService;
    private SalesService salesService;

    public StockPredictionService(
            InventoryService inventoryService,
            SalesService salesService) {

        this.inventoryService = inventoryService;
        this.salesService = salesService;
    }

    
    public void predictStock(int productId) {

        Product product = inventoryService.getProductById(productId);

        if (product == null) {
            System.out.println("Product not found!");
            return;
        }

        int totalSold = salesService.getLast30DaysSales(productId);

        
        double averageDailySales = totalSold / 30.0;

        
        double predictedDemand = averageDailySales * 30;

        
        double requiredStock = predictedDemand - product.getQuantity();

        System.out.println("\n========== STOCK PREDICTION ==========");

        System.out.println("Product Name       : " + product.getProductName());
        System.out.println("Current Stock      : " + product.getQuantity());
        System.out.println("Last 30 Days Sales : " + totalSold);

        System.out.printf("Average Daily Sales: %.2f%n", averageDailySales);

        System.out.printf("Predicted Demand   : %.0f%n", predictedDemand);

        if (requiredStock > 0) {

            System.out.printf("Additional Stock Required: %.0f%n", requiredStock);

            System.out.println("Recommendation: Purchase more stock.");

        } else {

            System.out.println("Recommendation: Current stock is sufficient.");
        }

        System.out.println("======================================");
    }
}
