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

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
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

    @MockitoBean
    private com.DietiEstates2025.DietiEstates2025.Services.AuthService authService;

    @MockitoBean
    private com.DietiEstates2025.DietiEstates2025.Services.GoogleAuthService googleAuthService;

    // AGGIUNGI ANCHE QUESTO
    @MockitoBean
    private com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository utenteRepository;

    @MockitoBean
    private com.DietiEstates2025.DietiEstates2025.Repositories.AgenziaRepository agenziaRepository;

    @MockitoBean
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Test
    public void testRegistrazioneUtenteCorretta() throws Exception {
        com.DietiEstates2025.DietiEstates2025.Models.Utente saved = new com.DietiEstates2025.DietiEstates2025.Models.Utente();
        saved.setUsername("Antonio");
        saved.setRuolo("Agente immobiliare");

        Mockito.when(authService.registrazione(any())).thenReturn(saved);

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
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("Antonio"));
    }


    @Test
    public void testRegistrazioneUtenteErrata() throws Exception {
        Mockito.when(authService.registrazione(any())).thenThrow(new RuntimeException("Errore registrazione"));

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
                .andExpect(status().isBadRequest());
    }

}
