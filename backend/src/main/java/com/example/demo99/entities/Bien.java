package com.example.demo99.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder

public class Bien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // Maison, Appartement, Terrain
    private String adresse;
    private Double prix;
    private String statut; // Disponible, Vendu
    private String description;
    private String img;

    @ManyToOne
    private Agence agence;


    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "dossier_id", referencedColumnName = "id", unique = true)
    private Dossier dossier;

    @ManyToMany(mappedBy = "biensInteresses")
    private List<Client> clients;

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

}
