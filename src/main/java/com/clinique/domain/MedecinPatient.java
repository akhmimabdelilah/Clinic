package com.clinique.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A MedecinPatient.
 */
@Entity
@Table(name = "medecin_patient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class MedecinPatient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @ManyToOne
    @JsonIgnoreProperties(value = { "extraUserId", "medecinPatients" }, allowSetters = true)
    private Medecin medecins;

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

    public MedecinPatient id(Long id) {
        this.id = id;
        return this;
    }

    public LocalDate getDateDebut() {
        return this.dateDebut;
    }

    public MedecinPatient dateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
        return this;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return this.dateFin;
    }

    public MedecinPatient dateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
        return this;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public Medecin getMedecins() {
        return this.medecins;
    }

    public MedecinPatient medecins(Medecin medecin) {
        this.setMedecins(medecin);
        return this;
    }

    public void setMedecins(Medecin medecin) {
        this.medecins = medecin;
    }

    public Patient getPatients() {
        return this.patients;
    }

    public MedecinPatient patients(Patient patient) {
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
        if (!(o instanceof MedecinPatient)) {
            return false;
        }
        return id != null && id.equals(((MedecinPatient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MedecinPatient{" +
            "id=" + getId() +
            ", dateDebut='" + getDateDebut() + "'" +
            ", dateFin='" + getDateFin() + "'" +
            "}";
    }
}
