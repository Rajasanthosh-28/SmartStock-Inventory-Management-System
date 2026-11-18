package com.inventory.controller;

import com.inventory.model.Sale;
import com.inventory.service.SalesService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SalesController {

    private final SalesService salesService;

    public SalesController(SalesService salesService) {
        this.salesService = salesService;
    }

    // 1. Add Sale
    @PostMapping
    public Sale addSale(@Valid @RequestBody Sale sale) {
        return salesService.addSale(sale);
    }

    // 2. Get All Sales
    @GetMapping
    public List<Sale> getAllSales() {
        return salesService.getAllSales();
    }

    // 3. Get Sale By ID
    @GetMapping("/{id}")
    public Sale getSaleById(@PathVariable Integer id) {
        return salesService.getSaleById(id);
    }

    // 4. Update Sale
    @PutMapping("/{id}")
    public Sale updateSale(
        @PathVariable Integer id,
        @Valid @RequestBody Sale sale) {

       return salesService.updateSale(id, sale);
    }
    // 5. Delete Sale
    @DeleteMapping("/{id}")
    public String deleteSale(@PathVariable Integer id) {
        salesService.deleteSale(id);
        return "Sale deleted successfully!";
    }
}