package com.example.demo99.service;

import com.example.demo99.entities.Bien;
import com.example.demo99.entities.Dossier;
import com.example.demo99.repository.BienRepository;
import com.example.demo99.repository.DossierRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@AllArgsConstructor
public class ServiceBien implements IServiceBien{

    private BienRepository br;
    private DossierRepository dossierRepository;


    @Override
    public void addBien(Bien bien, MultipartFile mf) throws IOException {
        // If the Dossier is associated with the Bien, ensure it exists in the database
        if (bien.getDossier() != null && bien.getDossier().getId() != null) {
            Dossier existingDossier = dossierRepository.findById(bien.getDossier().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Dossier not found with ID: " + bien.getDossier().getId()));

            // Check if the Dossier is already associated with another Bien
            if (existingDossier.getBien() != null) {
                throw new IllegalStateException("This Dossier is already associated with another Bien.");
            }

            // Set the existing Dossier to the Bien
            bien.setDossier(existingDossier);
        }

        // Handle file upload if provided
        if (mf != null && !mf.isEmpty()) {
            bien.setImg(uploadimage(mf));
        }

        // Save the Bien
        br.save(bien);
    }

    @Override
    public Bien getBien(Long id) {
        return br.findById(id).get();
    }

    @Override
    public List<Bien> getBienbymc(String mc) {
        return br.rechercheparmc(mc);
    }

    @Override
    public List<Bien> getAllBien() {

        return br.findAll();
    }

    @Override
    public void deleteBien(Long id) {
        br.deleteById(id);
    }

    @Override
    public void updateBien(Long id, Bien incomingBien, MultipartFile mf) throws IOException {
        // Fetch the existing Bien from the database
        Bien existingBien = br.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Bien not found with ID " + id)
        );

        // Update fields only if they are provided
        if (incomingBien.getType() != null && !incomingBien.getType().isEmpty()) {
            existingBien.setType(incomingBien.getType());
        }
        if (incomingBien.getAdresse() != null && !incomingBien.getAdresse().isEmpty()) {
            existingBien.setAdresse(incomingBien.getAdresse());
        }
        if (incomingBien.getPrix() != null) {
            existingBien.setPrix(incomingBien.getPrix());
        }
        if (incomingBien.getStatut() != null && !incomingBien.getStatut().isEmpty()) {
            existingBien.setStatut(incomingBien.getStatut());
        }
        if (incomingBien.getDescription() != null && !incomingBien.getDescription().isEmpty()) {
            existingBien.setDescription(incomingBien.getDescription());
        }
        if (mf != null && !mf.isEmpty()) {
            // If a new image is provided, update it
            existingBien.setImg(uploadimage(mf));
        }

        // Save the updated Bien
        br.save(existingBien);
    }

    @Override
    public byte[] getImage(Long id) throws IOException {
        return Files.readAllBytes(Paths.get(System.getProperty("user.home")+"/photos",getBien(id).getImg()));
    }

    private String giveMeNewName(String oldName){
        String firstpart = oldName.substring(0, oldName.lastIndexOf("."));
        String secondpart = oldName.substring( oldName.lastIndexOf(".")+1);
        return firstpart + System.currentTimeMillis()+"."+secondpart;
    }

    private String uploadimage (MultipartFile mf) throws IOException {
        String oldName=mf.getOriginalFilename();
        String newName = giveMeNewName(oldName);
        Path p= Paths.get(System.getProperty("user.home")+"/photos",newName);
        Files.write(p ,mf.getBytes());


        return newName;
    }

}
