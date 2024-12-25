package com.example.demo99.service;

import com.example.demo99.entities.Client;
import com.example.demo99.entities.Role;
import com.example.demo99.repository.ClientRepository;
import com.example.demo99.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class TestClientService {

    private ClientRepository clientRepository;
    private RoleRepository roleRepository;

    public void testCreateClient() {
        Role userRole = roleRepository.findById("ROLE_USER")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_USER")));

        Client client = new Client();
        client.setNom("John Doe");
        client.setEmail("john.doe@example.com");
        client.setPassword(new BCryptPasswordEncoder().encode("password123"));
        client.setTelephone("123456789");
        client.setRoles(Set.of(userRole));

        clientRepository.save(client);

        System.out.println("Client saved successfully!");
    }
}