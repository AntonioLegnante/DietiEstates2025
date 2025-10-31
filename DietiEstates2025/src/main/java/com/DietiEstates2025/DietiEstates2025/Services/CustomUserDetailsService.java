package com.DietiEstates2025.DietiEstates2025.Services;

import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UtenteRepository utenteRepository;

    /**
     * Spring Security chiama questo metodo per caricare l'utente
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 1. Cerca l'utente nel database
        Utente user = utenteRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Utente non trovato con username: " + username
                ));

        // 2. Converti il tuo User in un UserDetails di Spring Security
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())  // Password GIÀ cifrata nel DB
          //      .authorities("ROLE_USER")      // Ruolo dell'utente
                .build();
    }
}