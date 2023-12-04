package com.clinique.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Patient.
 */
@Entity
@Table(name = "patient")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Patient implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "profession")
    private String profession;

    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private ExtraUser extraUserId;

    @OneToMany(mappedBy = "patient")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patient" }, allowSetters = true)
    private Set<Mesure> mesures = new HashSet<>();

    @OneToMany(mappedBy = "patients")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "patients" }, allowSetters = true)
    private Set<Video> videos = new HashSet<>();

    @OneToMany(mappedBy = "patients")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "medecins", "patients" }, allowSetters = true)
    private Set<MedecinPatient> medecinPatients = new HashSet<>();

    @OneToMany(mappedBy = "patients")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "boitiers", "patients" }, allowSetters = true)
    private Set<BoitierPatient> boitierPatients = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient id(Long id) {
        this.id = id;
        return this;
    }

    public String getProfession() {
        return this.profession;
    }

    public Patient profession(String profession) {
        this.profession = profession;
        return this;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public ExtraUser getExtraUserId() {
        return this.extraUserId;
    }

    public Patient extraUserId(ExtraUser extraUser) {
        this.setExtraUserId(extraUser);
        return this;
    }

    public void setExtraUserId(ExtraUser extraUser) {
        this.extraUserId = extraUser;
    }

    public Set<Mesure> getMesures() {
        return this.mesures;
    }

    public Patient mesures(Set<Mesure> mesures) {
        this.setMesures(mesures);
        return this;
    }

    public Patient addMesure(Mesure mesure) {
        this.mesures.add(mesure);
        mesure.setPatient(this);
        return this;
    }

    public Patient removeMesure(Mesure mesure) {
        this.mesures.remove(mesure);
        mesure.setPatient(null);
        return this;
    }

    public void setMesures(Set<Mesure> mesures) {
        if (this.mesures != null) {
            this.mesures.forEach(i -> i.setPatient(null));
        }
        if (mesures != null) {
            mesures.forEach(i -> i.setPatient(this));
        }
        this.mesures = mesures;
    }

    public Set<Video> getVideos() {
        return this.videos;
    }

    public Patient videos(Set<Video> videos) {
        this.setVideos(videos);
        return this;
    }

    public Patient addVideos(Video video) {
        this.videos.add(video);
        video.setPatients(this);
        return this;
    }

    public Patient removeVideos(Video video) {
        this.videos.remove(video);
        video.setPatients(null);
        return this;
    }

    public void setVideos(Set<Video> videos) {
        if (this.videos != null) {
            this.videos.forEach(i -> i.setPatients(null));
        }
        if (videos != null) {
            videos.forEach(i -> i.setPatients(this));
        }
        this.videos = videos;
    }

    public Set<MedecinPatient> getMedecinPatients() {
        return this.medecinPatients;
    }

    public Patient medecinPatients(Set<MedecinPatient> medecinPatients) {
        this.setMedecinPatients(medecinPatients);
        return this;
    }

    public Patient addMedecinPatients(MedecinPatient medecinPatient) {
        this.medecinPatients.add(medecinPatient);
        medecinPatient.setPatients(this);
        return this;
    }

    public Patient removeMedecinPatients(MedecinPatient medecinPatient) {
        this.medecinPatients.remove(medecinPatient);
        medecinPatient.setPatients(null);
        return this;
    }

    public void setMedecinPatients(Set<MedecinPatient> medecinPatients) {
        if (this.medecinPatients != null) {
            this.medecinPatients.forEach(i -> i.setPatients(null));
        }
        if (medecinPatients != null) {
            medecinPatients.forEach(i -> i.setPatients(this));
        }
        this.medecinPatients = medecinPatients;
    }

    public Set<BoitierPatient> getBoitierPatients() {
        return this.boitierPatients;
    }

    public Patient boitierPatients(Set<BoitierPatient> boitierPatients) {
        this.setBoitierPatients(boitierPatients);
        return this;
    }

    public Patient addBoitierPatients(BoitierPatient boitierPatient) {
        this.boitierPatients.add(boitierPatient);
        boitierPatient.setPatients(this);
        return this;
    }

    public Patient removeBoitierPatients(BoitierPatient boitierPatient) {
        this.boitierPatients.remove(boitierPatient);
        boitierPatient.setPatients(null);
        return this;
    }

    public void setBoitierPatients(Set<BoitierPatient> boitierPatients) {
        if (this.boitierPatients != null) {
            this.boitierPatients.forEach(i -> i.setPatients(null));
        }
        if (boitierPatients != null) {
            boitierPatients.forEach(i -> i.setPatients(this));
        }
        this.boitierPatients = boitierPatients;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Patient)) {
            return false;
        }
        return id != null && id.equals(((Patient) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Patient{" +
            "id=" + getId() +
            ", profession='" + getProfession() + "'" +
            "}";
    }
}
