package com.DietiEstates2025.DietiEstates2025.ModelTest;

import com.DietiEstates2025.DietiEstates2025.Models.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Test Modelli - Strutture Dati")
class ModelTest {

    private Utente utente;
    private Agenzia agenzia;
    private Immobile immobile;
    private Chat chat;
    private Messaggi messaggio;
    private Offerta offerta;

    @BeforeEach
    void setup() {
        // Setup Utente
        utente = new Utente();
        utente.setId(1);
        utente.setUsername("testuser");
        utente.setEmail("test@test.com");
        utente.setPassword("hashedPassword");
        utente.setRuolo("cliente");
        utente.setNumeroDiTelefono("3891234567");

        // Setup Agenzia
        agenzia = new Agenzia();
        agenzia.setId(1L);
        agenzia.setNomeAgenzia("Test Agency");
        agenzia.setIndirizzoAgenzia("Via Roma 1");
        agenzia.setCittaAgenzia("Napoli");
        agenzia.setTelefonoAgenzia("0815551234");
        agenzia.setEmailAgenzia("agency@test.com");
        agenzia.setPartitaIVA("12345678901");
        agenzia.setGestore(utente);

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
        immobile.setGalleryImages(Arrays.asList("https://minio.example.com/g1.jpg"));
        immobile.setUtente(utente);

        // Setup Chat
        Utente agente = new Utente();
        agente.setId(2);
        agente.setUsername("agente1");
        agente.setRuolo("agente immobiliare");

        chat = new Chat();
        chat.setChatId(1);
        chat.setUtente(utente);
        chat.setVendorId(agente);
        chat.setImmobileId(immobile);
        //chat.setDataCreazione(LocalDateTime.now());
        chat.setStatoNegoziazione(StatoNegoziazione.APERTA);
        chat.setMessaggi(new ArrayList<>());
        chat.setOfferte(new ArrayList<>());


        // Setup Offerta
        offerta = new Offerta();
        offerta.setOffertaId(1);
        offerta.setChat(chat);
        offerta.setOfferente(utente);
        offerta.setImportoOfferto(320000.0);
        offerta.setStato(StatoOfferta.IN_ATTESA);
        offerta.setDataCreazione(LocalDateTime.now());
    }

    @Test
    @DisplayName("✅ Test Creazione Utente valido")
    void testUtenteCreation() {
        assertEquals(1, utente.getId());
        assertEquals("testuser", utente.getUsername());
        assertEquals("test@test.com", utente.getEmail());
        assertEquals("cliente", utente.getRuolo());
        assertEquals("3891234567", utente.getNumeroDiTelefono());
    }

    @Test
    @DisplayName("✅ Test Modifica dati Utente")
    void testUtenteUpdate() {
        utente.setEmail("newemail@test.com");
        utente.setNumeroDiTelefono("3332223333");
        
        assertEquals("newemail@test.com", utente.getEmail());
        assertEquals("3332223333", utente.getNumeroDiTelefono());
    }

    @Test
    @DisplayName("✅ Test Collegamento Agenzia a Utente")
    void testUtenteWithAgency() {
        utente.setAgenziaGestita(agenzia);
        
        assertNotNull(utente.getAgenziaGestita());
        assertEquals("Test Agency", utente.getAgenziaGestita().getNomeAgenzia());
    }

    @Test
    @DisplayName("✅ Test Creazione Agenzia valida")
    void testAgenziaCreation() {
        assertEquals(1, agenzia.getId());
        assertEquals("Test Agency", agenzia.getNomeAgenzia());
        assertEquals("Via Roma 1", agenzia.getIndirizzoAgenzia());
        assertEquals("Napoli", agenzia.getCittaAgenzia());
        assertEquals("12345678901", agenzia.getPartitaIVA());
        assertEquals("testuser", agenzia.getGestore().getUsername());
    }

    @Test
    @DisplayName("✅ Test Validazione Partita IVA")
    void testAgenziaPartitaIva() {
        Agenzia agenzia2 = new Agenzia();
        agenzia2.setPartitaIVA("98765432101");
        
        assertNotEquals(agenzia.getPartitaIVA(), agenzia2.getPartitaIVA());
    }

    @Test
    @DisplayName("✅ Test Creazione Immobile valido")
    void testImmobileCreation() {
        assertEquals(1, immobile.getId());
        assertEquals("Appartamento Lusso", immobile.getTitolo());
        assertEquals(350000.0, immobile.getPrezzo());
        assertEquals("Napoli", immobile.getCitta());
        assertTrue(immobile.getVendita());
        assertFalse(immobile.getAffitto());
        assertEquals(3, immobile.getNumeroStanze());
    }

    @Test
    @DisplayName("✅ Test Immobile in affitto")
    void testImmobileForRent() {
        Immobile affitto = new Immobile();
        affitto.setTitolo("Appartamento Affitto");
        affitto.setPrezzo(1200.0);
        affitto.setAffitto(true);
        affitto.setVendita(false);
        
        assertTrue(affitto.getAffitto());
        assertFalse(affitto.getVendita());
        assertEquals(1200.0, affitto.getPrezzo());
    }

