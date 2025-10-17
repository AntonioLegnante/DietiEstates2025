package com.DietiEstates2025.DietiEstates2025.Services;

import com.DietiEstates2025.DietiEstates2025.MinioService;
import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Repositories.ImmobileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class ImmobileService {

    @Autowired
    private ImmobileRepository immobileRepository;

    @Autowired
    private MinioService minioService;

    /**
     * Crea un nuovo immobile con immagine
     * @param titolo Titolo dell'immobile
     * @param descrizione Descrizione
     * @param prezzo Prezzo
     * @param dimensione Dimensione
     * @param indirizzo Indirizzo
     * @param imageFile File immagine
     * @return Immobile salvato
     * @throws Exception se ci sono errori
     */
    @Transactional
    public Immobile createImmobile(String titolo, String descrizione, Double prezzo, String dimensione, String citta,
                                   String indirizzo, Boolean affitto, Boolean vendita, MultipartFile imageFile) throws Exception {

        // 1. Valida i dati
        //validateImmobileData(titolo, descrizione, prezzo, indirizzo);
        System.out.println("Questo problema è sicuramente indecidibile");
        // 2. Upload immagine su MinIO
        String imageUrl = minioService.uploadFile(imageFile);

        try {
            // 3. Crea e salva l'immobile nel database PostgreSQL
            Immobile immobile = new Immobile();
            immobile.setTitolo(titolo);
            immobile.setDescrizione(descrizione);
            immobile.setCitta(citta);
            immobile.setPrezzo(prezzo);
            immobile.setDimensione(dimensione);
            immobile.setIndirizzo(indirizzo);
            immobile.setAffitto(affitto);
            immobile.setVendita(vendita);
            immobile.setLinkImmagine(imageUrl);
            return immobileRepository.save(immobile);

        } catch (Exception e) {
            // Se il salvataggio fallisce, elimina l'immagine da MinIO
            try {
                String filename = extractFilenameFromUrl(imageUrl);
                minioService.deleteFile(filename);
            } catch (Exception cleanupException) {
                System.err.println("Errore nella pulizia dell'immagine: " + cleanupException.getMessage());
            }
            throw new Exception("Errore nel salvataggio dell'immobile: " + e.getMessage());
        }
    }

    @Transactional
    public List<Immobile> applicaRicerca(String localita, Double prezzo, Boolean affitta, Boolean acquisto) {
        return immobileRepository.ricercaAvanzata(localita, prezzo, affitta, acquisto);
    }

    /**
     * Aggiorna un immobile esistente
     */
 /*   @Transactional
    public Immobile updateImmobile(Long id, String titolo, String descrizione, Double prezzo,
                                   String indirizzo, MultipartFile imageFile) throws Exception {

        // Trova l'immobile esistente
        Immobile immobile = immobileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Immobile non trovato con ID: " + id));

        // Valida i dati
        validateImmobileData(titolo, descrizione, prezzo, indirizzo);

        // Aggiorna i campi
        immobile.setTitolo(titolo);
        immobile.setDescrizione(descrizione);
        immobile.setPrezzo(prezzo);
        immobile.setIndirizzo(indirizzo);

        // Se c'è una nuova immagine, sostituisci la vecchia
        if (imageFile != null && !imageFile.isEmpty()) {
            String oldImageUrl = immobile.getImageUrl();

            // Upload nuova immagine
            String newImageUrl = minioService.uploadFile(imageFile);
            immobile.setImageUrl(newImageUrl);

            // Salva le modifiche
            Immobile updated = immobileRepository.save(immobile);

            // Elimina vecchia immagine
            try {
                String oldFilename = extractFilenameFromUrl(oldImageUrl);
                minioService.deleteFile(oldFilename);
            } catch (Exception e) {
                System.err.println("Errore nell'eliminazione della vecchia immagine: " + e.getMessage());
            }

            return updated;
        }

        // Salva senza cambiare l'immagine
        return immobileRepository.save(immobile);
    }
*/
    /**
     * Elimina un immobile
     */
 /*   @Transactional
    public void deleteImmobile(Long id) throws Exception {
        Immobile immobile = immobileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Immobile non trovato con ID: " + id));

        // Elimina immagine da MinIO
        try {
            String filename = extractFilenameFromUrl(immobile.getImageUrl());
            minioService.deleteFile(filename);
        } catch (Exception e) {
            System.err.println("Errore nell'eliminazione dell'immagine: " + e.getMessage());
        }

        // Elimina dal database
        immobileRepository.delete(immobile);
    }
*/
    /**
     * Trova immobile per ID
     */
 /*   public Optional<Immobile> findById(Long id) {
        return immobileRepository.findById(id);
    }
*/
    /**
     * Trova tutti gli immobili
     */
 /*   public List<Immobile> findAll() {
        return immobileRepository.findAll();
    }
*/
    /**
     * Cerca immobili per prezzo massimo
     */
/*    public List<Immobile> findByMaxPrice(Double maxPrice) {
        return immobileRepository.findByPrezzoLessThanEqual(maxPrice);
    }
*/
    /**
     * Cerca immobili per indirizzo
     */
 /*   public List<Immobile> searchByAddress(String address) {
        return immobileRepository.findByIndirizzoContainingIgnoreCase(address);
    }
*/
    // Metodi helper privati
 /*   private void validateImmobileData(String titolo, String descrizione, Double prezzo, String indirizzo) {
        if (titolo == null || titolo.trim().isEmpty()) {
            throw new IllegalArgumentException("Il titolo è obbligatorio");
        }
        if (descrizione == null || descrizione.trim().isEmpty()) {
            throw new IllegalArgumentException("La descrizione è obbligatoria");
        }
        if (prezzo == null || prezzo <= 0) {
            throw new IllegalArgumentException("Il prezzo deve essere maggiore di zero");
        }
        if (indirizzo == null || indirizzo.trim().isEmpty()) {
            throw new IllegalArgumentException("L'indirizzo è obbligatorio");
        }
    }
*/
    private String extractFilenameFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("URL non valido");
        }
        return url.substring(url.lastIndexOf('/') + 1);
    }
}