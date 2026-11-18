package com.inventory.config;

import com.inventory.model.AdminUser;
import com.inventory.repository.AdminUserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminDataInitializer {

    @Value("${app.admin.name:}")
    private String adminName;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Value("${app.admin.password:}")
    private String adminPassword;

    @Bean
    public CommandLineRunner createInitialAdmin(
            AdminUserRepository repository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (adminName.isBlank()
                    || adminEmail.isBlank()
                    || adminPassword.isBlank()) {

                System.out.println(
                    "Admin initialization skipped: credentials not configured."
                );
                return;
            }

            if (repository.existsByEmail(adminEmail)) {
                System.out.println("Initial admin already exists.");
                return;
            }

            AdminUser admin = new AdminUser();

            admin.setFullName(adminName);
            admin.setEmail(adminEmail.trim().toLowerCase());
            admin.setPassword(
                passwordEncoder.encode(adminPassword)
            );
            admin.setRole("ADMIN");

            repository.save(admin);

            System.out.println("Initial admin account created successfully.");
        };
    }
}