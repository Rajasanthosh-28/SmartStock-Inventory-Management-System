package inventory.service;

public class ReportService {

    private SalesService salesService;
    private PurchaseService purchaseService;

    
    public ReportService(SalesService salesService,
                         PurchaseService purchaseService) {

        this.salesService = salesService;
        this.purchaseService = purchaseService;
    }

   
    public void generateMonthlyReport(int year, int month) {

        double totalSales =
                salesService.getMonthlySalesTotal(year, month);

        double totalPurchases =
                purchaseService.getMonthlyPurchaseTotal(year, month);

        int salesCount =
                salesService.getMonthlySalesCount(year, month);

        int purchaseCount =
                purchaseService.getMonthlyPurchaseCount(year, month);

        System.out.println("\n========== MONTHLY INVENTORY REPORT ==========");

        System.out.println("Report Month       : " + month + "/" + year);

        System.out.println("-----------------------------------------------");

        System.out.println("Total Sales        : Rs. " + totalSales);

        System.out.println("Total Purchases    : Rs. " + totalPurchases);

        System.out.println("Sales Transactions : " + salesCount);

        System.out.println("Purchase Records   : " + purchaseCount);

        System.out.println("-----------------------------------------------");

        System.out.println("Sales - Purchases  : Rs. "
                + (totalSales - totalPurchases));

        System.out.println("===============================================");
    }
}