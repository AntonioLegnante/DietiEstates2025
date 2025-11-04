package com.DietiEstates2025.DietiEstates2025.Repositories;

import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.Messaggi;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessaggiRepository extends JpaRepository<Messaggi, Integer> {

    Optional<List<Messaggi>> findByChatId(Integer chatId);
}
