package com.DietiEstates2025.DietiEstates2025.Controllers;

import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Services.UtenteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UtenteService utenteService;

    public AuthController(UtenteService utenteService) {
        this.utenteService = utenteService;
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
