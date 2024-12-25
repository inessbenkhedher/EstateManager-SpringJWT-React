package com.example.demo99.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Agence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String adresse;
    private String telephone;
    private String img;

    @JsonIgnore
    @OneToMany(mappedBy="agence",cascade=CascadeType.ALL)
    private List<Bien> biens;
}
