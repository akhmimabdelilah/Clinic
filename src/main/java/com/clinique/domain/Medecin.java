package com.clinique.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Medecin.
 */
@Entity
@Table(name = "medecin")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Medecin implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "specialite")
    private String specialite;

    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ExtraUser extraUserId;

    @OneToMany(mappedBy = "medecins")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "medecins", "patients" }, allowSetters = true)
    private Set<MedecinPatient> medecinPatients = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Medecin id(Long id) {
        this.id = id;
        return this;
    }

    public String getSpecialite() {
        return this.specialite;
    }

    public Medecin specialite(String specialite) {
        this.specialite = specialite;
        return this;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public ExtraUser getExtraUserId() {
        return this.extraUserId;
    }

    public Medecin extraUserId(ExtraUser extraUser) {
        this.setExtraUserId(extraUser);
        return this;
    }

    public void setExtraUserId(ExtraUser extraUser) {
        this.extraUserId = extraUser;
    }

    public Set<MedecinPatient> getMedecinPatients() {
        return this.medecinPatients;
    }

    public Medecin medecinPatients(Set<MedecinPatient> medecinPatients) {
        this.setMedecinPatients(medecinPatients);
        return this;
    }

    public Medecin addMedecinPatients(MedecinPatient medecinPatient) {
        this.medecinPatients.add(medecinPatient);
        medecinPatient.setMedecins(this);
        return this;
    }

    public Medecin removeMedecinPatients(MedecinPatient medecinPatient) {
        this.medecinPatients.remove(medecinPatient);
        medecinPatient.setMedecins(null);
        return this;
    }

    public void setMedecinPatients(Set<MedecinPatient> medecinPatients) {
        if (this.medecinPatients != null) {
            this.medecinPatients.forEach(i -> i.setMedecins(null));
        }
        if (medecinPatients != null) {
            medecinPatients.forEach(i -> i.setMedecins(this));
        }
        this.medecinPatients = medecinPatients;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Medecin)) {
            return false;
        }
        return id != null && id.equals(((Medecin) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Medecin{" +
            "id=" + getId() +
            ", specialite='" + getSpecialite() + "'" +
            "}";
    }
}
