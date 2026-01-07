package com.DietiEstates2025.DietiEstates2025.Models;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chat_seq")
    @SequenceGenerator(name = "chat_seq", sequenceName = "chat_sequence", allocationSize = 1)
    private Integer chatId;

    // 🔹 OFFERTE
    @OneToMany(
            mappedBy = "chat",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    private List<Offerta> offerte = new ArrayList<>();

    // 🔹 MESSAGGI (opzionali)
    @OneToMany(
            mappedBy = "chat",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    private List<Messaggi> messaggi = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "utente_id", nullable = false)
    private Utente utente;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Utente vendorId;

    @ManyToOne
    @JoinColumn(name = "immobile_id", nullable = false)
    private Immobile immobileId;

    @Enumerated(EnumType.STRING)
    private StatoNegoziazione statoNegoziazione = StatoNegoziazione.APERTA;

    public Chat() {}

    public Chat(Utente utente, Utente venditore, Immobile immobile) {
        this.utente = utente;
        this.vendorId = venditore;
        this.immobileId = immobile;
    }

    // 🔥 FIX BIDIREZIONALE
    public void aggiungiOfferta(Offerta offerta) {
        offerte.add(offerta);
        offerta.setChat(this);
    }

    // ===== GETTERS & SETTERS =====

    public Integer getChatId() { return chatId; }
    public void setChatId(Integer chatId) { this.chatId = chatId; }

    public List<Offerta> getOfferte() { return offerte; }
    public void setOfferte(List<Offerta> offerte) { this.offerte = offerte; }

    public List<Messaggi> getMessaggi() { return messaggi; }
    public void setMessaggi(List<Messaggi> messaggi) { this.messaggi = messaggi; }

    public Utente getUtente() { return utente; }
    public void setUtente(Utente utente) { this.utente = utente; }

    public Utente getVendorId() { return vendorId; }
    public void setVendorId(Utente vendorId) { this.vendorId = vendorId; }

    public Immobile getImmobileId() { return immobileId; }
    public void setImmobileId(Immobile immobileId) { this.immobileId = immobileId; }

    public StatoNegoziazione getStatoNegoziazione() { return statoNegoziazione; }
    public void setStatoNegoziazione(StatoNegoziazione statoNegoziazione) {
        this.statoNegoziazione = statoNegoziazione;
    }
}
