package com.example.demo99.repository;

import com.example.demo99.entities.Bien;
import com.example.demo99.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, Long> {
    @Modifying
    @Query(value = "INSERT INTO client_biens (client_id, bien_id) VALUES (:clientId, :bienId)", nativeQuery = true)
    void addInterestedRelation(@Param("clientId") Long clientId, @Param("bienId") Long bienId);
    Optional<Client> findByEmail(String email);

    @Query(value = "SELECT b.id FROM bien b " +
            "INNER JOIN client_biens cb ON b.id = cb.bien_id " +
            "WHERE cb.client_id = :clientId", nativeQuery = true)
    List<Long> findBienIdsByClientId(@Param("clientId") Long clientId);

}
