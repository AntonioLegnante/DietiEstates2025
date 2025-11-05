package com.DietiEstates2025.DietiEstates2025.Repositories;

import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Integer> {
    Optional<List<Chat>> findByUtente_Id(Integer utente);
    Optional<List<Chat>> findByVendorId_Id(Integer vendorId);

    @Query("SELECT c FROM Chat c WHERE c.utente = :utente AND c.vendorId = :vendorId AND c.immobileId = :immobileId")
    Optional<Chat> findChat(@Param("utente") Utente utente,
                            @Param("vendorId") Utente vendorId,
                            @Param("immobileId") Immobile immobileId);

}
