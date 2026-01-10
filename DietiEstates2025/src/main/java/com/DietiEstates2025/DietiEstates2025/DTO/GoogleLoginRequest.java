package com.DietiEstates2025.DietiEstates2025.DTO;

import com.DietiEstates2025.DietiEstates2025.DTO.AgenziaDTO;

public class GoogleLoginRequest {
    private String token;
    private String ruolo;  // Solo per registrazione
    private AgenziaDTO agenzia;  // Solo per gestori

    // Costruttori
    public GoogleLoginRequest() {}

    public GoogleLoginRequest(String token) {
        this.token = token;
    }

    public GoogleLoginRequest(String token, String ruolo, AgenziaDTO agenzia) {
        this.token = token;
        this.ruolo = ruolo;
        this.agenzia = agenzia;
    }

    // Getter e Setter
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRuolo() {
        return ruolo;
    }

    public void setRuolo(String ruolo) {
        this.ruolo = ruolo;
    }

    public AgenziaDTO getAgenzia() {
        return agenzia;
    }

    public void setAgenzia(AgenziaDTO agenzia) {
        this.agenzia = agenzia;
    }
}