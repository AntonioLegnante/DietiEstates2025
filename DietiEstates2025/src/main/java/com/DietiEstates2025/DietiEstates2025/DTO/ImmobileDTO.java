package com.DietiEstates2025.DietiEstates2025.DTO;

import com.DietiEstates2025.DietiEstates2025.Models.Immobile;
import com.DietiEstates2025.DietiEstates2025.Models.Utente;
import jakarta.persistence.*;

import java.util.Objects;

public class ImmobileDTO {

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

    private String agenteImmobiliare;

    private String classeEnergetica;

    public ImmobileDTO(Immobile immobile) {
        this.id = immobile.getId();
        this.titolo = immobile.getTitolo();
        this.descrizione = immobile.getDescrizione();
        this.citta = immobile.getCitta();
        this.linkImmagine = immobile.getLinkImmagine();
        this.prezzo = immobile.getPrezzo();
        this.indirizzo = immobile.getIndirizzo();
        this.affitto = immobile.getAffitto();
        this.vendita = immobile.getVendita();
        this.numeroStanze = immobile.getNumeroStanze();
        this.dimensione = immobile.getDimensione();
        this.piano = immobile.getPiano();
        this.agenteImmobiliare = immobile.getUtente().getUsername();
        this.classeEnergetica = immobile.getClasseEnergetica();
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

    public String getAgenteImmobiliare() {
        return agenteImmobiliare;
    }

    public void setAgenteImmobiliare(String agenteImmobiliare) {
        this.agenteImmobiliare = agenteImmobiliare;
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
        ImmobileDTO that = (ImmobileDTO) o;
        return Objects.equals(id, that.id) && Objects.equals(titolo, that.titolo) && Objects.equals(descrizione, that.descrizione) && Objects.equals(citta, that.citta) && Objects.equals(linkImmagine, that.linkImmagine) && Objects.equals(prezzo, that.prezzo) && Objects.equals(indirizzo, that.indirizzo) && Objects.equals(affitto, that.affitto) && Objects.equals(vendita, that.vendita) && Objects.equals(numeroStanze, that.numeroStanze) && Objects.equals(dimensione, that.dimensione) && Objects.equals(piano, that.piano) && Objects.equals(agenteImmobiliare, that.agenteImmobiliare) && Objects.equals(classeEnergetica, that.classeEnergetica);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, titolo, descrizione, citta, linkImmagine, prezzo, indirizzo, affitto, vendita, numeroStanze, dimensione, piano, agenteImmobiliare, classeEnergetica);
    }
}
