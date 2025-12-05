package com.DietiEstates2025.DietiEstates2025.Services;

import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UtenteService {
    private final UtenteRepository utenteRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UtenteService(UtenteRepository utenteRepository, PasswordEncoder passwordEncoder) {
        this.utenteRepository = utenteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Boolean registrazioneUtente(String username, String rawPassword, String numeroDiTelefono, String ruolo) {
        Boolean result = true;
        String password = passwordEncoder.encode(rawPassword);
        Utente utente = new Utente(username, password, numeroDiTelefono, ruolo);

        try {
            utenteRepository.save(utente);
        }
        catch(DataIntegrityViolationException e) {
            result = false;
        }

        return result;
    }

    public Boolean cambiaPassword(String username, String rawPassword, String numeroDiTelefono, String ruolo) {
        Boolean result = true;
        String password = passwordEncoder.encode(rawPassword);
        Optional<Utente> utente = utenteRepository.findByUsername(username);

        if (utente.isEmpty()) {
            return false;
        }

        try {
            utente.get().setPassword(password);
            utente.get().setRuolo(ruolo);
            utenteRepository.save(utente.get());
        }
        catch(DataIntegrityViolationException e) {
            result = false;
        }

        return result;
    }
}
