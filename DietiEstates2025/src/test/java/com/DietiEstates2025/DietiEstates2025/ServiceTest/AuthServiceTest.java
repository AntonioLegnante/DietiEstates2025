package com.DietiEstates2025.DietiEstates2025.ServiceTest;

import com.DietiEstates2025.DietiEstates2025.DTO.RegistrazioneRequest;
import com.DietiEstates2025.DietiEstates2025.DTO.AgenziaDTO;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Models.Agenzia;
import com.DietiEstates2025.DietiEstates2025.MinioService;
import com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository;
import com.DietiEstates2025.DietiEstates2025.Repositories.AgenziaRepository;
import com.DietiEstates2025.DietiEstates2025.Services.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = "spring.profiles.active=test")
@org.springframework.test.context.ActiveProfiles("test")
@DisplayName("Test Service - Autenticazione")
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @MockBean
    private UtenteRepository utenteRepository;

    @MockBean
    private AgenziaRepository agenziaRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private MinioService minioService;

    private RegistrazioneRequest registrazioneRequest;
    private Utente utente;

    @BeforeEach
    void setup() {
        registrazioneRequest = new RegistrazioneRequest();
        registrazioneRequest.setUsername("newuser");
        registrazioneRequest.setEmail("newuser@test.com");
        registrazioneRequest.setPassword("securePassword123");
        registrazioneRequest.setNumeroDiTelefono("3891234567");
        registrazioneRequest.setRuolo("cliente");

        utente = new Utente();
        utente.setId(1);
        utente.setUsername("newuser");
        utente.setEmail("newuser@test.com");
        utente.setNumeroDiTelefono("3891234567");
        utente.setRuolo("cliente");
    }

    @Test
    @DisplayName("✅ Test Registrazione Cliente valida")
    void testRegistrazioneClienteSuccess() {
        // Arrange
        when(utenteRepository.existsByUsername("newuser")).thenReturn(false);
        when(utenteRepository.existsByEmail("newuser@test.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(utenteRepository.save(any(Utente.class))).thenReturn(utente);

        // Act
        Utente result = authService.registrazione(registrazioneRequest);

        // Assert
        assertNotNull(result);
        assertEquals("newuser", result.getUsername());
        assertEquals("newuser@test.com", result.getEmail());
        assertEquals("cliente", result.getRuolo());
        verify(utenteRepository, times(1)).save(any(Utente.class));
    }

    @Test
    @DisplayName("❌ Test Registrazione con username duplicato")
    void testRegistrazioneFailureDuplicateUsername() {
        // Arrange
        when(utenteRepository.existsByUsername("newuser")).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            authService.registrazione(registrazioneRequest);
        }, "Username già esistente");

        verify(utenteRepository, never()).save(any());
    }

    @Test
    @DisplayName("❌ Test Registrazione con email duplicata")
    void testRegistrazioneFailureDuplicateEmail() {
        // Arrange
        when(utenteRepository.existsByUsername("newuser")).thenReturn(false);
        when(utenteRepository.existsByEmail("newuser@test.com")).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            authService.registrazione(registrazioneRequest);
        }, "Email già registrata");

        verify(utenteRepository, never()).save(any());
    }

    @Test
    @DisplayName("✅ Test Registrazione Gestore con Agenzia valida")
    void testRegistrazioneGestoreSuccess() {
        // Arrange
        registrazioneRequest.setRuolo("nuovoAmministratore");
        AgenziaDTO agenziaDTO = new AgenziaDTO();
        agenziaDTO.setNomeAgenzia("Test Agency");
        agenziaDTO.setIndirizzoAgenzia("Via Test 1");
        agenziaDTO.setCittaAgenzia("Napoli");
        agenziaDTO.setTelefonoAgenzia("0815551234");
        agenziaDTO.setEmailAgenzia("agency@test.com");
        agenziaDTO.setPartitaIVA("12345678901");
        registrazioneRequest.setAgenzia(agenziaDTO);

        Agenzia agenzia = new Agenzia();
        agenzia.setId(1L);
        agenzia.setNomeAgenzia("Test Agency");
        agenzia.setPartitaIVA("12345678901");

        Utente gestore = new Utente();
        gestore.setId(1);
        gestore.setUsername("newuser");
        gestore.setRuolo("nuovoAmministratore");
        gestore.setAgenziaGestita(agenzia);

        when(utenteRepository.existsByUsername("newuser")).thenReturn(false);
        when(utenteRepository.existsByEmail("newuser@test.com")).thenReturn(false);
        when(agenziaRepository.existsByNomeAgenzia("Test Agency")).thenReturn(false);
        when(agenziaRepository.existsByPartitaIVA("12345678901")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        when(utenteRepository.save(any(Utente.class))).thenReturn(gestore);
        when(agenziaRepository.save(any(Agenzia.class))).thenReturn(agenzia);

        // Act
        Utente result = authService.registrazione(registrazioneRequest);

        // Assert
        assertNotNull(result);
        assertEquals("nuovoAmministratore", result.getRuolo());
        assertEquals("Test Agency", result.getAgenziaGestita().getNomeAgenzia());
    }

    @Test
    @DisplayName("❌ Test Registrazione Gestore senza dati agenzia")
    void testRegistrazioneGestoreFailureNoAgencyData() {
        // Arrange
        registrazioneRequest.setRuolo("nuovoAmministratore");
        registrazioneRequest.setAgenzia(null);

        when(utenteRepository.existsByUsername("newuser")).thenReturn(false);
        when(utenteRepository.existsByEmail("newuser@test.com")).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            authService.registrazione(registrazioneRequest);
        }, "Dati agenzia mancanti");
    }

    @Test
    @DisplayName("❌ Test Registrazione con partita IVA duplicata")
    void testRegistrazioneGestoreFailureDuplicateIVA() {
        // Arrange
        registrazioneRequest.setRuolo("nuovoAmministratore");
        AgenziaDTO agenziaDTO = new AgenziaDTO();
        agenziaDTO.setNomeAgenzia("New Agency");
        agenziaDTO.setPartitaIVA("12345678901");
        registrazioneRequest.setAgenzia(agenziaDTO);

        when(utenteRepository.existsByUsername("newuser")).thenReturn(false);
        when(utenteRepository.existsByEmail("newuser@test.com")).thenReturn(false);
        when(agenziaRepository.existsByNomeAgenzia("New Agency")).thenReturn(false);
        when(agenziaRepository.existsByPartitaIVA("12345678901")).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            authService.registrazione(registrazioneRequest);
        }, "Partita IVA già registrata");
    }

    @Test
    @DisplayName("✅ Test Registrazione Agente Immobiliare")
    void testRegistrazioneAgenteSuccess() {
        // Arrange
        //registrazioneRequest.setRuolo("agente immobiliare");

        registrazioneRequest.setRuolo("amministratore");

        when(utenteRepository.existsByUsername("newuser")).thenReturn(false);
        when(utenteRepository.existsByEmail("newuser@test.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");

        Utente agente = new Utente();
        agente.setId(2);
        agente.setUsername("newuser");
        agente.setRuolo("agente immobiliare");

        when(utenteRepository.save(any(Utente.class))).thenReturn(agente);

        // Act
        Utente result = authService.registrazione(registrazioneRequest);

        // Assert
        assertNotNull(result);
        assertEquals("agente immobiliare", result.getRuolo());
    }

    @Test
    @DisplayName("✅ Test Password crittografata durante registrazione")
    void testPasswordEncryption() {
        // Arrange
        when(utenteRepository.existsByUsername("newuser")).thenReturn(false);
        when(utenteRepository.existsByEmail("newuser@test.com")).thenReturn(false);
        String hashedPassword = "bcrypt$2a$10$hashedPassword";
        when(passwordEncoder.encode("securePassword123")).thenReturn(hashedPassword);

        utente.setPassword(hashedPassword);
        when(utenteRepository.save(any(Utente.class))).thenReturn(utente);

        // Act
        authService.registrazione(registrazioneRequest);

        // Assert
        verify(passwordEncoder, times(1)).encode("securePassword123");
    }

    @Test
    @DisplayName("❌ Test Registrazione con nome agenzia duplicato")
    void testRegistrazioneGestoreFailureDuplicateAgencyName() {
        // Arrange
        registrazioneRequest.setRuolo("nuovoAmministratore");
        AgenziaDTO agenziaDTO = new AgenziaDTO();
        agenziaDTO.setNomeAgenzia("Existing Agency");
        agenziaDTO.setPartitaIVA("99999999999");
        registrazioneRequest.setAgenzia(agenziaDTO);

        when(utenteRepository.existsByUsername("newuser")).thenReturn(false);
        when(utenteRepository.existsByEmail("newuser@test.com")).thenReturn(false);
        when(agenziaRepository.existsByNomeAgenzia("Existing Agency")).thenReturn(true);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            authService.registrazione(registrazioneRequest);
        }, "Nome agenzia già esistente");
    }
}
