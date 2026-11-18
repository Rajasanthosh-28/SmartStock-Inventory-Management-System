package com.inventory.model;

import java.math.BigDecimal;

public class SalesPurchaseChartDTO {

    private String label;
    private BigDecimal sales;
    private BigDecimal purchases;

    public SalesPurchaseChartDTO() {
    }

    public SalesPurchaseChartDTO(
            String label,
            BigDecimal sales,
            BigDecimal purchases) {

        this.label = label;
        this.sales = sales;
        this.purchases = purchases;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public BigDecimal getSales() {
        return sales;
    }

    public void setSales(BigDecimal sales) {
        this.sales = sales;
    }

    public BigDecimal getPurchases() {
        return purchases;
    }

    public void setPurchases(BigDecimal purchases) {
        this.purchases = purchases;
    }
}