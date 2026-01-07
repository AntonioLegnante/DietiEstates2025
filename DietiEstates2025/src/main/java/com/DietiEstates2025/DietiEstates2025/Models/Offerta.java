package com.DietiEstates2025.DietiEstates2025.Models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Offerta {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "offerta_seq")
    @SequenceGenerator(name = "offerta_seq", sequenceName = "offerta_sequence", allocationSize = 1)
    private Integer offertaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offerente_id", nullable = false)
    private Utente offerente;

    @Column(nullable = false)
    private Double importoOfferto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatoOfferta stato = StatoOfferta.IN_ATTESA;

    private String note;

    @Column(nullable = false)
    private LocalDateTime dataCreazione;

    private LocalDateTime dataRisposta;
    private String motivoRifiuto;

    @PrePersist
    protected void onCreate() {
        dataCreazione = LocalDateTime.now();
    }

    public Offerta() {}

    public Offerta(Chat chat, Utente offerente, Double importoOfferto, String note) {
        this.chat = chat;
        this.offerente = offerente;
        this.importoOfferto = importoOfferto;
        this.note = note;
    }

    // ===== GETTERS & SETTERS =====

    public Integer getOffertaId() { return offertaId; }
    public void setOffertaId(Integer offertaId) { this.offertaId = offertaId; }

    public Chat getChat() { return chat; }
    public void setChat(Chat chat) { this.chat = chat; }

    public Utente getOfferente() { return offerente; }
    public void setOfferente(Utente offerente) { this.offerente = offerente; }

    public Double getImportoOfferto() { return importoOfferto; }
    public void setImportoOfferto(Double importoOfferto) { this.importoOfferto = importoOfferto; }

    public StatoOfferta getStato() { return stato; }
    public void setStato(StatoOfferta stato) { this.stato = stato; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getDataCreazione() { return dataCreazione; }
    public LocalDateTime getDataCreazione(LocalDateTime dataCreazione) {
        return dataCreazione;
    }

    public LocalDateTime getDataRisposta() { return dataRisposta; }
    public void setDataRisposta(LocalDateTime dataRisposta) {
        this.dataRisposta = dataRisposta;
    }

    public String getMotivoRifiuto() { return motivoRifiuto; }
    public void setMotivoRifiuto(String motivoRifiuto) {
        this.motivoRifiuto = motivoRifiuto;
    }
}
