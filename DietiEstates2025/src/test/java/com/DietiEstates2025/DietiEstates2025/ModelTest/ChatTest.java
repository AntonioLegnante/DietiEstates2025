package com.DietiEstates2025.DietiEstates2025.ModelTest;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.Offerta;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

@ExtendWith(MockitoExtension.class)
public class ChatTest {

    private Chat chat;

    private  Double importoSpecifico;

    private String noteSpecifiche;
    @Mock
    private Offerta offertaMock;

    @BeforeEach
    void setUp() {
        chat = new Chat();

        importoSpecifico = 250000.0;
        noteSpecifiche = "Offerta ad hoc per appartamento vista mare";

        when(offertaMock.getImportoOfferto()).thenReturn(importoSpecifico);
        when(offertaMock.getNote()).thenReturn(noteSpecifiche);

    }

    @Test
    void testAggiungiOffertaConDatiAdHoc() {

        chat.aggiungiOfferta(offertaMock);

        List<Offerta> listaOfferte = chat.getOfferte();

        assertEquals(1, listaOfferte.size(), "La lista dovrebbe contenere esattamente un'offerta");
        assertTrue(listaOfferte.contains(offertaMock), "L'offerta mockata dovrebbe essere nella lista della chat");

        assertEquals(importoSpecifico, listaOfferte.get(0).getImportoOfferto());
        assertEquals(noteSpecifiche, listaOfferte.get(0).getNote());

        verify(offertaMock, times(1)).setChat(chat);
    }

    @AfterAll
    static void check() {
        System.out.println("Tutto ok!");
    }


}
