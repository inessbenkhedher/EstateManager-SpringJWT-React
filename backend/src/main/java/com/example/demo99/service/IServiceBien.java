package com.example.demo99.service;

import com.example.demo99.entities.Bien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IServiceBien {

    public void addBien (Bien bien , MultipartFile mf)throws IOException;
    public Bien getBien (Long id);
    public List<Bien> getBienbymc (String mc);
    public List<Bien> getAllBien();
    public void deleteBien (Long id);
    public void updateBien (Long id, Bien incomingBien, MultipartFile mf) throws IOException;
    public byte[] getImage(Long id) throws IOException;

}
