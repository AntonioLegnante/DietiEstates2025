package com.DietiEstates2025.DietiEstates2025.DTO;

public class RegistrazioneRequest {
    private String username;
    private String email;
    private String password;
    private String numeroDiTelefono;
    private String ruolo;
    private AgenziaDTO agenzia; // Opzionale, solo per gestori

    // Costruttore vuoto
    public RegistrazioneRequest() {}

    // Getter e Setter
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNumeroDiTelefono() {
        return numeroDiTelefono;
    }

    public void setNumeroDiTelefono(String numeroDiTelefono) {
        this.numeroDiTelefono = numeroDiTelefono;
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