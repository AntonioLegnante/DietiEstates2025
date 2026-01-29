package com.DietiEstates2025.DietiEstates2025.ServiceTest;

import com.DietiEstates2025.DietiEstates2025.MinioService;
import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Repositories.ImmobileRepository;
import com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository;
import com.DietiEstates2025.DietiEstates2025.Services.ImmobileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = "spring.profiles.active=test")
@org.springframework.test.context.ActiveProfiles("test")
@DisplayName("Test Service - Immobili")
class ImmobileServiceTest {

    @Autowired
    private ImmobileService immobileService;

    @MockBean
    private ImmobileRepository immobileRepository;

    @MockBean
    private UtenteRepository utenteRepository;

    @MockBean
    private MinioService minioService;

    private Utente agente;
    private Immobile immobile;
    private MultipartFile imageFile;
    private List<MultipartFile> galleryImages;

    @BeforeEach
    void setup() {
        // Setup Agente
        agente = new Utente();
        agente.setId(1);
        agente.setUsername("agent1");
        agente.setRuolo("agente immobiliare");

        // Setup Immobile
        immobile = new Immobile();
        immobile.setId(1);
        immobile.setTitolo("Appartamento Lusso");
        immobile.setDescrizione("Bellissimo appartamento");
        immobile.setPrezzo(350000.0);
        immobile.setDimensione("120 mq");
        immobile.setCitta("Napoli");
        immobile.setIndirizzo("Via Roma 123");
        immobile.setAffitto(false);
        immobile.setVendita(true);
        immobile.setNumeroStanze(3);
        immobile.setPiano("3°");
        immobile.setClasseEnergetica("B");
        immobile.setGarage(true);
        immobile.setNumeroBagni(2);
        immobile.setCoverImage("https://minio.example.com/img1.jpg");
        immobile.setUtente(agente);

        // Setup File Upload
        imageFile = new MockMultipartFile(
                "file",
                "cover.jpg",
                "image/jpeg",
                "fake-image-content".getBytes()
        );

        galleryImages = new ArrayList<>();
        galleryImages.add(new MockMultipartFile(
                "galleryImages",
                "gallery1.jpg",
                "image/jpeg",
                "fake-gallery-1".getBytes()
        ));
    }

    @Test
    @DisplayName("Test Creazione Immobile valido")
    void testCreateImmobileSuccess() throws Exception {
        // Arrange
        when(utenteRepository.findByUsername("agent1")).thenReturn(Optional.of(agente));
        when(minioService.uploadFile(imageFile))
                .thenReturn("https://minio.example.com/img1.jpg");
        when(minioService.uploadMultipleFiles(galleryImages))
                .thenReturn(Arrays.asList("https://minio.example.com/gallery1.jpg"));
        when(immobileRepository.save(any(Immobile.class))).thenReturn(immobile);

        // Act
        Immobile result = immobileService.createImmobile(
                "Appartamento Lusso", "Bellissimo appartamento", 350000.0,
                "120 mq", "Napoli", "Via Roma 123",
                false, true, 3, "3°", "B", true, 2,
                imageFile, galleryImages, "agent1"
        );

        // Assert
        assertNotNull(result);
        assertEquals("Appartamento Lusso", result.getTitolo());
        assertEquals(350000.0, result.getPrezzo());
        assertEquals("Napoli", result.getCitta());
        assertEquals("agent1", result.getUtente().getUsername());
        verify(immobileRepository, times(1)).save(any(Immobile.class));
    }

    @Test
    @DisplayName("Test Creazione Immobile con agente non trovato")
    void testCreateImmobileFailureAgentNotFound() throws Exception {
        // Arrange
        when(utenteRepository.findByUsername("nonexistent"))
                .thenReturn(Optional.empty());
        when(minioService.uploadFile(imageFile))
                .thenReturn("https://minio.example.com/img1.jpg");

        // Act & Assert
        assertThrows(Exception.class, () -> {
            immobileService.createImmobile(
                    "Appartamento", "Descrizione", 100000.0,
                    "100 mq", "Napoli", "Via Test",
                    false, true, 2, "1°", "A", false, 1,
                    imageFile, galleryImages, "nonexistent"
            );
        });
    }

    @Test
    @DisplayName("Test Ricerca Immobili per città")
    void testSearchImmobiliByCity() {
        // Arrange
        List<Immobile> immobili = Arrays.asList(immobile);
        when(immobileRepository.ricercaAvanzata(
                "Napoli", null, null, false, true, null, null,
                null, null, null
        )).thenReturn(immobili);

        // Act
        List<Immobile> result = immobileService.applicaRicerca(
                "Napoli", null, null, false, true, null, null,
                null, null, null
        );

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Napoli", result.get(0).getCitta());
    }

