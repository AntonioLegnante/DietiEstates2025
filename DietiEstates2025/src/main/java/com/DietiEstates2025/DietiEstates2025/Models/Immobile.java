package com.DietiEstates2025.DietiEstates2025.Models;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class Immobile {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "immobile_seq")
    @SequenceGenerator(name = "immobile_seq", sequenceName = "immobile_sequence", allocationSize = 1)
    private Integer id;
    private String titolo;
    private String descrizione;
    private String citta;
    private String linkImmagine;
    private Double prezzo;
    private String indirizzo;
    private Boolean affitto;
    private Boolean vendita;
    private Integer numeroStanze;
    private String dimensione;
    private String piano;
    private String classeEnergetica;

    public Immobile() {

    }

    public Immobile(Integer id, String titolo, String descrizione, String citta, String linkImmagine,
                    Double prezzo, String indirizzo, Boolean affitto, Boolean vendita, Integer numeroStanze,
                    String dimensione, String piano, String classeEnergetica) {
        this.id = id;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.citta = citta;
        this.linkImmagine = linkImmagine;
        this.prezzo = prezzo;
        this.indirizzo = indirizzo;
        this.affitto = affitto;
        this.vendita = vendita;
        this.numeroStanze = numeroStanze;
        this.dimensione = dimensione;
        this.piano = piano;
        this.classeEnergetica = classeEnergetica;
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

    public String getLinkImmagine() {
        return linkImmagine;
    }

    public void setLinkImmagine(String linkImmagine) {
        this.linkImmagine = linkImmagine;
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

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Immobile immobile = (Immobile) o;
        return Objects.equals(id, immobile.id) && Objects.equals(titolo, immobile.titolo) && Objects.equals(descrizione, immobile.descrizione) && Objects.equals(citta, immobile.citta) && Objects.equals(linkImmagine, immobile.linkImmagine) && Objects.equals(prezzo, immobile.prezzo) && Objects.equals(indirizzo, immobile.indirizzo) && Objects.equals(affitto, immobile.affitto) && Objects.equals(vendita, immobile.vendita) && Objects.equals(numeroStanze, immobile.numeroStanze) && Objects.equals(dimensione, immobile.dimensione) && Objects.equals(piano, immobile.piano) && Objects.equals(classeEnergetica, immobile.classeEnergetica);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, titolo, descrizione, citta, linkImmagine, prezzo, indirizzo, affitto, vendita, numeroStanze, dimensione, piano, classeEnergetica);
    }
}
