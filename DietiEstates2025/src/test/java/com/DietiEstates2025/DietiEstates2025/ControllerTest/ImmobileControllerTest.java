package com.DietiEstates2025.DietiEstates2025.ControllerTest;

import com.DietiEstates2025.DietiEstates2025.Controllers.ImmobileController;
import com.DietiEstates2025.DietiEstates2025.JWT.JwtTokenProvider;
import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Services.ImmobileService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.mock.http.server.reactive.MockServerHttpRequest.post;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ImmobileController.class)
@WithMockUser
public class ImmobileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ImmobileService immobileService;

    @MockitoBean
    private AuthenticationManager authenticationManager;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    public void testCreazioneImmobileCorretta() throws Exception {
        String titolo = "Appartamento moderno nel centro storico";
        String descrizione = "Luminoso appartamento ristrutturato con finiture di pregio, situato in zona centrale e ben servita dai mezzi pubblici. Cucina abitabile, doppi servizi, balcone panoramico.";
        Double prezzo = 235000.0;
        String dimensione = "85";
        String citta = "Milano";
        String indirizzo = "Via Giuseppe Verdi, 42";
        Boolean affitto = false;
        Boolean vendita = true;
        Integer numeroStanze = 3;
        String piano = "3";
        Boolean garage = true;
        Integer numeroBagni = 2;
        String classeEnergetica = "B";
        String username = "mario.rossi";

        MockMultipartFile imageFile = new MockMultipartFile(
                "file",
                "appartamento-principale.jpg",
                "image/jpeg",
                "fake image content".getBytes()
        );

        MockMultipartFile gallery1 = new MockMultipartFile(
                "galleryImages",  // IMPORTANTE: deve essere "galleryImages"
                "cucina.jpg",
                "image/jpeg",
                "fake image 1".getBytes()
        );

        MockMultipartFile gallery2 = new MockMultipartFile(
                "galleryImages",
                "soggiorno.jpg",
                "image/jpeg",
                "fake image 2".getBytes()
        );

        MockMultipartFile gallery3 = new MockMultipartFile(
                "galleryImages",
                "camera.jpg",
                "image/jpeg",
                "fake image 3".getBytes()
        );

        List<MultipartFile> galleryImages = Arrays.asList(gallery1, gallery2, gallery3);

        Mockito.when(immobileService.createImmobile(
                eq(titolo), eq(descrizione), eq(prezzo), eq(dimensione), eq(citta),
                eq(indirizzo), eq(affitto), eq(vendita), eq(numeroStanze), eq(piano),
                eq(classeEnergetica), eq(garage), eq(numeroBagni), any(MultipartFile.class), anyList(), eq(username)))
                .thenReturn(new Immobile(1, titolo, descrizione, citta, "imageFile",
                        List.of("gallery1", "gallery2", "gallery3"), prezzo, indirizzo,
                        affitto, vendita, numeroStanze, dimensione, piano, classeEnergetica, garage, numeroBagni, new Utente()));

        mockMvc.perform(multipart("/api/immobili")
                        .file(imageFile)
                        .file(gallery1)
                        .file(gallery2)
                        .file(gallery3)
                        .param("titolo", titolo)
                        .param("descrizione", descrizione)
                        .param("prezzo", prezzo.toString())
                        .param("dimensione", dimensione)
                        .param("citta", citta)
                        .param("indirizzo", indirizzo)
                        .param("affitto", affitto.toString())
                        .param("vendita", vendita.toString())
                        .param("numeroStanze", numeroStanze.toString())
                        .param("piano", piano)
                        .param("garage", garage.toString())
                        .param("numeroBagni", numeroBagni.toString())
                        .param("classeEnergetica", classeEnergetica)
                        .with(user(username))
                        .with(csrf()))
                .andExpect(status().isCreated());
    }

}
