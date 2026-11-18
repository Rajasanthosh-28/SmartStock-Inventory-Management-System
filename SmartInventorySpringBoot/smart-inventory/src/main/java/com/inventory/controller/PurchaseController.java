package com.inventory.controller;

import com.inventory.model.Purchase;
import com.inventory.service.PurchaseService;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@CrossOrigin(origins = "*")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    // 1. Add Purchase
    @PostMapping
    public Purchase addPurchase(
            @Valid @RequestBody Purchase purchase) {

        return purchaseService.addPurchase(purchase);
    }

    // 2. Get All Purchases
    @GetMapping
    public List<Purchase> getAllPurchases() {

        return purchaseService.getAllPurchases();
    }

    // 3. Get Purchase By ID
    @GetMapping("/{id}")
    public Purchase getPurchaseById(
            @PathVariable Integer id) {

        return purchaseService.getPurchaseById(id);
    }

    // 4. Update Purchase
    @PutMapping("/{id}")
    public Purchase updatePurchase(
            @PathVariable Integer id,
            @Valid @RequestBody Purchase purchase) {

        return purchaseService.updatePurchase(id, purchase);
    }

    // 5. Delete Purchase
    @DeleteMapping("/{id}")
    public String deletePurchase(
            @PathVariable Integer id) {

        purchaseService.deletePurchase(id);

        return "Purchase deleted successfully!";
    }
}
