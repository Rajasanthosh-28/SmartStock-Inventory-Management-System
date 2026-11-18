package com.inventory.controller;

import com.inventory.model.Product;
import com.inventory.service.ProductService;

import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    // Constructor Injection
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 1. Add Product
    @PostMapping
    public Product addProduct(@Valid @RequestBody Product product) {
       return productService.addProduct(product);
 }

    // 2. View All Products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // 3. Search Product by ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Integer id) {
        return productService.getProductById(id);
    }

    // 4. Update Product
    @PutMapping("/{id}")
    public Product updateProduct(
        @PathVariable Integer id,
        @Valid @RequestBody Product product) {

       return productService.updateProduct(id, product);
   }
    // 5. Delete Product
    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Integer id) {

        productService.deleteProduct(id);

        return "Product deleted successfully!";
    }
}