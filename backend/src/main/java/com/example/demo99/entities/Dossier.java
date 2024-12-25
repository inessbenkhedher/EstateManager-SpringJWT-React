package com.example.demo99.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Dossier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String details; // Description détaillée du bien
    private String fichierPdf; // Chemin ou URL du fichier PDF



    @OneToOne(mappedBy = "dossier", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Bien bien;
}
