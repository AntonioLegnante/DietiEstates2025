package com.DietiEstates2025.DietiEstates2025.Controllers;

import com.DietiEstates2025.DietiEstates2025.DTO.ChatDTO;
import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/retrieveChatsUser")
    public ResponseEntity<List<Chat>> retrieveChats(@RequestParam Integer userId, Authentication authentication) {
        return ResponseEntity.ok(chatService.retrieveChatUser(userId));
    }

    @GetMapping("/retrieveChatsAgent")
    public ResponseEntity<List<ChatDTO>> retrieveChatsAgent(@RequestParam("user") String username, Authentication authentication) {
        System.out.println(" prova bella " + username);
        List<Chat> chats = chatService.retrieveChatAgent(username);
        List<ChatDTO> chatsDTO = chats.stream().map(ChatDTO::new).collect(Collectors.toList());
       // return ResponseEntity.ok(chatDTO);
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
        ChatDTO chatDTO = new ChatDTO(chat);
        return ResponseEntity.ok(chatDTO);
    }

    @GetMapping("/addMessage")
    public ResponseEntity<?> sendMessage(
            @RequestParam Integer chatId,
            @RequestParam String messaggio,
            Authentication authentication) {
        chatService.updateMessages(chatId, messaggio);
        return ResponseEntity.ok("");
    }
}
