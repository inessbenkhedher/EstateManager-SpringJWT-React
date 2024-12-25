package com.example.demo99.service;

import com.example.demo99.entities.Dossier;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IServiceDossier {
    public void adddossier(Dossier dossier, MultipartFile mf)throws IOException;;
    public List<Dossier> getDossiers();
    public Dossier getDossier(Long id);
    public void updateDossier(Dossier dossier);
    public void deleteDossier(Long id);
    public byte[] getpdf(Long id) throws IOException;
    public Resource downloadDossier(Long id) throws IOException;

}
