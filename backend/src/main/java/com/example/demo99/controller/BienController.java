package com.example.demo99.controller;


import com.example.demo99.entities.Bien;
import com.example.demo99.repository.BienRepository;
import com.example.demo99.service.IServiceBien;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@AllArgsConstructor
public class BienController {

    private IServiceBien bienService;
    private BienRepository br;
    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PostMapping(value = "/savebien",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void addBien(@RequestParam String bien, @RequestParam(required = false) MultipartFile mf) throws IOException {
        Bien b=new ObjectMapper().readValue(bien, Bien.class);
        bienService.addBien(b, mf);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("biens/{id}")
    public Bien getBien(@PathVariable Long id) {
        return bienService.getBien(id);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/biens")
    public List<Bien> getAllBiens() {
        return bienService.getAllBien();
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @DeleteMapping("/bien/{id}")
    public void deleteBien(@PathVariable Long id) {
        bienService.deleteBien(id);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @PutMapping("/uppbien/{id}")
    public void updateBien(@PathVariable Long id,
                           @RequestParam String bien,
                           @RequestParam(required = false) MultipartFile mf) throws IOException {
        Bien incomingBien = new ObjectMapper().readValue(bien, Bien.class);
        bienService.updateBien(id, incomingBien, mf);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/search")
    public List<Bien> getBienByMc(@RequestParam String mc) {
        return br.rechercheparmc(mc);
    }

    @CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
    @GetMapping("/getimagebien/{id}")
    public byte[] getImage(@PathVariable Long id) throws IOException {
        return bienService.getImage(id);
    }


}
