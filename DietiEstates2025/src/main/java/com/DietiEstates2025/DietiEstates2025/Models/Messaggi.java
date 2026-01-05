package com.DietiEstates2025.DietiEstates2025.Models;

import jakarta.persistence.*;

@Entity
public class Messaggi {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "message_seq")
    @SequenceGenerator(name = "message_seq", sequenceName = "message_sequence", allocationSize = 1)
    private Integer messageId;

    @Column(nullable = false)
    private String messageContent;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chat chat;

    // NUOVO CAMPO: chi ha inviato il messaggio
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private Utente sender;

    public Messaggi(Chat chat, String messageContent, Utente sender) {
        this.chat = chat;
        this.messageContent = messageContent;
        this.sender = sender;
    }

    public Messaggi() {

    }

    public Integer getMessageId() {
        return messageId;
    }

    public void setMessageId(Integer messageId) {
        this.messageId = messageId;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public Chat getChat() {
        return chat;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public Utente getSender() {
        return sender;
    }

    public void setSender(Utente sender) {
        this.sender = sender;
    }
}