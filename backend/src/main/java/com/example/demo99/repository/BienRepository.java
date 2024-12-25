package com.example.demo99.repository;

import com.example.demo99.entities.Bien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BienRepository extends JpaRepository<Bien, Long> {

    List<Bien> findByAgenceId(Long agenceId);

    @Query("select b from Bien b where b.type like %:x%")
    public List<Bien> rechercheparmc(@Param("x") String mc);
}
