package com.example.demo99.service;

import com.example.demo99.entities.Bien;
import com.example.demo99.entities.Client;

import java.util.List;
import java.util.Optional;

public interface IServiceClient {

    public void addclient(Client client);
    public Client getclient(Long id);
    public List<Client> getAllclient();
    public void deleteclient(Long id);
    public void updateclient(Client client);
    public void markAsInterested(Long clientId, Long bienId);
    public List<Bien> getBiensInterestedByClient(Long clientId);

}
