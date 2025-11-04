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

    @Autowired
    private MessaggiRepository messaggiRepository;

    public void generateNewChat(String utente, String vendorId, Integer immobile) {

        Optional<Utente> user = utenteRepository.findByUsername(utente);
        Optional<Utente> venditore = utenteRepository.findByUsername(vendorId);
        Optional<Immobile> casaVendita = immobileRepository.findById(immobile);

        if (user.isPresent() && venditore.isPresent() &&  casaVendita.isPresent()) {
            Chat chat = new Chat(user.get(), venditore.get(), casaVendita.get());
            chatRepository.save(chat);
        }
        else{
            throw new IllegalArgumentException("Errore nella creazione della chat");
        }

    }

    public List<Messaggi> populateChat(Integer chatId){
        Optional<List<Messaggi>> storicoMessaggi = messaggiRepository.findByChatId(chatId);
        return storicoMessaggi.orElse(null);
    }

    public List<Chat> retrieveChatUser(Integer userId){
        Optional<List<Chat>> storicoChat = chatRepository.findByUtente(userId);
        return storicoChat.orElse(null);
    }

    public List<Chat> retrieveChatAgent(Integer vendorId){
        Optional<List<Chat>> storicoChat = chatRepository.findByVendorId(vendorId);
        return storicoChat.orElse(null);
    }

    public Chat expandChat(Integer chatId){
        Optional<Chat> chat = chatRepository.findById(chatId);
        chat.get().setMessaggi(populateChat(chatId));
        return chat.get();
    }





}
