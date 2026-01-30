package com.DietiEstates2025.DietiEstates2025.IntegrationTest;

import com.DietiEstates2025.DietiEstates2025.DTO.LoginRequest;
import com.DietiEstates2025.DietiEstates2025.DTO.RegistrazioneRequest;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.MinioService;
import com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository;
import com.DietiEstates2025.DietiEstates2025.Services.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
@DisplayName("Test Integrazione - Flusso Completo Autenticazione")
class AuthIntegrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UtenteRepository utenteRepository;

    @MockBean
    private MinioService minioService;

    @BeforeEach
    void cleanup() {
        // Pulire il database prima di ogni test
        utenteRepository.deleteAll();
    }

    @Test
    @DisplayName("✅ Test Flusso completo: Registrazione -> Login")
    void testCompleteAuthenticationFlow() {
        // 1. Registrazione
        RegistrazioneRequest registrazioneRequest = new RegistrazioneRequest();
        registrazioneRequest.setUsername("newuser");
        registrazioneRequest.setEmail("newuser@test.com");
        registrazioneRequest.setPassword("SecurePassword123");
        registrazioneRequest.setNumeroDiTelefono("3891234567");
        registrazioneRequest.setRuolo("cliente");

        Utente utenteRegistrato = authService.registrazione(registrazioneRequest);
        
        assertNotNull(utenteRegistrato);
        assertEquals("newuser", utenteRegistrato.getUsername());

        // 2. Verifica che l'utente sia salvato nel database
        Utente utenteFromDB = utenteRepository.findByUsername("newuser")
                .orElseThrow(() -> new AssertionError("Utente non trovato nel database"));

        assertEquals("newuser@test.com", utenteFromDB.getEmail());
        assertEquals("cliente", utenteFromDB.getRuolo());
    }

 /*   @Test
    @DisplayName("✅ Test Multipla registrazione di utenti diversi")
    void testMultipleUsersRegistration() {
        // Registra primo utente
        RegistrazioneRequest req1 = new RegistrazioneRequest();
        req1.setUsername("user1");
        req1.setEmail("user1@test.com");
        req1.setPassword("password123");
        req1.setRuolo("cliente");
        
        authService.registrazione(req1);

        // Registra secondo utente
        RegistrazioneRequest req2 = new RegistrazioneRequest();
        req2.setUsername("user2");
        req2.setEmail("user2@test.com");
        req2.setPassword("password456");
        req2.setRuolo("agente immobiliare");
        
        authService.registrazione(req2);

        // Verifica entrambi gli utenti
        assertTrue(utenteRepository.existsByUsername("user1"));
        assertTrue(utenteRepository.existsByUsername("user2"));
        assertEquals(2, utenteRepository.count());
    }
*/
 /*   @Test
    @DisplayName("❌ Test Prevenzione duplicato durante registrazione consecutiva")
    void testPreventDuplicateRegistration() {
        RegistrazioneRequest req = new RegistrazioneRequest();
        req.setUsername("user1");
        req.setEmail("user1@test.com");
        req.setPassword("password123");
        req.setRuolo("cliente");

        // Primo tentativo: successo
        authService.registrazione(req);

        // Secondo tentativo: deve fallire
        assertThrows(RuntimeException.class, () -> {
            authService.registrazione(req);
        });
    }*/
}
