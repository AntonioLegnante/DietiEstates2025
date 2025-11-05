package com.DietiEstates2025.DietiEstates2025.Repositories;

import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Integer> {
    Optional<List<Chat>> findByUtente_Id(Integer utente);
    Optional<List<Chat>> findByVendorId_Id(Integer vendorId);
    @Query("SELECT c FROM Chat c WHERE c.utente = :utente_id AND c.vendorId = :vendor_id AND c.immobileId = :immobile_id")
    Optional<Chat> findChat(@Param("utente_id") Integer utente_id, @Param("vendor_id") Integer vendor_id,
                                         @Param("immobile_id") Integer immobile_id);

}
