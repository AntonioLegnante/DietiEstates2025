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
    private String dimensione;
    private Boolean affitto;
    private Boolean vendita;


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

    public String getDimensione() {
        return dimensione;
    }

    public void setDimensione(String dimensione) {
        this.dimensione = dimensione;
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
}
