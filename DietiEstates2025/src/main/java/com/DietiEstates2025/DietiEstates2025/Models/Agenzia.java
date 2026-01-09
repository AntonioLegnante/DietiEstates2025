package com.DietiEstates2025.DietiEstates2025.Models;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "agenzie")
public class Agenzia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nomeAgenzia;

    @Column(nullable = false)
    private String indirizzoAgenzia;

    @Column(nullable = false)
    private String cittaAgenzia;

    @Column(nullable = false)
    private String telefonoAgenzia;

    @Column(nullable = false)
    private String emailAgenzia;

    @Column(nullable = false, unique = true, length = 11)
    private String partitaIVA;

    @OneToOne
    @JoinColumn(name = "gestore_id", unique = true)
    private Utente gestore;

    @OneToMany(mappedBy = "agenzia")
    private List<Utente> agentiImmobiliari;

    // Costruttori
    public Agenzia() {
    }

    public Agenzia(Long id, String nomeAgenzia, String indirizzoAgenzia,
                   String cittaAgenzia, String telefonoAgenzia,
                   String emailAgenzia, String partitaIVA) {
        this.id = id;
        this.nomeAgenzia = nomeAgenzia;
        this.indirizzoAgenzia = indirizzoAgenzia;
        this.cittaAgenzia = cittaAgenzia;
        this.telefonoAgenzia = telefonoAgenzia;
        this.emailAgenzia = emailAgenzia;
        this.partitaIVA = partitaIVA;
    }

    // Getter e Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeAgenzia() {
        return nomeAgenzia;
    }

    public void setNomeAgenzia(String nomeAgenzia) {
        this.nomeAgenzia = nomeAgenzia;
    }

    public String getIndirizzoAgenzia() {
        return indirizzoAgenzia;
    }

    public void setIndirizzoAgenzia(String indirizzoAgenzia) {
        this.indirizzoAgenzia = indirizzoAgenzia;
    }

    public String getCittaAgenzia() {
        return cittaAgenzia;
    }

    public void setCittaAgenzia(String cittaAgenzia) {
        this.cittaAgenzia = cittaAgenzia;
    }

    public String getTelefonoAgenzia() {
        return telefonoAgenzia;
    }

    public void setTelefonoAgenzia(String telefonoAgenzia) {
        this.telefonoAgenzia = telefonoAgenzia;
    }

    public String getEmailAgenzia() {
        return emailAgenzia;
    }

    public void setEmailAgenzia(String emailAgenzia) {
        this.emailAgenzia = emailAgenzia;
    }

    public String getPartitaIVA() {
        return partitaIVA;
    }

    public void setPartitaIVA(String partitaIVA) {
        this.partitaIVA = partitaIVA;
    }

    public Utente getGestore() {
        return gestore;
    }

    public void setGestore(Utente gestore) {
        this.gestore = gestore;
    }

    public List<Utente> getAgentiImmobiliari() {
        return agentiImmobiliari;
    }

    public void setAgentiImmobiliari(List<Utente> agentiImmobiliari) {
        this.agentiImmobiliari = agentiImmobiliari;
    }
}