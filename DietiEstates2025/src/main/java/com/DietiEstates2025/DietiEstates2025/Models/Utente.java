package com.DietiEstates2025.DietiEstates2025.Models;

import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
public class Utente {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "utente_seq")
    @SequenceGenerator(name = "utente_seq", sequenceName = "utente_sequence", allocationSize = 1)
    private Integer id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String numeroDiTelefono;

    @Column(nullable = false)
    private String ruolo;

    @OneToMany(mappedBy = "utente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Immobile> immobili;

    public Utente() {

    }

    public Utente(String username, String password, String numeroDiTelefono, String ruolo) {
        this.username = username;
        this.password = password;
        this.numeroDiTelefono = numeroDiTelefono;
        this.ruolo = ruolo;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNumeroDiTelefono() {
        return numeroDiTelefono;
    }

    public void setNumeroDiTelefono(String numeroDiTelefono) {
        this.numeroDiTelefono = numeroDiTelefono;
    }

    public String getRuolo() {
        return ruolo;
    }

    public void setRuolo(String ruolo) {
        this.ruolo = ruolo;
    }

    public List<Immobile> getImmobili() {
        return immobili;
    }

    public void setImmobili(List<Immobile> immobili) {
        this.immobili = immobili;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Utente utente = (Utente) o;
        return Objects.equals(id, utente.id) && Objects.equals(username, utente.username) && Objects.equals(password, utente.password) && Objects.equals(numeroDiTelefono, utente.numeroDiTelefono) && Objects.equals(ruolo, utente.ruolo) && Objects.equals(immobili, utente.immobili);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, password, numeroDiTelefono, ruolo, immobili);
    }
}
