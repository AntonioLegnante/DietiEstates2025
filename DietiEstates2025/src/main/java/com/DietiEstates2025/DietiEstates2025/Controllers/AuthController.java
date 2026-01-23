package com.DietiEstates2025.DietiEstates2025.Controllers;

import com.DietiEstates2025.DietiEstates2025.DTO.LoginRequest;
import com.DietiEstates2025.DietiEstates2025.DTO.LoginResponse;
import com.DietiEstates2025.DietiEstates2025.DTO.RegistrazioneRequest;
import com.DietiEstates2025.DietiEstates2025.DTO.RegistrazioneResponse;
import com.DietiEstates2025.DietiEstates2025.DTO.GoogleLoginRequest;
import com.DietiEstates2025.DietiEstates2025.DTO.AgenziaDTO;
import com.DietiEstates2025.DietiEstates2025.JWT.JwtResponse;
import com.DietiEstates2025.DietiEstates2025.JWT.JwtTokenProvider;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Models.Agenzia;
import com.DietiEstates2025.DietiEstates2025.Services.UtenteService;
import com.DietiEstates2025.DietiEstates2025.Services.AuthService;
import com.DietiEstates2025.DietiEstates2025.Services.GoogleAuthService;
import com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository;
import com.DietiEstates2025.DietiEstates2025.Repositories.AgenziaRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UtenteService utenteService;
    private final AuthService authService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private AgenziaRepository agenziaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthController(UtenteService utenteService, AuthService authService) {
        this.utenteService = utenteService;
        this.authService = authService;
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
        System.out.println("Sono dentro registrazione");
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
        System.out.println("Sono dentro aggiungiAgente");
        try {
            request.setRuolo("agente immobiliare");

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
    public ResponseEntity<JwtResponse> cambiaPassword(@NotNull @RequestBody Utente utente) {
        boolean result = utenteService.cambiaPassword(
                utente.getUsername(),
                utente.getPassword(),
                utente.getNumeroDiTelefono(),
                utente.getRuolo()
        );

        if (!result) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

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

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            System.out.println("🔐 Tentativo di login Google");

            GoogleIdToken.Payload payload = googleAuthService.verifyToken(request.getToken());

            String email = payload.getEmail();
            String name = (String) payload.get("name");

            System.out.println("✅ Token Google verificato per: " + email);

            Utente utente = utenteRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utente non trovato. Registrati prima con Google."));

            System.out.println("✅ Utente trovato: " + utente.getUsername());

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    utente.getUsername(),
                    null,
                    Collections.singletonList(() -> utente.getRuolo())
            );

            String jwt = jwtTokenProvider.generateToken(authentication);

            System.out.println("✅ JWT generato");

            LoginResponse response = new LoginResponse(jwt, utente.getUsername());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Errore: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Errore durante il login con Google: " + e.getMessage());
        }
    }

    @PostMapping("/google-register")
    public ResponseEntity<?> googleRegister(@RequestBody GoogleLoginRequest request) {
        try {
            System.out.println("📝 Tentativo di registrazione Google");

            GoogleIdToken.Payload payload = googleAuthService.verifyToken(request.getToken());

            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String givenName = (String) payload.get("given_name");

            System.out.println("✅ Token Google verificato per: " + email);

            if (utenteRepository.existsByEmail(email)) {
                throw new RuntimeException("Email già registrata. Effettua il login.");
            }

            String username = email.split("@")[0];

            int counter = 1;
            String originalUsername = username;
            while (utenteRepository.existsByUsername(username)) {
                username = originalUsername + counter;
                counter++;
            }

            System.out.println("✅ Username generato: " + username);

            Utente utente = new Utente();
            utente.setUsername(username);
            utente.setEmail(email);
            utente.setPassword(passwordEncoder.encode("GOOGLE_AUTH_" + System.currentTimeMillis()));

            // ⭐ FIX: Genera telefono fittizio unico invece di stringa vuota
            String telefonoUnico;
            do {
                telefonoUnico = "GOOGLE_" + UUID.randomUUID().toString().substring(0, 10);
            } while (utenteRepository.existsByNumeroDiTelefono(telefonoUnico));

            utente.setNumeroDiTelefono(telefonoUnico);
            System.out.println("📱 Telefono generato: " + telefonoUnico);

            utente.setRuolo(request.getRuolo() != null ? request.getRuolo() : "utente");

            if ("nuovoAmministratore".equals(request.getRuolo())) {
                if (request.getAgenzia() == null) {
                    throw new RuntimeException("Dati agenzia mancanti per la registrazione gestore");
                }

                AgenziaDTO agenziaDTO = request.getAgenzia();

                System.out.println("🏢 Creazione agenzia: " + agenziaDTO.getNomeAgenzia());

                if (agenziaRepository.existsByNomeAgenzia(agenziaDTO.getNomeAgenzia())) {
                    throw new RuntimeException("Nome agenzia già esistente");
                }

                if (agenziaRepository.existsByPartitaIVA(agenziaDTO.getPartitaIVA())) {
                    throw new RuntimeException("Partita IVA già registrata");
                }

                Agenzia agenzia = new Agenzia();
                agenzia.setNomeAgenzia(agenziaDTO.getNomeAgenzia());
                agenzia.setIndirizzoAgenzia(agenziaDTO.getIndirizzoAgenzia());
                agenzia.setCittaAgenzia(agenziaDTO.getCittaAgenzia());
                agenzia.setTelefonoAgenzia(agenziaDTO.getTelefonoAgenzia());
                agenzia.setEmailAgenzia(agenziaDTO.getEmailAgenzia());
                agenzia.setPartitaIVA(agenziaDTO.getPartitaIVA());
                agenzia.setGestore(utente);

                utente.setAgenziaGestita(agenzia);

                System.out.println("✅ Agenzia creata e collegata al gestore");
            }

            Utente utenteSalvato = utenteRepository.save(utente);

            System.out.println("✅ Registrazione Google completata per: " + utenteSalvato.getUsername());

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    utenteSalvato.getUsername(),
                    null,
                    Collections.singletonList(() -> utenteSalvato.getRuolo())
            );

            String jwt = jwtTokenProvider.generateToken(authentication);

            LoginResponse response = new LoginResponse(jwt, utenteSalvato.getUsername());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Errore: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Errore durante la registrazione con Google: " + e.getMessage());
        }
    }
}