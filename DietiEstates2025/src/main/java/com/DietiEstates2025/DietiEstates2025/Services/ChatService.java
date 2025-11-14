package com.DietiEstates2025.DietiEstates2025.Services;


import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Models.Messaggi;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Repositories.ChatRepository;
import com.DietiEstates2025.DietiEstates2025.Repositories.ImmobileRepository;
import com.DietiEstates2025.DietiEstates2025.Repositories.MessaggiRepository;
import com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UtenteRepository  utenteRepository;

    @Autowired
    private ImmobileRepository immobileRepository;

    public Chat generateNewChat(String utente, String vendorId, Integer immobile) {

        Optional<Utente> user = utenteRepository.findByUsername(utente);
        Optional<Utente> venditore = utenteRepository.findByUsername(vendorId);
        Optional<Immobile> casaVendita = immobileRepository.findById(immobile);

        if (user.isPresent() && venditore.isPresent() &&  casaVendita.isPresent()) {

            Chat chat = chatEsistente(user.get(), venditore.get(), casaVendita.get());

            if(chat != null) {
                System.out.println("Chat esistente");
                return chat;
            }
            else {
                chat = new Chat(user.get(), venditore.get(), casaVendita.get());
                chatRepository.save(chat);
                return chat;
            }
        }
        else{
            throw new IllegalArgumentException("Errore nella creazione della chat");
        }

    }

    public List<Chat> retrieveChatUser(String username){
        Utente user = utenteRepository.findByUsername(username).get();
        Optional<List<Chat>> storicoChat = chatRepository.findByUtente_Id(user.getId());
        System.out.println(storicoChat.get());
        return storicoChat.orElse(null);
    }

    public List<Chat> retrieveChatAgent(String username){
        Utente user = utenteRepository.findByUsername(username).get();
        Optional<List<Chat>> storicoChat = chatRepository.findByVendorId_Id(user.getId());
        System.out.println(storicoChat.get());
        return storicoChat.orElse(null);
    }

    public Chat retrieveChat(Integer chatId){
        Optional<Chat> storicoChat = chatRepository.findById(chatId);
        return storicoChat.orElse(null);
    }

    public Chat chatEsistente(Utente utente, Utente vendorId, Immobile immobile){
        System.out.println("GGG");
        Optional<Chat> userChat = chatRepository.findChat(utente, vendorId, immobile);
        return userChat.orElse(null);

    }

    public void updateMessages(Integer chatId, String messaggio) {
        Optional<Chat> chat = chatRepository.findById(chatId);
        if (chat.isPresent()) {
            Messaggi msg = new Messaggi(chat.get(), messaggio);
            chat.get().aggiungiMessaggi(msg);
            chatRepository.save(chat.get());
            System.out.println(chat.get());
        }
    }

}
