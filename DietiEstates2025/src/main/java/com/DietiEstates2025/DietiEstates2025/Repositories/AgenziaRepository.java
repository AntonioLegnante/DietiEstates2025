package com.DietiEstates2025.DietiEstates2025.Repositories;

import com.DietiEstates2025.DietiEstates2025.Models.Agenzia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AgenziaRepository extends JpaRepository<Agenzia, Long> {

    Optional<Agenzia> findByNomeAgenzia(String nomeAgenzia);

    Optional<Agenzia> findByPartitaIVA(String partitaIVA);

    boolean existsByNomeAgenzia(String nomeAgenzia);

    boolean existsByPartitaIVA(String partitaIVA);
}