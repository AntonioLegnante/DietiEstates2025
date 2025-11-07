package com.DietiEstates2025.DietiEstates2025.DTO;

import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.Messaggi;
import jakarta.persistence.*;

import java.util.Objects;

public class MessaggiDTO {

    private String messageContent;

    private Integer senderId;

    public MessaggiDTO(Messaggi msg) {
        this.messageContent = msg.getMessageContent();
        this.senderId = msg.getChat().getUtente().getId();
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
