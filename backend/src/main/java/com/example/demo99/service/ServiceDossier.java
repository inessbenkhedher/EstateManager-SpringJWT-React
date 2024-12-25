package com.example.demo99.service;


import com.example.demo99.entities.Dossier;
import com.example.demo99.repository.DossierRepository;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@AllArgsConstructor
public class ServiceDossier implements IServiceDossier {

    private DossierRepository dr;
    @Override
    public void adddossier(Dossier dossier, MultipartFile mf)throws IOException {
        if (mf != null && !mf.isEmpty()) {
            dossier.setFichierPdf(uploadpdf(mf));
        }
        dr.save(dossier);
    }

    @Override
    public List<Dossier> getDossiers() {
        return dr.findAll();
    }

    @Override
    public Dossier getDossier(Long id) {
        return dr.findById(id).get();
    }

    @Override
    public void updateDossier(Dossier dossier) {
        dr.save(dossier);
    }

    @Override
    public void deleteDossier(Long id) {
        dr.deleteById(id);
    }

    @Override
    public byte[] getpdf(Long id) throws IOException {
        return Files.readAllBytes(Paths.get(System.getProperty("user.home")+"/pdfdossier",getDossier(id).getFichierPdf()));
    }


    private String uploadpdf (MultipartFile mf) throws IOException {
        String newName = mf.getOriginalFilename();
        Path p= Paths.get(System.getProperty("user.home")+"/pdfdossier",newName);
        Files.write(p ,mf.getBytes());


        return newName;
    }

    @Override
    public Resource downloadDossier(Long id) throws IOException {
        Dossier dossier = dr.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Dossier not found"));

        String fileName = dossier.getFichierPdf();
        Path filePath = Paths.get(System.getProperty("user.home") + "/pdfdossier", fileName);

        System.out.println("Attempting to fetch file: " + filePath);

        if (!Files.exists(filePath)) {
            System.err.println("File not found: " + filePath);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found: " + fileName);
        }

        return new UrlResource(filePath.toUri());
    }




}
