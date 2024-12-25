package com.example.demo99.repository;

import com.example.demo99.entities.Agence;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AgenceRepository extends JpaRepository<Agence, Long> {

    @Query("select a from Agence a where lower(a.nom) like lower(concat('%', :x, '%'))")
    public List<Agence> rechercheparmc(@Param("x") String mc);
}
