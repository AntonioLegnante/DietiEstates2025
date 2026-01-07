package com.DietiEstates2025.DietiEstates2025.Repositories;

import com.DietiEstates2025.DietiEstates2025.Models.Offerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OffertaRepository extends JpaRepository<Offerta, Integer> {
    List<Offerta> findByChat_ChatIdOrderByDataCreazioneDesc(Integer chatId);
}