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

    public Messaggi(Chat chat,  String messageContent) {
        this.chat = chat;
        this.messageContent = messageContent;
    }


    public Messaggi() {

    }


}
