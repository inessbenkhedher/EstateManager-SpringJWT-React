package com.example.demo99.service;


import com.example.demo99.entities.Bien;
import com.example.demo99.entities.Client;
import com.example.demo99.entities.Role;
import com.example.demo99.repository.BienRepository;
import com.example.demo99.repository.ClientRepository;
import com.example.demo99.repository.RoleRepository;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.Collections;
import java.util.List;

@Service
@AllArgsConstructor
public class ServiceClient implements IServiceClient, UserDetailsService {

    private ClientRepository cr;

    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private ServiceBien bienService;

     BienRepository bienRepository;



    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Fetch client by email
        Client client = cr.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Client not found with email: " + email));

        // Map Client to UserDetails
        return User.builder()
                .username(client.getEmail())
                .password(client.getPassword())
                .roles(client.getRoles().stream().map(Role::getName).toArray(String[]::new))
                .build();
    }

    @Override
    public void addclient(Client client) {
        if (client.getPassword() == null || client.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty");
        }

        Role userRole = roleRepository.findById("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Default USER role not found"));

        client.setRoles(Collections.singleton(userRole));

        // Encode the password
        client.setPassword(passwordEncoder.encode(client.getPassword()));

        cr.save(client);
    }

    @Transactional
    public void markAsInterested(Long clientId, Long bienId) {


        cr.addInterestedRelation(clientId, bienId);
    }


    @Transactional(readOnly = true)
    public List<Bien> getBiensInterestedByClient(Long clientId) {
        List<Long> bienIds = cr.findBienIdsByClientId(clientId);

        // Fetch each Bien using the existing getBien() method

        return bienIds.stream()
                .map(bienService::getBien) // Calls the existing service method
                .toList();
    }


    @Override
    public Client getclient(Long id) {
        return cr.findById(id).get();
    }

    @Override
    public List<Client> getAllclient() {
        return cr.findAll();
    }

    @Override
    public void deleteclient(Long id) {
        Client client = cr.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + id));

        // Clear roles association to avoid foreign key constraint violation
        client.getRoles().clear();
        cr.save(client);

        cr.delete(client);
        System.out.println("Client with ID " + id + " deleted successfully");
    }

    @Override
    public void updateclient(Client client) {
        cr.save(client);
    }


    public Client findClientByEmail(String email) {
        return cr.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Client not found with email: " + email));
    }



}
