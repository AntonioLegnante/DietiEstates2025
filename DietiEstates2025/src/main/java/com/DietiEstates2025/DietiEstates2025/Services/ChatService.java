package com.DietiEstates2025.DietiEstates2025.Services;

import com.DietiEstates2025.DietiEstates2025.Models.*;
import com.DietiEstates2025.DietiEstates2025.Repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private ImmobileRepository immobileRepository;

    @Autowired
    private OffertaRepository offertaRepository;

    @Transactional
    public Chat findOrCreateChat(String currentUsername, String otherUsername, Integer immobileId) {
        System.out.println("=== FIND OR CREATE CHAT ===");

        Optional<Utente> currentUserOpt = utenteRepository.findByUsername(currentUsername);
        Optional<Utente> otherUserOpt = utenteRepository.findByUsername(otherUsername);
        Optional<Immobile> immobileOpt = immobileRepository.findById(immobileId);

        if (!currentUserOpt.isPresent() || !otherUserOpt.isPresent() || !immobileOpt.isPresent()) {
            throw new IllegalArgumentException("Utenti o immobile non trovati");
        }

        Utente currentUser = currentUserOpt.get();
        Utente otherUser = otherUserOpt.get();
        Immobile immobile = immobileOpt.get();

        System.out.println("Current user: " + currentUser.getUsername() + " (ID: " + currentUser.getId() + ", Ruolo: " + currentUser.getRuolo() + ")");
        System.out.println("Other user: " + otherUser.getUsername() + " (ID: " + otherUser.getId() + ", Ruolo: " + otherUser.getRuolo() + ")");

        // ✅ FIX: Se sono la stessa persona, cerca la chat per quell'immobile
        if (currentUser.getId().equals(otherUser.getId())) {
            System.out.println("⚠️ WARNING: currentUser == otherUser!");
            System.out.println("Cerco chat esistente per immobile #" + immobileId);

            // Cerca qualsiasi chat per questo immobile dove currentUser è coinvolto
            Optional<Chat> chatByImmobile = chatRepository.findByImmobileId_IdAndVendorId_Id(immobileId, currentUser.getId());

            if (chatByImmobile.isPresent()) {
                Chat chat = chatByImmobile.get();
                System.out.println("✅ CHAT TROVATA - ID: " + chat.getChatId());
                System.out.println("   Utente: " + chat.getUtente().getUsername());
                System.out.println("   Vendor: " + chat.getVendorId().getUsername());
                chat.getOfferte().size(); // Forza caricamento
                return chat;
            }

            // Se non trovata, cerca anche come utente
            chatByImmobile = chatRepository.findByImmobileId_IdAndUtente_Id(immobileId, currentUser.getId());
            if (chatByImmobile.isPresent()) {
                Chat chat = chatByImmobile.get();
                System.out.println("✅ CHAT TROVATA (come utente) - ID: " + chat.getChatId());
                System.out.println("   Utente: " + chat.getUtente().getUsername());
                System.out.println("   Vendor: " + chat.getVendorId().getUsername());
                chat.getOfferte().size();
                return chat;
            }

            throw new IllegalArgumentException("Impossibile trovare la chat: currentUser e otherUser sono uguali");
        }

        // Cerca chat esistente (logica normale)
        Optional<Chat> existingChat = chatRepository.findChat(currentUser, otherUser, immobile);

        if (existingChat.isPresent()) {
            Chat chat = existingChat.get();
            System.out.println("CHAT TROVATA - ID: " + chat.getChatId());
            chat.getOfferte().size();
            return chat;
        }

        // Crea nuova chat - determina chi è user e chi è vendor in base al ruolo
        Utente utente, vendor;

        if (isAgent(currentUser)) {
            vendor = currentUser;
            utente = otherUser;
            System.out.println("Current user è AGENTE -> vendor=" + vendor.getUsername() + ", utente=" + utente.getUsername());
        } else if (isAgent(otherUser)) {
            vendor = otherUser;
            utente = currentUser;
            System.out.println("Other user è AGENTE -> vendor=" + vendor.getUsername() + ", utente=" + utente.getUsername());
        } else {
            String agenteImmobile = immobile.getUtente().getUsername();
            System.out.println("Nessuno è agente, uso agente immobile: " + agenteImmobile);

            if (currentUser.getUsername().equals(agenteImmobile)) {
                vendor = currentUser;
                utente = otherUser;
            } else {
                vendor = otherUser;
                utente = currentUser;
            }
        }

        Chat newChat = new Chat(utente, vendor, immobile);
        chatRepository.save(newChat);
        System.out.println("NUOVA CHAT CREATA - ID: " + newChat.getChatId());

        return newChat;
    }

    private boolean isAgent(Utente user) {
        return user.getRuolo() != null &&
                (user.getRuolo().equalsIgnoreCase("agente immobiliare") ||
                        user.getRuolo().toLowerCase().contains("agente"));
    }

    @Transactional(readOnly = true)
    public List<Chat> retrieveChatUser(String username) {
        Utente user = utenteRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));
        List<Chat> chats = chatRepository.findByUtente_Id(user.getId()).orElse(List.of());

        chats.forEach(chat -> chat.getOfferte().size());

        return chats;
    }

    @Transactional(readOnly = true)
    public List<Chat> retrieveChatAgent(String username) {
        Utente user = utenteRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));
        List<Chat> chats = chatRepository.findByVendorId_Id(user.getId()).orElse(List.of());

        chats.forEach(chat -> chat.getOfferte().size());

        return chats;
    }

    @Transactional
    public Offerta creaOfferta(Integer chatId, Double importo, String note, String username) {
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        Optional<Utente> offerenteOpt = utenteRepository.findByUsername(username);

        if (chatOpt.isPresent() && offerenteOpt.isPresent()) {
            Chat chat = chatOpt.get();
            Utente offerente = offerenteOpt.get();

            if (!chat.getUtente().equals(offerente) && !chat.getVendorId().equals(offerente)) {
                throw new IllegalArgumentException("Non autorizzato a fare offerte in questa chat");
            }

            Offerta offerta = new Offerta(chat, offerente, importo, note);
            chat.aggiungiOfferta(offerta);
            chatRepository.save(chat);

            return offerta;
        }
        return null;
    }

    @Transactional
    public Offerta accettaOfferta(Integer offertaId, String username) {
        Offerta offerta = offertaRepository.findById(offertaId)
                .orElseThrow(() -> new IllegalArgumentException("Offerta non trovata"));

        Utente utente = utenteRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));

        Chat chat = offerta.getChat();

        // ✅ FIX
        if (!chat.getVendorId().getId().equals(utente.getId())) {
            throw new IllegalArgumentException("Solo l'agente può accettare l'offerta");
        }

        offerta.setStato(StatoOfferta.ACCETTATA);
        offerta.setDataRisposta(LocalDateTime.now());

        // 🔥 rifiuta automaticamente le altre
        for (Offerta o : chat.getOfferte()) {
            if (!o.getOffertaId().equals(offerta.getOffertaId())) {
                o.setStato(StatoOfferta.RIFIUTATA);
            }
        }

        chat.setStatoNegoziazione(StatoNegoziazione.CHIUSA_ACCETTATA);

        return offertaRepository.save(offerta);
    }


    @Transactional
    public Offerta rifiutaOfferta(Integer offertaId, String motivo, String username) {
        Offerta offerta = offertaRepository.findById(offertaId)
                .orElseThrow(() -> new IllegalArgumentException("Offerta non trovata"));

        Utente utente = utenteRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));

        Chat chat = offerta.getChat();

        // ✅ FIX
        if (!chat.getVendorId().getId().equals(utente.getId())) {
            throw new IllegalArgumentException("Solo l'agente può rifiutare l'offerta");
        }

        offerta.setStato(StatoOfferta.RIFIUTATA);
        offerta.setMotivoRifiuto(motivo);
        offerta.setDataRisposta(LocalDateTime.now());

        return offertaRepository.save(offerta);
    }


    @Transactional
    public Offerta creaControfferta(Integer offertaId, Double nuovoImporto, String note, String username) {
        Offerta offertaOriginale = offertaRepository.findById(offertaId)
                .orElseThrow(() -> new IllegalArgumentException("Offerta non trovata"));

        Utente utente = utenteRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Utente non trovato"));

        Chat chat = offertaOriginale.getChat();

        // ✅ FIX
        if (!chat.getVendorId().getId().equals(utente.getId())) {
            throw new IllegalArgumentException("Solo l'agente può fare controofferte");
        }

        offertaOriginale.setStato(StatoOfferta.CONTROFFERTA);
        offertaOriginale.setDataRisposta(LocalDateTime.now());

        Offerta controfferta = new Offerta(chat, utente, nuovoImporto, note);
        chat.aggiungiOfferta(controfferta);

        chatRepository.save(chat);
        return controfferta;
    }


    @Transactional(readOnly = true)
    public List<Offerta> getOfferteByChatId(Integer chatId) {
        System.out.println("=== DEBUG getOfferteByChatId ===");
        System.out.println("ChatId richiesto: " + chatId);

        List<Offerta> offerte = offertaRepository.findByChat_ChatIdOrderByDataCreazioneDesc(chatId);

        System.out.println("Numero offerte trovate: " + offerte.size());

        for (Offerta o : offerte) {
            System.out.println("Offerta ID: " + o.getOffertaId());
            System.out.println("Importo: " + o.getImportoOfferto());
            System.out.println("Offerente: " + (o.getOfferente() != null ? o.getOfferente().getUsername() : "null"));
            System.out.println("Stato: " + o.getStato());
            System.out.println("Chat ID: " + (o.getChat() != null ? o.getChat().getChatId() : "null"));
            System.out.println("---");
        }

        return offerte;
    }
}