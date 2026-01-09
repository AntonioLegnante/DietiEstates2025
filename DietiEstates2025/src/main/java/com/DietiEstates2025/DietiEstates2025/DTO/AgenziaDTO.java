package com.DietiEstates2025.DietiEstates2025.DTO;

public class AgenziaDTO {
    private String nomeAgenzia;
    private String indirizzoAgenzia;
    private String cittaAgenzia;
    private String telefonoAgenzia;
    private String emailAgenzia;
    private String partitaIVA;

    // Costruttore vuoto
    public AgenziaDTO() {}

    // Getter e Setter
    public String getNomeAgenzia() {
        return nomeAgenzia;
    }

    public void setNomeAgenzia(String nomeAgenzia) {
        this.nomeAgenzia = nomeAgenzia;
    }

    public String getIndirizzoAgenzia() {
        return indirizzoAgenzia;
    }

    public void setIndirizzoAgenzia(String indirizzoAgenzia) {
        this.indirizzoAgenzia = indirizzoAgenzia;
    }

    public String getCittaAgenzia() {
        return cittaAgenzia;
    }

    public void setCittaAgenzia(String cittaAgenzia) {
        this.cittaAgenzia = cittaAgenzia;
    }

    public String getTelefonoAgenzia() {
        return telefonoAgenzia;
    }

    public void setTelefonoAgenzia(String telefonoAgenzia) {
        this.telefonoAgenzia = telefonoAgenzia;
    }

    public String getEmailAgenzia() {
        return emailAgenzia;
    }

    public void setEmailAgenzia(String emailAgenzia) {
        this.emailAgenzia = emailAgenzia;
    }

    public String getPartitaIVA() {
        return partitaIVA;
    }

    public void setPartitaIVA(String partitaIVA) {
        this.partitaIVA = partitaIVA;
    }
}