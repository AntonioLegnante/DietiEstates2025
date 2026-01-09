package com.DietiEstates2025.DietiEstates2025.Services;

import com.DietiEstates2025.DietiEstates2025.DTO.AgenziaDTO;
import com.DietiEstates2025.DietiEstates2025.DTO.RegistrazioneRequest;
import com.DietiEstates2025.DietiEstates2025.Models.Agenzia;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Repositories.AgenziaRepository;
import com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private AgenziaRepository agenziaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Utente registrazione(RegistrazioneRequest request) {

        System.out.println("📝 Inizio registrazione per: " + request.getUsername());

        // Validazioni
        if (utenteRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username già esistente");
        }

        if (utenteRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email già registrata");
        }

        // Crea l'utente
        Utente utente = new Utente();
        utente.setUsername(request.getUsername());
        utente.setEmail(request.getEmail());
        utente.setPassword(passwordEncoder.encode(request.getPassword()));
        utente.setNumeroDiTelefono(request.getNumeroDiTelefono());
        utente.setRuolo(request.getRuolo());

        System.out.println("✅ Utente creato: " + utente.getUsername() + " - Ruolo: " + utente.getRuolo());

        // Se è un gestore, crea anche l'agenzia
        if ("nuovoAmministratore".equals(request.getRuolo())) {
            if (request.getAgenzia() == null) {
                throw new RuntimeException("Dati agenzia mancanti per la registrazione gestore");
            }

            AgenziaDTO agenziaDTO = request.getAgenzia();

            System.out.println("🏢 Creazione agenzia: " + agenziaDTO.getNomeAgenzia());

            // Validazioni agenzia
            if (agenziaRepository.existsByNomeAgenzia(agenziaDTO.getNomeAgenzia())) {
                throw new RuntimeException("Nome agenzia già esistente");
            }

            if (agenziaRepository.existsByPartitaIVA(agenziaDTO.getPartitaIVA())) {
                throw new RuntimeException("Partita IVA già registrata");
            }

            // Crea l'agenzia
            Agenzia agenzia = new Agenzia();
            agenzia.setNomeAgenzia(agenziaDTO.getNomeAgenzia());
            agenzia.setIndirizzoAgenzia(agenziaDTO.getIndirizzoAgenzia());
            agenzia.setCittaAgenzia(agenziaDTO.getCittaAgenzia());
            agenzia.setTelefonoAgenzia(agenziaDTO.getTelefonoAgenzia());
            agenzia.setEmailAgenzia(agenziaDTO.getEmailAgenzia());
            agenzia.setPartitaIVA(agenziaDTO.getPartitaIVA());
            agenzia.setGestore(utente);

            // Collega l'agenzia all'utente
            utente.setAgenziaGestita(agenzia);

            System.out.println("✅ Agenzia creata e collegata al gestore");
        }

        // Se è un agente immobiliare, collegalo all'agenzia del gestore che lo sta creando
        if ("agente immobiliare".equals(request.getRuolo())) {
            System.out.println("👤 Aggiunta agente immobiliare...");

            // Ottieni l'utente autenticato (il gestore che sta aggiungendo l'agente)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated()) {
                String usernameGestore = authentication.getName();
                System.out.println("🔍 Gestore autenticato: " + usernameGestore);

                // Trova il gestore
                Utente gestore = utenteRepository.findByUsername(usernameGestore)
                        .orElseThrow(() -> new RuntimeException("Gestore non trovato"));

                // Trova l'agenzia del gestore
                Agenzia agenzia = gestore.getAgenziaGestita();

                if (agenzia == null) {
                    throw new RuntimeException("L'amministratore non ha un'agenzia associata");
                }

                System.out.println("🏢 Agenzia trovata: " + agenzia.getNomeAgenzia());

                // Collega l'agente all'agenzia
                utente.setAgenzia(agenzia);

                System.out.println("✅ Agente collegato all'agenzia: " + agenzia.getNomeAgenzia());
            } else {
                throw new RuntimeException("Devi essere autenticato come amministratore per aggiungere agenti");
            }
        }

        // Salva l'utente (e l'agenzia se presente, grazie al cascade)
        Utente utenteSalvato = utenteRepository.save(utente);

        System.out.println("✅ Registrazione completata con successo!");

        return utenteSalvato;
    }
}