package com.DietiEstates2025.DietiEstates2025.Repositories;

import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtenteRepository extends JpaRepository<Utente, Integer> {
    Optional<Utente> findByUsername(String username);
    Optional<Utente> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}