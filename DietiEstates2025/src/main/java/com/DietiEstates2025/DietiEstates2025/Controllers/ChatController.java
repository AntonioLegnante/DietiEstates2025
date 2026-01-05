package com.DietiEstates2025.DietiEstates2025.Controllers;

import com.DietiEstates2025.DietiEstates2025.DTO.ChatDTO;
import com.DietiEstates2025.DietiEstates2025.DTO.MessaggiDTO;
import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.Messaggi;
import com.DietiEstates2025.DietiEstates2025.Services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/retrieveChatsUser")
    public ResponseEntity<List<ChatDTO>> retrieveChats(@RequestParam("user") String username, Authentication authentication) {
        System.out.println(" prova bella " + username);
        List<Chat> chats = chatService.retrieveChatUser(username);
        List<ChatDTO> chatsDTO = chats.stream().map(ChatDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(chatsDTO);
    }

    @GetMapping("/retrieveChatsAgent")
    public ResponseEntity<List<ChatDTO>> retrieveChatsAgent(@RequestParam("user") String username, Authentication authentication) {
        System.out.println(" prova bella " + username);
        List<Chat> chats = chatService.retrieveChatAgent(username);
        List<ChatDTO> chatsDTO = chats.stream().map(ChatDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(chatsDTO);
    }

    @GetMapping("/retrieveChat")
    public ResponseEntity<Chat> retrieveChatFromId(@RequestParam Integer chatId, Authentication authentication) {
        return ResponseEntity.ok(chatService.retrieveChat(chatId));
    }

    @GetMapping("/openChat")
    public ResponseEntity<ChatDTO> openChat(
            @RequestParam String user,
            @RequestParam String vendor,
            @RequestParam Integer immobile,
            Authentication authentication) {
        System.out.println("sono entrato");
        Chat chat = chatService.generateNewChat(user, vendor, immobile);
        System.out.println(chat);

        // Passa l'username corrente per determinare il senderId corretto
        String currentUsername = authentication.getName();
        ChatDTO chatDTO = new ChatDTO(chat, currentUsername);

        return ResponseEntity.ok(chatDTO);
    }

    @GetMapping("/addMessage")
    public ResponseEntity<MessaggiDTO> sendMessage(
            @RequestParam Integer chatId,
            @RequestParam String messaggio,
            Authentication authentication) {

        String username = authentication.getName(); // ⚠️ Questo deve essere corretto
        System.out.println("DEBUG: Username autenticato = " + username); // Aggiungi questo log
        Messaggi msg = chatService.updateMessages(chatId, messaggio, username);

        if (msg != null) {
            MessaggiDTO messageDTO = new MessaggiDTO(msg);
            System.out.println("DEBUG: Messaggio creato con senderId = " + messageDTO.getSenderId()); // E questo
            return ResponseEntity.ok(messageDTO);
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}