package com.DietiEstates2025.DietiEstates2025.Controllers;

import com.DietiEstates2025.DietiEstates2025.DTO.LoginRequest;
import com.DietiEstates2025.DietiEstates2025.DTO.LoginResponse;
import com.DietiEstates2025.DietiEstates2025.DTO.RegistrazioneRequest;
import com.DietiEstates2025.DietiEstates2025.DTO.RegistrazioneResponse;
import com.DietiEstates2025.DietiEstates2025.JWT.JwtResponse;
import com.DietiEstates2025.DietiEstates2025.JWT.JwtTokenProvider;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Services.UtenteService;
import com.DietiEstates2025.DietiEstates2025.Services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UtenteService utenteService;
    private final AuthService authService;  // ← AGGIUNTO QUESTO

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Costruttore aggiornato con AuthService
    public AuthController(UtenteService utenteService, AuthService authService) {
        this.utenteService = utenteService;
        this.authService = authService;  // ← AGGIUNTO QUESTO
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUtente(@RequestBody LoginRequest loginRequest) {

        try {
            System.out.println("🔐 Tentativo di login per: " + loginRequest.getUsername());

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    );

            System.out.println("✅ Token di autenticazione creato");

            Authentication authentication = authenticationManager.authenticate(authToken);

            System.out.println("✅ Autenticazione riuscita!");

            String jwt = jwtTokenProvider.generateToken(authentication);

            System.out.println("✅ JWT generato: " + jwt.substring(0, 20) + "...");

            LoginResponse response = new LoginResponse(jwt, loginRequest.getUsername());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            System.out.println("❌ Credenziali errate per: " + loginRequest.getUsername());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Username o password non corretti");

        } catch (Exception e) {
            System.out.println("❌ Errore: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante il login: " + e.getMessage());
        }
    }

    @PostMapping("/registrazione")
    public ResponseEntity<?> registrazione(@RequestBody RegistrazioneRequest request) {
        try {
            Utente utente = authService.registrazione(request);
            RegistrazioneResponse response = new RegistrazioneResponse(
                    "Registrazione completata con successo",
                    utente.getUsername(),
                    utente.getRuolo()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/aggiungiAgente")
    public ResponseEntity<?> aggiungiAgente(@RequestBody RegistrazioneRequest request) {
        try {
            // Forza il ruolo a "agente immobiliare"
            request.setRuolo("agente immobiliare");

            // Verifica che l'utente autenticato sia un amministratore
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Devi essere autenticato");
            }

            String username = authentication.getName();
            Utente gestore = utenteService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utente non trovato"));

            if (!"Amministratore".equals(gestore.getRuolo())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Solo gli amministratori possono aggiungere agenti");
            }

            Utente agente = authService.registrazione(request);

            RegistrazioneResponse response = new RegistrazioneResponse(
                    "Agente immobiliare aggiunto con successo",
                    agente.getUsername(),
                    agente.getRuolo()
            );
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cambiaPassword")
    public ResponseEntity<JwtResponse> cambiaPassword(@RequestBody Utente utente) {

        boolean result = utenteService.cambiaPassword(
                utente.getUsername(),
                utente.getPassword(),
                utente.getNumeroDiTelefono(),
                utente.getRuolo()
        );

        if (!result) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        // 🔑 Ricrea Authentication con il ruolo aggiornato
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                utente.getUsername(),
                                utente.getPassword()
                        )
                );

        String token = jwtTokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JwtResponse(token));
    }

}