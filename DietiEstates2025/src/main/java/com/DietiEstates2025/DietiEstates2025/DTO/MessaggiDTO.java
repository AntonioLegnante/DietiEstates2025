package com.DietiEstates2025.DietiEstates2025.DTO;

import com.DietiEstates2025.DietiEstates2025.Models.Messaggi;
import java.util.Objects;

public class MessaggiDTO {

    private String messageContent;
    private Integer senderId;

    public MessaggiDTO(Messaggi msg) {
        this.messageContent = msg.getMessageContent();
        // Ora prende il sender corretto dal messaggio
        this.senderId = msg.getSender() != null ? msg.getSender().getId() : null;
    }

    // Costruttore aggiuntivo per creare messaggi con senderId specifico
    public MessaggiDTO(String messageContent, Integer senderId) {
        this.messageContent = messageContent;
        this.senderId = senderId;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        MessaggiDTO that = (MessaggiDTO) o;
        return Objects.equals(messageContent, that.messageContent) && Objects.equals(senderId, that.senderId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(messageContent, senderId);
    }
}