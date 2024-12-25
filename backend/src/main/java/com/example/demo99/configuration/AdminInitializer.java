package com.example.demo99.configuration;


import com.example.demo99.entities.Client;
import com.example.demo99.entities.Role;
import com.example.demo99.repository.ClientRepository;
import com.example.demo99.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {
    private final ClientRepository clientRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create "ADMIN" role if it doesn't exist
        Role adminRole = roleRepository.findById("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_ADMIN")));

        // Check if the admin user exists
        if (clientRepository.findByEmail("admin@example.com").isEmpty()) {
            Client admin = new Client();
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Encode password
            admin.setNom("Admin");
            admin.setRoles(Collections.singleton(adminRole));

            clientRepository.save(admin);
        }
    }
}