    @Test
    @DisplayName("✅ Test Immobile con garage")
    void testImmobileWithGarage() {
        assertTrue(immobile.getGarage());
        assertEquals(2, immobile.getNumeroBagni());
    }

    @Test
    @DisplayName("✅ Test Gallery immagini immobile")
    void testImmobileGallery() {
        assertNotNull(immobile.getGalleryImages());
        assertEquals(1, immobile.getGalleryImages().size());
        assertTrue(immobile.getGalleryImages().get(0).contains("minio"));
    }

    @Test
    @DisplayName("✅ Test Creazione Chat valida")
    void testChatCreation() {
        assertEquals(1, chat.getChatId());
        assertEquals("testuser", chat.getUtente().getUsername());
        assertEquals("agente1", chat.getVendorId().getUsername());
        assertEquals(StatoNegoziazione.APERTA, chat.getStatoNegoziazione());
    }

    @Test
    @DisplayName("✅ Test Aggiunta offerte a Chat")
    void testChatAddOffers() {
        chat.getOfferte().add(offerta);
        
        assertEquals(1, chat.getOfferte().size());
        assertEquals(320000.0, chat.getOfferte().get(0).getImportoOfferto());
    }

    @Test
    @DisplayName("✅ Test Cambio stato negoziazione")
    void testChatStatusChange() {
        chat.setStatoNegoziazione(StatoNegoziazione.APERTA);
        assertEquals(StatoNegoziazione.APERTA, chat.getStatoNegoziazione());
        
        chat.setStatoNegoziazione(StatoNegoziazione.CHIUSA_ACCETTATA);
        assertEquals(StatoNegoziazione.CHIUSA_ACCETTATA, chat.getStatoNegoziazione());
    }

    @Test
    @DisplayName("✅ Test Creazione Offerta valida")
    void testOffertaCreation() {
        assertEquals(1, offerta.getOffertaId());
        assertEquals(320000.0, offerta.getImportoOfferto());
        assertEquals(StatoOfferta.IN_ATTESA, offerta.getStato());
        assertEquals("testuser", offerta.getOfferente().getUsername());
    }

    @Test
    @DisplayName("✅ Test Cambio stato offerta")
    void testOffertaStatusChange() {
        offerta.setStato(StatoOfferta.ACCETTATA);
        assertEquals(StatoOfferta.ACCETTATA, offerta.getStato());
        
        offerta.setStato(StatoOfferta.RIFIUTATA);
        assertEquals(StatoOfferta.RIFIUTATA, offerta.getStato());
    }

    @Test
    @DisplayName("✅ Test Offerta rifiutata")
    void testOffertaRejected() {
        Offerta rifiutata = new Offerta();
        rifiutata.setImportoOfferto(250000.0);
        rifiutata.setStato(StatoOfferta.RIFIUTATA);
        
        assertEquals(StatoOfferta.RIFIUTATA, rifiutata.getStato());
        assertEquals(250000.0, rifiutata.getImportoOfferto());
    }

    @Test
    @DisplayName("✅ Test Enum StatoOfferta")
    void testStatoOffertaEnum() {
        assertEquals(StatoOfferta.IN_ATTESA, offerta.getStato());
        assertNotEquals(StatoOfferta.ACCETTATA, offerta.getStato());
    }

    @Test
    @DisplayName("✅ Test Enum StatoNegoziazione")
    void testStatoNegoziazioneEnum() {
        assertEquals(StatoNegoziazione.APERTA, chat.getStatoNegoziazione());
        assertNotEquals(StatoNegoziazione.CHIUSA_ACCETTATA, chat.getStatoNegoziazione());
    }

    @Test
    @DisplayName("✅ Test Immobile con valori limite")
    void testImmobileWithExtremeValues() {
        Immobile immobileExtra = new Immobile();
        immobileExtra.setPrezzo(5000000.0);
        immobileExtra.setDimensione("500 mq");
        immobileExtra.setNumeroStanze(15);
        immobileExtra.setNumeroBagni(8);
        
        assertEquals(5000000.0, immobileExtra.getPrezzo());
        assertEquals("500 mq", immobileExtra.getDimensione());
        assertEquals(15, immobileExtra.getNumeroStanze());
        assertEquals(8, immobileExtra.getNumeroBagni());
    }

    @Test
    @DisplayName("✅ Test Chat con multipli messaggi e offerte")
    void testChatWithMultipleItems() {
        
        Offerta off2 = new Offerta();
        off2.setOffertaId(2);
        off2.setImportoOfferto(330000.0);

        chat.getOfferte().add(offerta);
        chat.getOfferte().add(off2);

        assertEquals(2, chat.getOfferte().size());
    }

    @Test
    @DisplayName("✅ Test Classe energetica immobile")
    void testImmobileEnergyClass() {
        assertEquals("B", immobile.getClasseEnergetica());
        
        Immobile classA = new Immobile();
        classA.setClasseEnergetica("A");
        assertEquals("A", classA.getClasseEnergetica());
    }

}
