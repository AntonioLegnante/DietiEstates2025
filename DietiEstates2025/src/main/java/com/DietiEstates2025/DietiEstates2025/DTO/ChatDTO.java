package com.DietiEstates2025.DietiEstates2025.DTO;

import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Models.Messaggi;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class ChatDTO {

    private Integer chatId;

    private List<MessaggiDTO> messaggi = new ArrayList<>();

    private Integer senderId;

    private Integer receiverId;

    private Integer immobileId;

    public ChatDTO(Chat chat) {
        this.chatId = chat.getChatId();
        this.messaggi = chat.getMessaggi().stream().map(MessaggiDTO::new).collect(Collectors.toList());
        this.senderId = chat.getUtente().getId();
        this.receiverId = chat.getVendorId().getId();
        this.immobileId = chat.getImmobileId().getId();
    }

    public Integer getChatId() {
        return chatId;
    }

    public void setChatId(Integer chatId) {
        this.chatId = chatId;
    }

    public List<MessaggiDTO> getMessaggi() {
        return messaggi;
    }

    public void setMessaggi(List<MessaggiDTO> messaggi) {
        this.messaggi = messaggi;
    }

    public Integer getSenderId() {
        return senderId;
    }

    public void setSenderId(Integer senderId) {
        this.senderId = senderId;
    }

    public Integer getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }

    public Integer getImmobileId() {
        return immobileId;
    }

    public void setImmobileId(Integer immobileId) {
        this.immobileId = immobileId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ChatDTO chatDTO = (ChatDTO) o;
        return Objects.equals(chatId, chatDTO.chatId) && Objects.equals(messaggi, chatDTO.messaggi) && Objects.equals(senderId, chatDTO.senderId) && Objects.equals(receiverId, chatDTO.receiverId) && Objects.equals(immobileId, chatDTO.immobileId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chatId, messaggi, senderId, receiverId, immobileId);
    }
}
