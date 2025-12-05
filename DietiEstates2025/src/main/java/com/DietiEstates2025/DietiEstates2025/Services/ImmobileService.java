package com.DietiEstates2025.DietiEstates2025.Services;

import com.DietiEstates2025.DietiEstates2025.MinioService;
import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import com.DietiEstates2025.DietiEstates2025.Repositories.ImmobileRepository;
import com.DietiEstates2025.DietiEstates2025.Repositories.UtenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ImmobileService {

    @Autowired
    private ImmobileRepository immobileRepository;

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private MinioService minioService;

    /**
     * Crea un nuovo immobile con immagine di copertina e gallery
     *
     * @param titolo        Titolo dell'immobile
     * @param descrizione   Descrizione
     * @param prezzo        Prezzo
     * @param dimensione    Dimensione
     * @param citta         Città
     * @param indirizzo     Indirizzo
     * @param affitto       Se è in affitto
     * @param vendita       Se è in vendita
     * @param imageFile     File immagine di copertina
     * @param galleryImages Lista di immagini per la gallery (max 5)
     * @param username      Username dell'utente
     * @return Immobile salvato
     * @throws Exception se ci sono errori
     */
    @Transactional
    public Immobile createImmobile(String titolo, String descrizione, Double prezzo, String dimensione, String citta,
                                   String indirizzo, Boolean affitto, Boolean vendita, Integer numeroStanze, String piano,
                                   String classeEnergetica, MultipartFile imageFile, List<MultipartFile> galleryImages,
                                   String username) throws Exception {

        System.out.println("Questo problema è sicuramente indecidibile");

        // Upload della foto di copertina
        String imageUrl = minioService.uploadFile(imageFile);

        // Upload delle gallery images (se presenti)
        List<String> galleryUrls = new ArrayList<>();
        if (galleryImages != null && !galleryImages.isEmpty()) {
            try {
                galleryUrls = minioService.uploadMultipleFiles(galleryImages);
                System.out.println("Caricate " + galleryUrls.size() + " immagini nella gallery");
            } catch (Exception e) {
                System.err.println("Errore upload gallery images: " + e.getMessage());
                // Continua comunque con la creazione dell'immobile anche se la gallery fallisce
            }
        }

        try {
            Optional<Utente> utente = utenteRepository.findByUsername(username);
            if(utente.isPresent()) {
                Immobile immobile = new Immobile();
                immobile.setTitolo(titolo);
                immobile.setDescrizione(descrizione);
                immobile.setCitta(citta);
                immobile.setPrezzo(prezzo);
                immobile.setDimensione(dimensione);
                immobile.setIndirizzo(indirizzo);
                immobile.setAffitto(affitto);
                immobile.setVendita(vendita);
                immobile.setNumeroStanze(numeroStanze);
                immobile.setPiano(piano);
                immobile.setClasseEnergetica(classeEnergetica);
                immobile.setCoverImage(imageUrl);
                immobile.setGalleryImages(galleryUrls);  // NUOVO: Salva le gallery images
                immobile.setUtente(utente.get());

                return immobileRepository.save(immobile);
            }
            else {
                throw new RuntimeException("Utente non trovato");
            }

        } catch (Exception e) {
            // Se il salvataggio fallisce, elimina TUTTE le immagini da MinIO
            try {
                // Elimina cover image
                String filename = extractFilenameFromUrl(imageUrl);
                minioService.deleteFile(filename);

                // Elimina gallery images
                if (!galleryUrls.isEmpty()) {
                    minioService.deleteMultipleFiles(galleryUrls);
                }
            } catch (Exception cleanupException) {
                System.err.println("Errore nella pulizia delle immagini: " + cleanupException.getMessage());
            }
            throw new Exception("Errore nel salvataggio dell'immobile: " + e.getMessage());
        }
    }

    @Transactional
    public List<Immobile> applicaRicerca(String localita, Double minPrezzo, Double maxPrezzo, Boolean affitta, Boolean vendita,
                                         Integer numeroStanze, String dimensione, String piano, String classeEnergetica) {
        return immobileRepository.ricercaAvanzata(localita, minPrezzo, maxPrezzo, affitta, vendita,
                numeroStanze, dimensione, piano, classeEnergetica);
    }

    private String extractFilenameFromUrl(String url) {
        if (url == null || url.isEmpty()) {
            throw new IllegalArgumentException("URL non valido");
        }
        return url.substring(url.lastIndexOf('/') + 1);
    }
}