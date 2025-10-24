package com.DietiEstates2025.DietiEstates2025.Services;

import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UtenteService {
    private final UtenteRepository utenteRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UtenteService(UtenteRepository utenteRepository, PasswordEncoder passwordEncoder) {
        this.utenteRepository = utenteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registrazioneUtente(String username, String rawPassword, String numeroDiTelefono, String ruolo) {
        String password = passwordEncoder.encode(rawPassword);
        Utente utente = new Utente(username, password, numeroDiTelefono, ruolo);
        utenteRepository.save(utente);
    }
}
