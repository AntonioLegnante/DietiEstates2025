package com.DietiEstates2025.DietiEstates2025.Controllers;

import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Services.ImmobileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/immobili")
@CrossOrigin(origins = "*")
public class ImmobileController {

    @Autowired
    private ImmobileService immobileService;

    /**
     * Crea un nuovo immobile
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createImmobile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("titolo") String titolo,
            @RequestParam("descrizione") String descrizione,
            @RequestParam("prezzo") Double prezzo,
            @RequestParam("dimensione") String dimensione,
            @RequestParam("citta") String citta,
            @RequestParam("indirizzo") String indirizzo
    ) {
        System.out.println("Guarda quanti integrali!");
        try {
            Immobile immobile = immobileService.createImmobile(titolo, descrizione, prezzo, dimensione, citta, indirizzo, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(immobile);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Errore nella creazione dell'immobile: " + e.getMessage()));
        }
    }

    /**
     * Ottieni tutti gli immobili
     */
  /*  @GetMapping
    public ResponseEntity<List<Immobile>> getAllImmobili() {
        List<Immobile> immobili = immobileService.findAll();
        return ResponseEntity.ok(immobili);
    }
*/

    @GetMapping(value = "/ricerca")
    public ResponseEntity<List<Immobile>> getImmobiliDaRicerca(
            @RequestParam("localita") String localita,
            @RequestParam("prezzo") Double prezzo,
            @RequestParam("affitta") Boolean affitta,
            @RequestParam("acquisto") Boolean acquisto
    ) {
        System.out.println(localita);
        //gestione dei parametri
        List<Immobile> immobili = immobileService.applicaRicerca(localita, prezzo, affitta, acquisto);
        return ResponseEntity.ok(immobili);
    }
    /**
     * Ottieni immobile per ID
     */
 /*   @GetMapping("/{id}")
    public ResponseEntity<?> getImmobile(@PathVariable Long id) {
        return immobileService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
*/
    /**
     * Cerca immobili per prezzo massimo
     */
 /*   @GetMapping("/search/price")
    public ResponseEntity<List<Immobile>> searchByPrice(@RequestParam Double maxPrice) {
        List<Immobile> immobili = immobileService.findByMaxPrice(maxPrice);
        return ResponseEntity.ok(immobili);
    }
*/
    /**
     * Cerca immobili per indirizzo
     */
 /*   @GetMapping("/search/address")
    public ResponseEntity<List<Immobile>> searchByAddress(@RequestParam String address) {
        List<Immobile> immobili = immobileService.searchByAddress(address);
        return ResponseEntity.ok(immobili);
    }
*/
    /**
     * Aggiorna un immobile
     */
 /*   @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateImmobile(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("titolo") String titolo,
            @RequestParam("descrizione") String descrizione,
            @RequestParam("prezzo") Double prezzo,
            @RequestParam("indirizzo") String indirizzo
    ) {
        try {
            Immobile updated = immobileService.updateImmobile(id, titolo, descrizione, prezzo, indirizzo, file);
            return ResponseEntity.ok(updated);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Errore nell'aggiornamento: " + e.getMessage()));
        }
    }
*/
    /**
     * Elimina un immobile
     */
 /*   @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImmobile(@PathVariable Long id) {
        try {
            immobileService.deleteImmobile(id);
            return ResponseEntity.ok(new SuccessResponse("Immobile eliminato con successo"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Errore nell'eliminazione: " + e.getMessage()));
        }
    }
*/
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
