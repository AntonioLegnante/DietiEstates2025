package com.DietiEstates2025.DietiEstates2025.DTO;

import com.DietiEstates2025.DietiEstates2025.Models.Offerta;
import com.DietiEstates2025.DietiEstates2025.Models.StatoOfferta;
import java.time.LocalDateTime;

public class OffertaDTO {

    private Integer offertaId;
    private Integer chatId;
    private Integer offerenteId;
    private String offerenteNome;
    private Double importoOfferto;
    private StatoOfferta stato;
    private String note;
    private LocalDateTime dataCreazione;
    private LocalDateTime dataRisposta;
    private String motivoRifiuto;

    public OffertaDTO(Offerta offerta) {
        this.offertaId = offerta.getOffertaId();
        this.chatId = offerta.getChat().getChatId();
        this.offerenteId = offerta.getOfferente().getId();
        this.offerenteNome = offerta.getOfferente().getUsername();
        this.importoOfferto = offerta.getImportoOfferto();
        this.stato = offerta.getStato();
        this.note = offerta.getNote();
        this.dataCreazione = offerta.getDataCreazione();
        this.dataRisposta = offerta.getDataRisposta();
        this.motivoRifiuto = offerta.getMotivoRifiuto();
    }

    // Getters e Setters
    public Integer getOffertaId() {
        return offertaId;
    }

    public void setOffertaId(Integer offertaId) {
        this.offertaId = offertaId;
    }

    public Integer getChatId() {
        return chatId;
    }

    public void setChatId(Integer chatId) {
        this.chatId = chatId;
    }

    public Integer getOfferenteId() {
        return offerenteId;
    }

    public void setOfferenteId(Integer offerenteId) {
        this.offerenteId = offerenteId;
    }

    public String getOfferenteNome() {
        return offerenteNome;
    }

    public void setOfferenteNome(String offerenteNome) {
        this.offerenteNome = offerenteNome;
    }

    public Double getImportoOfferto() {
        return importoOfferto;
    }

    public void setImportoOfferto(Double importoOfferto) {
        this.importoOfferto = importoOfferto;
    }

    public StatoOfferta getStato() {
        return stato;
    }

    public void setStato(StatoOfferta stato) {
        this.stato = stato;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getDataCreazione() {
        return dataCreazione;
    }

    public void setDataCreazione(LocalDateTime dataCreazione) {
        this.dataCreazione = dataCreazione;
    }

    public LocalDateTime getDataRisposta() {
        return dataRisposta;
    }

    public void setDataRisposta(LocalDateTime dataRisposta) {
        this.dataRisposta = dataRisposta;
    }

    public String getMotivoRifiuto() {
        return motivoRifiuto;
    }

    public void setMotivoRifiuto(String motivoRifiuto) {
        this.motivoRifiuto = motivoRifiuto;
    }
}