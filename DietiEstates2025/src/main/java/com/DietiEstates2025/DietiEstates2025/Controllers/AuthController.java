package com.DietiEstates2025.DietiEstates2025.Controllers;

import com.DietiEstates2025.DietiEstates2025.DTO.LoginRequest;
import com.DietiEstates2025.DietiEstates2025.DTO.LoginResponse;
import com.DietiEstates2025.DietiEstates2025.JWT.JwtTokenProvider;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Services.UtenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.management.remote.JMXAuthenticator;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UtenteService utenteService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public AuthController(UtenteService utenteService) {
        this.utenteService = utenteService;
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUtente(@RequestBody LoginRequest loginRequest) {

        try {
            System.out.println("🔐 Tentativo di login per: " + loginRequest.getUsername());

            // PASSO 1: Crea un "token" con username e password
            // (NON è ancora un JWT! È solo un oggetto di Spring Security)
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),   // es: "mario"
                            loginRequest.getPassword()    // es: "password123"
                    );

            System.out.println("✅ Token di autenticazione creato");

            // PASSO 2: Chiedi all'AuthenticationManager di verificare
            // Lui farà:
            //   1. Chiama UserDetailsService per caricare l'utente dal DB
            //   2. Usa PasswordEncoder per confrontare le password
            //   3. Se OK → ritorna Authentication autenticato
            //   4. Se KO → lancia BadCredentialsException
            Authentication authentication = authenticationManager.authenticate(authToken);

            System.out.println("✅ Autenticazione riuscita!");

            // PASSO 3: Se arriviamo qui, le credenziali sono CORRETTE!
            // Generiamo il JWT token
            String jwt = jwtTokenProvider.generateToken(authentication);

            System.out.println("✅ JWT generato: " + jwt.substring(0, 20) + "...");

            // PASSO 4: Creiamo la risposta e la inviamo al client
            LoginResponse response = new LoginResponse(jwt, loginRequest.getUsername());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            // Username o password SBAGLIATI
            System.out.println("❌ Credenziali errate per: " + loginRequest.getUsername());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Username o password non corretti");

        } catch (Exception e) {
            // Errore generico
            System.out.println("❌ Errore: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Errore durante il login: " + e.getMessage());
        }
    }

    @PostMapping("/registrazione")
    public ResponseEntity<String> registrazioneUtente(@RequestBody Utente utente) {
        System.out.println(utente.getUsername());
        //implementare controlli
        utenteService.registrazioneUtente(utente.getUsername(),utente.getPassword(),
                utente.getNumeroDiTelefono(), utente.getRuolo());
        return ResponseEntity.ok("Utente registrato con successo");
    }
}
