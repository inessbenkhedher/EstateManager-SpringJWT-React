package com.example.demo99.service;

import com.example.demo99.entities.Agence;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IServiceAgence {

    public void addAgence(Agence agence, MultipartFile mf)throws IOException;
    public List<Agence> getAgences();
    public Agence getAgence(Long id);
    public void deleteAgence(Long id);
    public void updateAgence(Long id, Agence incomingAgence, MultipartFile mf)throws IOException;
    public List<Agence> getAgencebymc(String mc);
    public byte[] getImage(Long id) throws IOException;
}
