package com.DietiEstates2025.DietiEstates2025.DTO;

import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.StatoNegoziazione;

import java.util.List;
import java.util.stream.Collectors;

public class ChatDTO {

    private Integer chatId;
    private Integer utenteId;
    private String utenteNome;
    private Integer vendorId;
    private String vendorNome;
    private Integer immobileId;
    private String immobileTitolo;
    private StatoNegoziazione statoNegoziazione;
    private List<OffertaDTO> offerte;

    public ChatDTO(Chat chat) {
        this.chatId = chat.getChatId();
        this.utenteId = chat.getUtente().getId();
        this.utenteNome = chat.getUtente().getUsername();
        this.vendorId = chat.getVendorId().getId();
        this.vendorNome = chat.getVendorId().getUsername();
        this.immobileId = chat.getImmobileId().getId();
        this.immobileTitolo = chat.getImmobileId().getTitolo();
        this.statoNegoziazione = chat.getStatoNegoziazione();
        this.offerte = chat.getOfferte().stream()
                .map(OffertaDTO::new)
                .collect(Collectors.toList());
    }

    public ChatDTO(Chat chat, String currentUsername) {
        this(chat);
    }

    // Getters e Setters
    public Integer getChatId() {
        return chatId;
    }

    public void setChatId(Integer chatId) {
        this.chatId = chatId;
    }

    public Integer getUtenteId() {
        return utenteId;
    }

    public void setUtenteId(Integer utenteId) {
        this.utenteId = utenteId;
    }

    public String getUtenteNome() {
        return utenteNome;
    }

    public void setUtenteNome(String utenteNome) {
        this.utenteNome = utenteNome;
    }

    public Integer getVendorId() {
        return vendorId;
    }

    public void setVendorId(Integer vendorId) {
        this.vendorId = vendorId;
    }

    public String getVendorNome() {
        return vendorNome;
    }

    public void setVendorNome(String vendorNome) {
        this.vendorNome = vendorNome;
    }

    public Integer getImmobileId() {
        return immobileId;
    }

    public void setImmobileId(Integer immobileId) {
        this.immobileId = immobileId;
    }

    public String getImmobileTitolo() {
        return immobileTitolo;
    }

    public void setImmobileTitolo(String immobileTitolo) {
        this.immobileTitolo = immobileTitolo;
    }

    public StatoNegoziazione getStatoNegoziazione() {
        return statoNegoziazione;
    }

    public void setStatoNegoziazione(StatoNegoziazione statoNegoziazione) {
        this.statoNegoziazione = statoNegoziazione;
    }

    public List<OffertaDTO> getOfferte() {
        return offerte;
    }

    public void setOfferte(List<OffertaDTO> offerte) {
        this.offerte = offerte;
    }
}