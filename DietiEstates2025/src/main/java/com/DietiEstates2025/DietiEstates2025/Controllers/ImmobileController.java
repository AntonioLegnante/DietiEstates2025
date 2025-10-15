package com.DietiEstates2025.DietiEstates2025.Controllers;

import com.DietiEstates2025.DietiEstates2025.MinioService;
import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Services.ImmobileService;
import io.minio.messages.ErrorResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/immobili")
public class ImmobileController {
/*
    private final ImmobileService immobileService;

    public ImmobileController(ImmobileService immobileService) {
        this.immobileService = immobileService;
    }



    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createImmobile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("titolo") String titolo,
            @RequestParam("descrizione") String descrizione,
            @RequestParam("prezzo") Double prezzo,
            @RequestParam("indirizzo") String indirizzo
    ) {
        try {
            // 1. Upload immagine su MinIO
            String imageUrl = minioService.uploadFile(file);

            // 2. Crea entità Immobile
            Immobile immobile = new Immobile();
            immobile.setTitolo(titolo);
            immobile.setDescrizione(descrizione);
            immobile.setPrezzo(prezzo);
            immobile.setIndirizzo(indirizzo);
            immobile.setImageUrl(imageUrl);

            // 3. Salva nel database
            Immobile saved = immobileRepository.save(immobile);

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Errore nella creazione dell'immobile: " + e.getMessage()));
        }
    }*/
}
