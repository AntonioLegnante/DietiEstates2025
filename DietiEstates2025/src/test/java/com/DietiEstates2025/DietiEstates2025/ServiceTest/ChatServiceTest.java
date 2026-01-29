package com.DietiEstates2025.DietiEstates2025.ServiceTest;

import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.Offerta;
import com.DietiEstates2025.DietiEstates2025.Models.StatoNegoziazione;
import com.DietiEstates2025.DietiEstates2025.Models.StatoOfferta;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Repositories.ChatRepository;
import com.DietiEstates2025.DietiEstates2025.Repositories.ImmobileRepository;
import com.DietiEstates2025.DietiEstates2025.Repositories.OffertaRepository;
import com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository;
import com.DietiEstates2025.DietiEstates2025.Services.ChatService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private ChatRepository chatRepository;

    @Mock
    private UtenteRepository utenteRepository;

    @Mock
    private OffertaRepository offertaRepository;

    @InjectMocks
    private ChatService chatService;

    private Utente offerente;

    private Utente vendor;

    private Chat chat;

    private Offerta o1, o2, o3;

    @BeforeEach
    void setUp() {
        offerente = new Utente("cliente", "pw", "123", "USER");
        offerente.setId(1);

        vendor = new Utente("agente", "pw", "123", "AGENTE");
        vendor.setId(2);

        chat = new Chat();
        chat.setChatId(100);
        chat.setUtente(offerente);
        chat.setVendorId(vendor);

        o1 = new Offerta(chat, offerente, 450.0, "n1");
        o1.setOffertaId(1);
        o1.setStato(StatoOfferta.IN_ATTESA);

        o2 = new Offerta(chat, offerente, 430.0, "n2");
        o2.setOffertaId(2);
        o2.setStato(StatoOfferta.IN_ATTESA);

        o3 = new Offerta(chat, offerente, 380.0, "n3");
        o3.setOffertaId(3);
        o3.setStato(StatoOfferta.IN_ATTESA);

        chat.setOfferte(List.of(o1, o2, o3));
    }

    @Test
    @DisplayName("Accettare la seconda offerta su tre")
    void accettaOffertaSeconda() {

        when(offertaRepository.findById(2)).thenReturn(Optional.of(o2));
        when(utenteRepository.findByUsername("agente")).thenReturn(Optional.of(vendor));
        when(offertaRepository.save(any(Offerta.class))).thenAnswer(inv -> inv.getArgument(0));

        Offerta result = chatService.accettaOfferta(2, "agente");

        assertNotNull(result);
        assertEquals(StatoOfferta.ACCETTATA, result.getStato());
        assertNotNull(result.getDataRisposta());
        assertEquals(StatoNegoziazione.CHIUSA_ACCETTATA, chat.getStatoNegoziazione());

        assertEquals(StatoOfferta.RIFIUTATA, o1.getStato());
        assertEquals(StatoOfferta.RIFIUTATA, o3.getStato());

        verify(offertaRepository, times(1)).findById(2);
        verify(offertaRepository, times(1)).save(result);
    }

    @Test
    @DisplayName("Accettare la terza offerta su tre")
    void rifiutaOffertaTerzaOfferta() {
        chat.setOfferte(List.of(o1, o2, o3));
        when(offertaRepository.findById(3)).thenReturn(Optional.of(o3));
        when(utenteRepository.findByUsername("Carlo")).thenReturn(Optional.of(vendor));
        when(offertaRepository.save(any(Offerta.class))).thenAnswer(inv -> inv.getArgument(0));
        Offerta result = chatService.rifiutaOfferta(3, "Troppo basso", "Carlo");
        assertNotNull(result);
        assertEquals(StatoOfferta.RIFIUTATA, result.getStato());
        assertNotNull(result.getDataRisposta());
        assertEquals(StatoNegoziazione.APERTA, chat.getStatoNegoziazione());
        assertEquals(StatoOfferta.IN_ATTESA, o1.getStato());
        assertEquals(StatoOfferta.IN_ATTESA, o2.getStato());
        verify(offertaRepository, times(1)).findById(3);
        verify(offertaRepository, times(1)).save(result);
    }

    @AfterAll
    static void checkFinale() {
        System.out.println("TUTTO OK!");
    }


}