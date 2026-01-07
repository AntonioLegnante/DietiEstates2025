package com.DietiEstates2025.DietiEstates2025.Controllers;

import com.DietiEstates2025.DietiEstates2025.DTO.ChatDTO;
import com.DietiEstates2025.DietiEstates2025.DTO.OffertaDTO;
import com.DietiEstates2025.DietiEstates2025.Models.Chat;
import com.DietiEstates2025.DietiEstates2025.Models.Offerta;
import com.DietiEstates2025.DietiEstates2025.Services.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/retrieveChatsUser")
    public ResponseEntity<List<ChatDTO>> retrieveChats(@RequestParam("user") String username) {
        List<Chat> chats = chatService.retrieveChatUser(username);
        List<ChatDTO> chatsDTO = chats.stream().map(ChatDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(chatsDTO);
    }

    @GetMapping("/retrieveChatsAgent")
    public ResponseEntity<List<ChatDTO>> retrieveChatsAgent(@RequestParam("user") String username) {
        List<Chat> chats = chatService.retrieveChatAgent(username);
        List<ChatDTO> chatsDTO = chats.stream().map(ChatDTO::new).collect(Collectors.toList());
        return ResponseEntity.ok(chatsDTO);
    }

    @GetMapping("/openChat")
    public ResponseEntity<ChatDTO> openChat(
            @RequestParam String otherUser,
            @RequestParam Integer immobile,
            Authentication authentication) {

        String currentUsername = authentication.getName();
        System.out.println("=== OPEN CHAT ===");
        System.out.println("Current user (autenticato): " + currentUsername);
        System.out.println("Other user (parametro): " + otherUser);
        System.out.println("Immobile: " + immobile);

        Chat chat = chatService.findOrCreateChat(currentUsername, otherUser, immobile);
        ChatDTO chatDTO = new ChatDTO(chat, currentUsername);

        return ResponseEntity.ok(chatDTO);
    }

    @PostMapping("/makeOffer")
    public ResponseEntity<OffertaDTO> makeOffer(
            @RequestParam Integer chatId,
            @RequestParam Double importo,
            @RequestParam(required = false) String note,
            Authentication authentication) {

        String username = authentication.getName();
        Offerta offerta = chatService.creaOfferta(chatId, importo, note, username);

        if (offerta != null) {
            return ResponseEntity.ok(new OffertaDTO(offerta));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @PostMapping("/acceptOffer")
    public ResponseEntity<OffertaDTO> acceptOffer(
            @RequestParam Integer offertaId,
            Authentication authentication) {

        Offerta offerta = chatService.accettaOfferta(offertaId, authentication.getName());

        if (offerta != null) {
            return ResponseEntity.ok(new OffertaDTO(offerta));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PostMapping("/rejectOffer")
    public ResponseEntity<OffertaDTO> rejectOffer(
            @RequestParam Integer offertaId,
            @RequestParam(required = false) String motivo,
            Authentication authentication) {

        Offerta offerta = chatService.rifiutaOfferta(offertaId, motivo, authentication.getName());

        if (offerta != null) {
            return ResponseEntity.ok(new OffertaDTO(offerta));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @PostMapping("/counterOffer")
    public ResponseEntity<OffertaDTO> counterOffer(
            @RequestParam Integer offertaId,
            @RequestParam Double nuovoImporto,
            @RequestParam(required = false) String note,
            Authentication authentication) {

        Offerta controfferta = chatService.creaControfferta(offertaId, nuovoImporto, note, authentication.getName());

        if (controfferta != null) {
            return ResponseEntity.ok(new OffertaDTO(controfferta));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping("/getOffers")
    public ResponseEntity<List<OffertaDTO>> getOffers(@RequestParam Integer chatId) {
        List<Offerta> offerte = chatService.getOfferteByChatId(chatId);
        List<OffertaDTO> offerteDTO = offerte.stream()
                .map(OffertaDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(offerteDTO);
    }
}