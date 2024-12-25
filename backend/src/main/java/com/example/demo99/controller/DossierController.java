package com.example.demo99.controller;


import com.example.demo99.entities.Bien;
import com.example.demo99.entities.Dossier;
import com.example.demo99.repository.DossierRepository;
import com.example.demo99.service.IServiceDossier;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/dossiers")
@AllArgsConstructor
public class DossierController {

    private  DossierRepository dossierRepository;
    private IServiceDossier dossierService;

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void addDossier(@RequestParam String dossier, @RequestParam(required = false) MultipartFile mf) throws IOException {
        Dossier d=new ObjectMapper().readValue(dossier, Dossier.class);
        dossierService.adddossier(d,mf);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/{id}")
    public Dossier getDossier(@PathVariable Long id) {
        return dossierService.getDossier(id);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping
    public List<Dossier> getDossiers() {
        return dossierService.getDossiers();
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @DeleteMapping("/{id}")
    public void deleteDossier(@PathVariable Long id) {
        dossierService.deleteDossier(id);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PutMapping
    public void updateDossier(@RequestBody Dossier dossier) {
        dossierService.updateDossier(dossier);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/unassigned")
    public List<Dossier> getUnassignedDossiers() {
        // Return all dossiers where bien is null (not linked to any bien)

        return dossierRepository.findByBienIsNull();
    }


    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDossier(@PathVariable Long id) throws IOException {
        Resource resource = dossierService.downloadDossier(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
