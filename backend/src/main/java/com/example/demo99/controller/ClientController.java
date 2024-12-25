package com.example.demo99.controller;


import com.example.demo99.entities.Bien;
import com.example.demo99.entities.Client;
import com.example.demo99.service.IServiceClient;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clients")
@AllArgsConstructor
public class ClientController {

    private IServiceClient clientService;


    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping("/{id}/interested/{bienId}")
    public void markAsInterested(@PathVariable Long id, @PathVariable Long bienId) {
        System.out.println("Client ID: " + id + ", Bien ID: " + bienId);
            clientService.markAsInterested(id, bienId);

    }


    @PostMapping
    public ResponseEntity<String> createClient(@RequestBody Client client) {
            clientService.addclient(client);
            return ResponseEntity.ok("Client created successfully!");

    }

    @GetMapping("/{id}")
    public Client getClient(@PathVariable Long id) {
        return clientService.getclient(id);
    }

    @GetMapping
    public List<Client> getAllClients() {
        return clientService.getAllclient();
    }

    @DeleteMapping("/{id}")
    public void deleteClient(@PathVariable Long id) {
        clientService.deleteclient(id);
    }

    @PutMapping
    public void updateClient(@RequestBody Client client) {
        clientService.updateclient(client);
    }


    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/{clientId}/interested-biens")
    public List<Bien> getInterestedBiens(@PathVariable Long clientId) {
        return clientService.getBiensInterestedByClient(clientId);
    }


}
