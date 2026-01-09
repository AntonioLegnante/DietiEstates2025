package com.DietiEstates2025.DietiEstates2025.DTO;

public class RegistrazioneResponse {
    private String message;
    private String username;
    private String ruolo;

    public RegistrazioneResponse(String message, String username, String ruolo) {
        this.message = message;
        this.username = username;
        this.ruolo = ruolo;
    }

    // Getter e Setter
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRuolo() {
        return ruolo;
    }

    public void setRuolo(String ruolo) {
        this.ruolo = ruolo;
    }
}