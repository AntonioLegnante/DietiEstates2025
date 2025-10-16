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
    private String linkImmagine;
    private Double prezzo;
    private String indirizzo;
    private String dimensione;
    private String stanze;
    private Boolean ascensore;
    private String classeEnergetica;
    private Boolean affitto;
    private Boolean vendita;
    private Double longitudine;
    private Double latitudine;

    public Immobile() {

    }

    public Immobile(Integer id, String titolo, String linkImmagine, Double prezzo, String dimensione,
                    String stanze, Boolean ascensore, String classeEnergetica, Boolean affitto,
                    Boolean vendita, Double longitudine, Double latitudine) {
        this.id = id;
        this.titolo = titolo;
        this.linkImmagine = linkImmagine;
        this.prezzo = prezzo;
        this.dimensione = dimensione;
        this.stanze = stanze;
        this.ascensore = ascensore;
        this.classeEnergetica = classeEnergetica;
        this.affitto = affitto;
        this.vendita = vendita;
        this.longitudine = longitudine;
        this.latitudine = latitudine;
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

    public String getIndirizzo() {
        return indirizzo;
    }

    public void setIndirizzo(String indirizzo) {
        this.indirizzo = indirizzo;
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

    public String getDimensione() {
        return dimensione;
    }

    public void setDimensione(String dimensione) {
        this.dimensione = dimensione;
    }

    public String getStanze() {
        return stanze;
    }

    public void setStanze(String stanze) {
        this.stanze = stanze;
    }

    public Boolean getAscensore() {
        return ascensore;
    }

    public void setAscensore(Boolean ascensore) {
        this.ascensore = ascensore;
    }

    public String getClasseEnergetica() {
        return classeEnergetica;
    }

    public void setClasseEnergetica(String classeEnergetica) {
        this.classeEnergetica = classeEnergetica;
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

    public Double getLongitudine() {
        return longitudine;
    }

    public void setLongitudine(Double longitudine) {
        this.longitudine = longitudine;
    }

    public Double getLatitudine() {
        return latitudine;
    }

    public void setLatitudine(Double latitudine) {
        this.latitudine = latitudine;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Immobile immobile = (Immobile) o;
        return Objects.equals(id, immobile.id) && Objects.equals(linkImmagine, immobile.linkImmagine) && Objects.equals(prezzo, immobile.prezzo) && Objects.equals(dimensione, immobile.dimensione) && Objects.equals(stanze, immobile.stanze) && Objects.equals(ascensore, immobile.ascensore) && Objects.equals(classeEnergetica, immobile.classeEnergetica) && Objects.equals(affitto, immobile.affitto) && Objects.equals(vendita, immobile.vendita) && Objects.equals(longitudine, immobile.longitudine) && Objects.equals(latitudine, immobile.latitudine);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, linkImmagine, prezzo, dimensione, stanze, ascensore, classeEnergetica, affitto, vendita, longitudine, latitudine);
    }
}
