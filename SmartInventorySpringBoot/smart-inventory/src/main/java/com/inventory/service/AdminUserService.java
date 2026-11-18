package com.inventory.service;

import com.inventory.model.AdminUser;
import com.inventory.repository.AdminUserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserService(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder) {

        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Create Admin or Staff Account
    @Transactional
    public AdminUser createUser(
            String fullName,
            String email,
            String password,
            String role) {

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        String normalizedRole = role.trim().toUpperCase(Locale.ROOT);

        if (adminUserRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists."
            );
        }

        if (!normalizedRole.equals("ADMIN")
                && !normalizedRole.equals("STAFF")) {

            throw new IllegalArgumentException(
                    "Invalid role. Only ADMIN and STAFF are allowed."
            );
        }

        AdminUser user = new AdminUser();

        user.setFullName(fullName.trim());
        user.setEmail(normalizedEmail);

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(password));

        user.setRole(normalizedRole);

        return adminUserRepository.save(user);
    }

    // Find User by Email
    public AdminUser findByEmail(String email) {

        return adminUserRepository
                .findByEmail(email.trim().toLowerCase(Locale.ROOT))
                .orElse(null);
    }

    // Get All Users
    public java.util.List<AdminUser> getAllUsers() {

        return adminUserRepository.findAll();
    }

    // Delete User
    @Transactional
    public void deleteUser(Long id) {

        AdminUser user = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found with ID: " + id
                ));

        adminUserRepository.delete(user);
    }
}