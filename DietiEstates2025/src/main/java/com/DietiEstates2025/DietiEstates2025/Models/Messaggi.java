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

  /*  @Override
    public String toString() {
        return "Messaggi{" +
                "messageId=" + messageId +
                ", messageContent='" + messageContent + '\'' +
                ", chat=" + chat +
                '}';
    }*/

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
}
