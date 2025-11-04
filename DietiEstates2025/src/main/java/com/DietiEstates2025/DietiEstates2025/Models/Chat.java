package com.DietiEstates2025.DietiEstates2025.Models;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chat_seq")
    @SequenceGenerator(name = "chat_seq", sequenceName = "chat_sequence", allocationSize = 1)
    private Integer chatId;


    public List<Messaggi> getMessaggi() {
        return messaggi;
    }

    public void setMessaggi(List<Messaggi> messaggi) {
        this.messaggi = messaggi;
    }

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "chat")
    private List<Messaggi> messaggi;

    @ManyToOne
    @JoinColumn(name = "utente_id", nullable = false)
    private Utente utente;

    @ManyToOne
    @JoinColumn(name = "vendor_id", nullable = false)
    private Utente vendorId;

    @ManyToOne
    @JoinColumn(name = "immobile_id", nullable = false)
    private Immobile immobileId;



    public Chat(Utente utente, Utente venditore, Immobile immobile ) {
        this.utente = utente;
        this.vendorId = venditore;
        this.immobileId = immobile;
    }

    public Chat() {

    }
}
