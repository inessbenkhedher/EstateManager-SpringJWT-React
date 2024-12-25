package com.example.demo99.repository;

import com.example.demo99.entities.Dossier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DossierRepository extends JpaRepository<Dossier, Long> {
    List<Dossier> findByBienIsNull();
}
