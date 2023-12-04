package com.clinique.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BoitierPatient.
 */
@Entity
@Table(name = "boitier_patient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BoitierPatient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @ManyToOne
    @JsonIgnoreProperties(value = { "boitierCapteurs", "boitierPatients" }, allowSetters = true)
    private Boitier boitiers;

    @ManyToOne
    @JsonIgnoreProperties(value = { "extraUserId", "mesures", "videos", "medecinPatients", "boitierPatients" }, allowSetters = true)
    private Patient patients;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BoitierPatient id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDateDebut() {
        return this.dateDebut;
    }

    public BoitierPatient dateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
        return this;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return this.dateFin;
    }

    public BoitierPatient dateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
        return this;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public Boitier getBoitiers() {
        return this.boitiers;
    }

    public BoitierPatient boitiers(Boitier boitier) {
        this.setBoitiers(boitier);
        return this;
    }

    public void setBoitiers(Boitier boitier) {
        this.boitiers = boitier;
    }

    public Patient getPatients() {
        return this.patients;
    }

    public BoitierPatient patients(Patient patient) {
        this.setPatients(patient);
        return this;
    }

    public void setPatients(Patient patient) {
        this.patients = patient;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BoitierPatient)) {
            return false;
        }
        return id != null && id.equals(((BoitierPatient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "BoitierPatient{" +
            "id=" + getId() +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            "}";
    }
}