    @Test
    @DisplayName("Test Ricerca Immobili per intervallo prezzo")
    void testSearchImmobiliByPriceRange() {
        // Arrange
        List<Immobile> immobili = Arrays.asList(immobile);
        when(immobileRepository.ricercaAvanzata(
                "Napoli", 300000.0, 400000.0, false, true, null, null,
                null, null, null
        )).thenReturn(immobili);

        // Act
        List<Immobile> result = immobileService.applicaRicerca(
                "Napoli", 300000.0, 400000.0, false, true, null, null,
                null, null, null
        );

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getPrezzo() >= 300000.0);
        assertTrue(result.get(0).getPrezzo() <= 400000.0);
    }

    @Test
    @DisplayName("Test Ricerca Immobili per numero stanze")
    void testSearchImmobiliByRooms() {
        // Arrange
        List<Immobile> immobili = Arrays.asList(immobile);
        when(immobileRepository.ricercaAvanzata(
                "Napoli", null, null, false, true, 3, null,
                null, null, null
        )).thenReturn(immobili);

        // Act
        List<Immobile> result = immobileService.applicaRicerca(
                "Napoli", null, null, false, true, 3, null,
                null, null, null
        );

        // Assert
        assertNotNull(result);
        assertEquals(3, result.get(0).getNumeroStanze());
    }

    @Test
    @DisplayName("Test Ricerca Immobili in affitto")
    void testSearchImmobiliForRent() {
        // Arrange
        Immobile immobileAffitto = new Immobile();
        immobileAffitto.setId(2);
        immobileAffitto.setTitolo("Appartamento Affitto");
        immobileAffitto.setPrezzo(1200.0);
        immobileAffitto.setCitta("Roma");
        immobileAffitto.setAffitto(true);
        immobileAffitto.setVendita(false);

        List<Immobile> immobili = Arrays.asList(immobileAffitto);
        when(immobileRepository.ricercaAvanzata(
                "Roma", null, null, true, false, null, null,
                null, null, null
        )).thenReturn(immobili);

        // Act
        List<Immobile> result = immobileService.applicaRicerca(
                "Roma", null, null, true, false, null, null,
                null, null, null
        );

        // Assert
        assertNotNull(result);
        assertTrue(result.get(0).getAffitto());
        assertFalse(result.get(0).getVendita());
    }

    @Test
    @DisplayName("Test Ricerca Immobili in vendita")
    void testSearchImmobiliForSale() {
        // Arrange
        List<Immobile> immobili = Arrays.asList(immobile);
        when(immobileRepository.ricercaAvanzata(
                "Napoli", null, null, false, true, null, null,
                null, null, null
        )).thenReturn(immobili);

        // Act
        List<Immobile> result = immobileService.applicaRicerca(
                "Napoli", null, null, false, true, null, null,
                null, null, null
        );

        // Assert
        assertNotNull(result);
        assertFalse(result.get(0).getAffitto());
        assertTrue(result.get(0).getVendita());
    }

    @Test
    @DisplayName("Test Ricerca Immobili con risultati vuoti")
    void testSearchImmobiliEmptyResults() {
        // Arrange
        when(immobileRepository.ricercaAvanzata(
                "Palermo", null, null, false, true, null, null,
                null, null, null
        )).thenReturn(new ArrayList<>());

        // Act
        List<Immobile> result = immobileService.applicaRicerca(
                "Palermo", null, null, false, true, null, null,
                null, null, null
        );

        // Assert
        assertNotNull(result);
        assertEquals(0, result.size());
    }


    @Test
    @DisplayName("Test Creazione Immobile senza gallery")
    void testCreateImmobileWithoutGallery() throws Exception {
        // Arrange
        when(utenteRepository.findByUsername("agent1")).thenReturn(Optional.of(agente));
        when(minioService.uploadFile(imageFile))
                .thenReturn("https://minio.example.com/img1.jpg");
        when(immobileRepository.save(any(Immobile.class))).thenReturn(immobile);

        // Act
        Immobile result = immobileService.createImmobile(
                "Appartamento Lusso", "Bellissimo appartamento", 350000.0,
                "120 mq", "Napoli", "Via Roma 123",
                false, true, 3, "3°", "B", true, 2,
                imageFile, null, "agent1"
        );

        // Assert
        assertNotNull(result);
        assertEquals("Appartamento Lusso", result.getTitolo());
    }

    @Test
    @DisplayName("Test Creazione Immobile senza coverImage")
    void testCreateImmobileWithoutCoverImage() throws Exception {
        // Arrange
        when(utenteRepository.findByUsername("agent1")).thenReturn(Optional.of(agente));
        when(minioService.uploadFile(null))
                 .thenThrow(new Exception("Cover image is required"));
        when(minioService.uploadMultipleFiles(galleryImages))
                .thenReturn(Arrays.asList("https://minio.example.com/gallery1.jpg"));
        when(immobileRepository.save(any(Immobile.class))).thenReturn(immobile);

        // Act
        assertThrows(Exception.class, () -> {
            immobileService.createImmobile(
                    "Appartamento Lusso", "Bellissimo appartamento", 350000.0,
                    "120 mq", "Napoli", "Via Roma 123",
                    false, true, 3, "3°", "B", true, 2,
                    null, galleryImages, "agent1"
            );
        });
    }

    @Test
    @DisplayName("Test Ricerca con più filtri combinati")
    void testSearchImmobiliWithMultipleFilters() {
        // Arrange
        List<Immobile> immobili = Arrays.asList(immobile);
        when(immobileRepository.ricercaAvanzata(
                "Napoli", 300000.0, 400000.0, false, true, 3, "120 mq",
                null, null, null
        )).thenReturn(immobili);

        // Act
        List<Immobile> result = immobileService.applicaRicerca(
                "Napoli", 300000.0, 400000.0, false, true, 3, "120 mq",
                null, null, null
        );

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Napoli", result.get(0).getCitta());
        assertEquals(350000.0, result.get(0).getPrezzo());
        assertEquals(3, result.get(0).getNumeroStanze());
        assertEquals("120 mq", result.get(0).getDimensione());
    }
}
