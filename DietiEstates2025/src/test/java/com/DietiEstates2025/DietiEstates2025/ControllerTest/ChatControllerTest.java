package com.DietiEstates2025.DietiEstates2025.ControllerTest;

import com.DietiEstates2025.DietiEstates2025.Controllers.ChatController;
import com.DietiEstates2025.DietiEstates2025.DTO.OffertaDTO;
import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Models.Offerta;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Services.ChatService;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatControllerTest {

    @Mock
    private ChatService chatService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private ChatController chatController;

    @Test
    void makeOffer_positiveAmount_returnsOffertaDTO() {
        // Arrange
        Integer chatId = 1;
        Double importo = 150.0;
        String note = "Prova";
        String username = "cliente1";

        Utente offerente = new Utente("cliente1", "pw", "123", "USER");
        offerente.setId(2);
        //offerente.setUsername("cliente1");

        Chat chat = new Chat();
        chat.setChatId(chatId);

        Offerta offerta = new Offerta(chat, offerente, importo, note);
        offerta.setOffertaId(10);

        when(authentication.getName()).thenReturn(username);
        when(chatService.creaOfferta(chatId, importo, note, username)).thenReturn(offerta);

        ResponseEntity<OffertaDTO> response = chatController.makeOffer(chatId, importo, note, authentication);

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        OffertaDTO dto = response.getBody();
        assertEquals(importo, dto.getImportoOfferto());
        assertEquals(chatId, dto.getChatId());
        assertEquals(offerente.getUsername(), dto.getOfferenteNome());

        verify(chatService, times(1)).creaOfferta(chatId, importo, note, username);
    }

    @Test
    void makeOffer_negativeAmount_returnsBadRequest() {
        // Arrange
        Integer chatId = 1;
        Double importo = -50.0;
        String note = "Negativo";
        String username = "cliente1";

        when(authentication.getName()).thenReturn(username);
        when(chatService.creaOfferta(chatId, importo, note, username)).thenReturn(null);

        // Act
        ResponseEntity<OffertaDTO> response = chatController.makeOffer(chatId, importo, note, authentication);

        // Assert
        assertEquals(400, response.getStatusCodeValue());
        assertNull(response.getBody());

        verify(chatService, times(1)).creaOfferta(chatId, importo, note, username);
    }


    @AfterAll
    static void checkFinale() {
        System.out.println("TUTTO Ok!");
    }
}