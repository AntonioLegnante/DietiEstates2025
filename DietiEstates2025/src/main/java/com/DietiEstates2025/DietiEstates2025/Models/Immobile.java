package com.DietiEstates2025.DietiEstates2025.Models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.Objects;

@Entity
public class Immobile {
    @Id
    private Integer id;
    private String titolo;
    private String linkImmagine;
    private Double prezzo;
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
