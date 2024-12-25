package com.example.demo99.service;

import com.example.demo99.entities.Agence;
import com.example.demo99.repository.AgenceRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
@AllArgsConstructor
@Service

public class ServiceAgence implements IServiceAgence {

    private AgenceRepository ar;



    @Override
    public void addAgence(Agence agence, MultipartFile mf) throws IOException {
        if (mf != null && !mf.isEmpty()) {
            agence.setImg(uploadimage(mf));
        }
        ar.save(agence);
    }


    @Override
    public List<Agence> getAgences() {
        return ar.findAll();
    }

    @Override
    public Agence getAgence(Long id) {
        return ar.findById(id).get();
    }

    @Override
    public void deleteAgence(Long id) {
        ar.deleteById(id);
    }

    @Override
    public void updateAgence(Long id, Agence incomingAgence, MultipartFile mf) throws IOException {
        // Fetch the existing Agence
        Agence existingAgence = ar.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Agence not found with ID " + id)
        );

        // Update fields only if they are provided
        if (incomingAgence.getNom() != null && !incomingAgence.getNom().isEmpty()) {
            existingAgence.setNom(incomingAgence.getNom());
        }
        if (incomingAgence.getTelephone() != null && !incomingAgence.getTelephone().isEmpty()) {
            existingAgence.setTelephone(incomingAgence.getTelephone());
        }
        if (mf != null && !mf.isEmpty()) {
            // If a new image is provided, update it
            existingAgence.setImg(uploadimage(mf));
        }

        // Save the updated Agence
        ar.save(existingAgence);
    }


    @Override
    public List<Agence> getAgencebymc(String mc ) {
        return  ar.rechercheparmc(mc);
    }

    @Override
    public byte[] getImage(Long id) throws IOException {
        return Files.readAllBytes(Paths.get(System.getProperty("user.home")+"/photosagence",getAgence(id).getImg()));
    }

    private String giveMeNewName(String oldName){
        String firstpart = oldName.substring(0, oldName.lastIndexOf("."));
        String secondpart = oldName.substring( oldName.lastIndexOf(".")+1);
        return firstpart + System.currentTimeMillis()+"."+secondpart;
    }

    private String uploadimage (MultipartFile mf) throws IOException {
        String oldName=mf.getOriginalFilename();
        String newName = giveMeNewName(oldName);
        Path p= Paths.get(System.getProperty("user.home")+"/photosagence",newName);
        Files.write(p ,mf.getBytes());


        return newName;
    }

}
