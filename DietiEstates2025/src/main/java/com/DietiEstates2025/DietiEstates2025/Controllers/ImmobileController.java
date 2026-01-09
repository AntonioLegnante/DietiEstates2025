package com.DietiEstates2025.DietiEstates2025.Controllers;

import com.DietiEstates2025.DietiEstates2025.DTO.ImmobileDTO;
import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Services.ImmobileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/immobili")
@CrossOrigin(origins = "*")
public class ImmobileController {

    @Autowired
    private ImmobileService immobileService;

    /**
     * Crea un nuovo immobile con foto di copertina e gallery
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createImmobile(
            @RequestParam("file") MultipartFile file,  // Foto di copertina
            @RequestParam(value = "galleryImages", required = false) List<MultipartFile> galleryImages,  // NUOVO: Gallery images
            @RequestParam("titolo") String titolo,
            @RequestParam("descrizione") String descrizione,
            @RequestParam("prezzo") Double prezzo,
            @RequestParam("dimensione") String dimensione,
            @RequestParam("citta") String citta,
            @RequestParam("indirizzo") String indirizzo,
            @RequestParam("affitto") Boolean affitto,
            @RequestParam("vendita") Boolean vendita,
            @RequestParam("numeroStanze") Integer numeroStanze,
            @RequestParam("piano") String piano,
            @RequestParam("classeEnergetica") String classeEnergetica,
            @RequestParam("garage") Boolean garage,
            @RequestParam("numeroBagni")  Integer numeroBagni,
            Authentication authentication
    ) {
        System.out.println("Guarda quanti integrali!");
        String username = authentication.getName();
        System.out.println(username);
        System.out.println(numeroStanze);

        try {
            // Passa anche le gallery images al service
            Immobile immobile = immobileService.createImmobile(
                    titolo, descrizione, prezzo, dimensione, citta, indirizzo,
                    affitto, vendita, numeroStanze, piano, classeEnergetica, garage, numeroBagni, file, galleryImages, username
            );

            System.out.println("Immobile created! " + immobile.getUtente().getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(new ImmobileDTO(immobile));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Errore nella creazione dell'immobile: " + e.getMessage()));
        }
    }

    @GetMapping(value = "/ricerca")
    public ResponseEntity<List<ImmobileDTO>> getImmobiliDaRicerca(
            @RequestParam(value="localita") String localita,
            @RequestParam(value="minPrezzo", required = false) Double minPrezzo,
            @RequestParam(value="maxPrezzo", required = false) Double maxPrezzo,
            @RequestParam(value="affitta") Boolean affitta,
            @RequestParam(value="vendita") Boolean vendita,
            @RequestParam(value="numeroStanze", required = false) Integer numeroStanze,
            @RequestParam(value="dimensione", required = false) String dimensione,
            @RequestParam(value="piano", required = false) String piano,
            @RequestParam(value="classeEnergetica", required = false) String classeEnergetica,
            @RequestParam(value="numeroBagni", required = false) Integer numeroBagni
    ) {
        System.out.println("In ImmobileController Localita " + localita);
        System.out.println("In ImmobileController minPrezzo " + minPrezzo);
        System.out.println("In ImmobileController affitta " + affitta);
        System.out.println("In ImmobileController numeroStanze " + numeroStanze);
        System.out.println("In ImmobileController Dimensione " + dimensione);
        System.out.println("In ImmobileController Piano " + piano);

        List<Immobile> immobili = immobileService.applicaRicerca(localita, minPrezzo, maxPrezzo, affitta, vendita,
                numeroStanze, dimensione, piano, classeEnergetica, numeroBagni);
        return ResponseEntity.ok(immobili.stream().map(immobile -> new ImmobileDTO(immobile)).collect(Collectors.toList()));
    }

    // Response classes
    static class ErrorResponse {
        private String error;
        public ErrorResponse(String error) { this.error = error; }
        public String getError() { return error; }
    }

    static class SuccessResponse {
        private String message;
        public SuccessResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}