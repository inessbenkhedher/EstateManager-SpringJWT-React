package com.example.demo99.controller;


import com.example.demo99.entities.Agence;
import com.example.demo99.entities.Bien;
import com.example.demo99.repository.BienRepository;
import com.example.demo99.service.IServiceAgence;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@AllArgsConstructor
@RestController
@CrossOrigin(origins ="http://localhost:3000")
public class AgenceController {

    private IServiceAgence agenceService;
private BienRepository bienRepository;

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.POST})
    @PostMapping("/saveagence")
    public void addAgence(@RequestParam String agence, @RequestParam(required = false) MultipartFile mf) throws IOException {
        Agence a=new ObjectMapper().readValue(agence, Agence.class);
        agenceService.addAgence(a,mf);
    }
    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/agences")
    public List<Agence> getAllAgences() {
        return agenceService.getAgences();
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/agence/{id}")
    public Agence getAgence(@PathVariable Long id) {
        return agenceService.getAgence(id);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @DeleteMapping("/agencedel/{id}")
    public void deleteAgence(@PathVariable Long id) {
        agenceService.deleteAgence(id);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PutMapping(value = "/agenceup/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void updateAgence(
            @PathVariable Long id,
            @RequestParam String agence,
            @RequestParam(required = false) MultipartFile mf) throws IOException {

        // Deserialize the incoming agency JSON
        Agence incomingAgence = new ObjectMapper().readValue(agence, Agence.class);

        // Delegate the partial update to the service
        agenceService.updateAgence(id, incomingAgence, mf);
    }
    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/agencess")
    public List<Agence> getAgencesByMc(@RequestParam String mc) {
        return agenceService.getAgencebymc(mc);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping(value = "/getimage/{id}",produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[]  getimage(@PathVariable Long id) throws IOException {
        return agenceService.getImage(id);
    }


    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/agences/{id}/biens")
    public List<Bien> getBiensByAgence(@PathVariable Long id) {
        // Return the list of biens linked to a specific agence

        return bienRepository.findByAgenceId(id);
    }


}
