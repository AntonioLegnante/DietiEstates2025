package com.DietiEstates2025.DietiEstates2025.Models;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chat_seq")
    @SequenceGenerator(name = "chat_seq", sequenceName = "chat_sequence", allocationSize = 1)
    private Integer chatId;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "chat")
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

    public Integer getChatId() {
        return chatId;
    }

    public void setChatId(Integer chatId) {
        this.chatId = chatId;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }

    public Utente getVendorId() {
        return vendorId;
    }

    public void setVendorId(Utente vendorId) {
        this.vendorId = vendorId;
    }

    public Immobile getImmobileId() {
        return immobileId;
    }

    public void setImmobileId(Immobile immobileId) {
        this.immobileId = immobileId;
    }

    public List<Messaggi> getMessaggi() {
        return messaggi;
    }

    public void setMessaggi(List<Messaggi> messaggi) {
        this.messaggi = messaggi;
    }

    public Chat(Utente utente, Utente venditore, Immobile immobile ) {
        this.utente = utente;
        this.vendorId = venditore;
        this.immobileId = immobile;
    }

    public Chat() {

    }

    public void aggiungiMessaggi(Messaggi messaggio){
        messaggi.add(messaggio);
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Chat chat = (Chat) o;
        return Objects.equals(chatId, chat.chatId) && Objects.equals(messaggi, chat.messaggi) && Objects.equals(utente, chat.utente) && Objects.equals(vendorId, chat.vendorId) && Objects.equals(immobileId, chat.immobileId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chatId, messaggi, utente, vendorId, immobileId);
    }

    @Override
    public String toString() {
        return "Chat{" +
                "chatId=" + chatId +
                ", messaggi=" + messaggi +
                ", utente=" + utente +
                ", vendorId=" + vendorId +
                ", immobileId=" + immobileId +
                '}';
    }
}
