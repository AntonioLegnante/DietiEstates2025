package com.DietiEstates2025.DietiEstates2025.ControllerTest;

import com.DietiEstates2025.DietiEstates2025.Controllers.AuthController;
import com.DietiEstates2025.DietiEstates2025.JWT.JwtTokenProvider;
import com.DietiEstates2025.DietiEstates2025.Services.UtenteService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(AuthController.class)
@WithMockUser// <-- AGGIUNGI QUESTO!
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UtenteService utenteService;

    @MockitoBean
    private AuthenticationManager authenticationManager;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;


    @Test
    public void testRegistrazioneUtenteCorretta() throws Exception {
        Mockito.when(utenteService.registrazioneUtente("Antonio", "Legnante", "351", "Agente immobiliare"))
                .thenReturn(true);

        String jsonBody = """
            {
                "username": "Antonio",
                "password": "Legnante",
                "numeroDiTelefono": "351",
                "ruolo": "Agente immobiliare"
            }
            """;

        mockMvc.perform(post("/auth/registrazione")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody)
                        .with(csrf()))
                .andExpect(status().isCreated());
    }

    @Test
    public void testRegistrazioneUtenteErrata() throws Exception {
        Mockito.when(utenteService.registrazioneUtente("Antonio", "Legnante", "351", "Agente immobiliare"))
                .thenReturn(false);

        String jsonBody = """
            {
                "username": "Antonio",
                "password": "Legnante",
                "numeroDiTelefono": "351",
                "ruolo": "Agente immobiliare"
            }
            """;

        mockMvc.perform(post("/auth/registrazione")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonBody)
                        .with(csrf()))
                .andExpect(status().isConflict());
    }
}