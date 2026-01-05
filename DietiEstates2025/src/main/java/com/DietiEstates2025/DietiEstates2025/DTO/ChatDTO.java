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
    private String usernameSender;
    private Integer receiverId;
    private String usernameReceiver;
    private Integer immobileId;

    // Costruttore normale (per quando il cliente apre la chat)
    public ChatDTO(Chat chat) {
        this.chatId = chat.getChatId();
        this.messaggi = chat.getMessaggi().stream().map(MessaggiDTO::new).collect(Collectors.toList());
        this.usernameSender = chat.getUtente().getUsername();
        this.usernameReceiver = chat.getVendorId().getUsername();
        this.senderId = chat.getUtente().getId();
        this.receiverId = chat.getVendorId().getId();
        this.immobileId = chat.getImmobileId().getId();
    }

    // Costruttore che determina chi è il sender in base all'utente loggato
    public ChatDTO(Chat chat, String currentUsername) {
        this.chatId = chat.getChatId();
        this.messaggi = chat.getMessaggi().stream().map(MessaggiDTO::new).collect(Collectors.toList());
        this.immobileId = chat.getImmobileId().getId();

        // Se l'utente corrente è il vendor, inverti sender e receiver
        if (chat.getVendorId().getUsername().equals(currentUsername)) {
            this.senderId = chat.getVendorId().getId();
            this.usernameSender = chat.getVendorId().getUsername();
            this.receiverId = chat.getUtente().getId();
            this.usernameReceiver = chat.getUtente().getUsername();
        } else {
            this.senderId = chat.getUtente().getId();
            this.usernameSender = chat.getUtente().getUsername();
            this.receiverId = chat.getVendorId().getId();
            this.usernameReceiver = chat.getVendorId().getUsername();
        }
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

    public String getUsernameSender() {
        return usernameSender;
    }

    public void setUsernameSender(String usernameSender) {
        this.usernameSender = usernameSender;
    }

    public String getUsernameReceiver() {
        return usernameReceiver;
    }

    public void setUsernameReceiver(String usernameReceiver) {
        this.usernameReceiver = usernameReceiver;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        ChatDTO chatDTO = (ChatDTO) o;
        return Objects.equals(chatId, chatDTO.chatId) && Objects.equals(messaggi, chatDTO.messaggi) && Objects.equals(senderId, chatDTO.senderId) && Objects.equals(usernameSender, chatDTO.usernameSender) && Objects.equals(receiverId, chatDTO.receiverId) && Objects.equals(usernameReceiver, chatDTO.usernameReceiver) && Objects.equals(immobileId, chatDTO.immobileId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chatId, messaggi, senderId, usernameSender, receiverId, usernameReceiver, immobileId);
    }
}
