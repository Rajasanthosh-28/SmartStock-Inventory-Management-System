package com.inventory.controller;

import com.inventory.dto.AdminLoginRequest;
import com.inventory.dto.AdminLoginResponse;
import com.inventory.model.AdminUser;
import com.inventory.service.AdminUserService;
import com.inventory.service.JwtService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:4173"
})
public class AuthController {

    private final AdminUserService adminUserService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            AdminUserService adminUserService,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.adminUserService = adminUserService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // ADMIN LOGIN
    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(
            @Valid @RequestBody AdminLoginRequest request) {

        AdminUser user = adminUserService.findByEmail(
                request.getEmail()
        );

        if (user == null
                || !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid email or password"
                    ));
        }

        if (!"ADMIN".equals(user.getRole())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "You are not authorized to access the Admin Panel"
                    ));
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        AdminLoginResponse response = new AdminLoginResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }
}