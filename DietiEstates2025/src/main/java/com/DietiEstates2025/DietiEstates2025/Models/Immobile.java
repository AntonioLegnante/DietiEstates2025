package com.DietiEstates2025.DietiEstates2025.Models;

import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Immobile {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "immobile_seq")
    @SequenceGenerator(name = "immobile_seq", sequenceName = "immobile_sequence", allocationSize = 1)
    private Integer id;

    @Column(nullable = false)
    private String titolo;

    @Column(nullable = false)
    private String descrizione;

    @Column(nullable = false)
    private String citta;

    @Column(unique = true, nullable = false, name = "cover_image")
    private String coverImage;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "gallery_images")
    private List<String> galleryImages = new ArrayList<>();

    @Column(nullable = false)
    private Double prezzo;

    @Column(nullable = false)
    private String indirizzo;

    @Column(nullable = false)
    private Boolean affitto;

    @Column(nullable = false)
    private Boolean vendita;

    private Integer numeroStanze;

    private String dimensione;

    private String piano;

    @ManyToOne
    @JoinColumn(name = "utente_id", nullable = false)
    private Utente utente;

    private String classeEnergetica;

    public Immobile() {

    }


    public Immobile(Integer id, String titolo, String descrizione, String citta, String coverImage, List<String> galleryImages,
                    Double prezzo, String indirizzo, Boolean affitto, Boolean vendita, Integer numeroStanze,
                    String dimensione, String piano, String classeEnergetica, Utente utente) {
        this.id = id;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.citta = citta;
        this.coverImage = coverImage;
        this.galleryImages = galleryImages;
        this.prezzo = prezzo;
        this.indirizzo = indirizzo;
        this.affitto = affitto;
        this.vendita = vendita;
        this.numeroStanze = numeroStanze;
        this.dimensione = dimensione;
        this.piano = piano;
        this.classeEnergetica = classeEnergetica;
        this.utente = utente;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitolo() {
        return titolo;
    }

    public void setTitolo(String titolo) {
        this.titolo = titolo;
    }

    public String getDescrizione() {
        return descrizione;
    }

    public void setDescrizione(String descrizione) {
        this.descrizione = descrizione;
    }

    public String getCitta() {
        return citta;
    }

    public void setCitta(String citta) {
        this.citta = citta;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public List<String> getGalleryImages() {
        return galleryImages;
    }

    public void setGalleryImages(List<String> galleryImages) {
        this.galleryImages = galleryImages;
    }

    public Double getPrezzo() {
        return prezzo;
    }

    public void setPrezzo(Double prezzo) {
        this.prezzo = prezzo;
    }

    public String getIndirizzo() {
        return indirizzo;
    }

    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
    }

    public Boolean getAffitto() {
        return affitto;
    }

    public void setAffitto(Boolean affitto) {
        this.affitto = affitto;
    }

    public Boolean getVendita() {
        return vendita;
    }

    public void setVendita(Boolean vendita) {
        this.vendita = vendita;
    }

    public Integer getNumeroStanze() {
        return numeroStanze;
    }

    public void setNumeroStanze(Integer numeroStanze) {
        this.numeroStanze = numeroStanze;
    }

    public String getDimensione() {
        return dimensione;
    }

    public void setDimensione(String dimensione) {
        this.dimensione = dimensione;
    }

    public String getPiano() {
        return piano;
    }

    public void setPiano(String piano) {
        this.piano = piano;
    }

    public String getClasseEnergetica() {
        return classeEnergetica;
    }

    public void setClasseEnergetica(String classeEnergetica) {
        this.classeEnergetica = classeEnergetica;
    }

    public Utente getUtente() {
        return utente;
    }

    public void setUtente(Utente utente) {
        this.utente = utente;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Immobile immobile = (Immobile) o;
        return Objects.equals(id, immobile.id) && Objects.equals(titolo, immobile.titolo) && Objects.equals(descrizione, immobile.descrizione) && Objects.equals(citta, immobile.citta) && Objects.equals(coverImage, immobile.coverImage) && Objects.equals(galleryImages, immobile.galleryImages) && Objects.equals(prezzo, immobile.prezzo) && Objects.equals(indirizzo, immobile.indirizzo) && Objects.equals(affitto, immobile.affitto) && Objects.equals(vendita, immobile.vendita) && Objects.equals(numeroStanze, immobile.numeroStanze) && Objects.equals(dimensione, immobile.dimensione) && Objects.equals(piano, immobile.piano) && Objects.equals(utente, immobile.utente) && Objects.equals(classeEnergetica, immobile.classeEnergetica);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, titolo, descrizione, citta, coverImage, galleryImages, prezzo, indirizzo, affitto, vendita, numeroStanze, dimensione, piano, utente, classeEnergetica);
    }
}
