package com.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sale_id")
    private Integer saleId;

    @NotNull(message = "Product ID is required")
    @Column(name = "product_id", nullable = false)
    private Integer productId;

    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @NotNull(message = "Sale quantity is required")
    @Min(value = 1, message = "Sale quantity must be at least 1")
    @Column(name = "quantity_sold", nullable = false)
    private Integer quantitySold;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01",
            message = "Total amount must be greater than zero")
    @Column(name = "total_amount", nullable = false,
            precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @NotNull(message = "Sale date is required")
    @Column(name = "sale_date", nullable = false)
    private LocalDate saleDate;

    public Sale() {
    }
     public Integer getSaleId() {
    return saleId;
}

public void setSaleId(Integer saleId) {
    this.saleId = saleId;
}

public Integer getProductId() {
    return productId;
}

public void setProductId(Integer productId) {
    this.productId = productId;
}

public String getProductName() {
    return productName;
}

public void setProductName(String productName) {
    this.productName = productName;
}

public Integer getQuantitySold() {
    return quantitySold;
}

public void setQuantitySold(Integer quantitySold) {
    this.quantitySold = quantitySold;
}

public BigDecimal getTotalAmount() {
    return totalAmount;
}

public void setTotalAmount(BigDecimal totalAmount) {
    this.totalAmount = totalAmount;
}

public LocalDate getSaleDate() {
    return saleDate;
}

public void setSaleDate(LocalDate saleDate) {
    this.saleDate = saleDate;
}
    // Generate getters and setters for all fields using VS Code.
}