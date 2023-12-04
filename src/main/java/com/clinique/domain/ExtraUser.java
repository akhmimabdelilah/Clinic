package com.clinique.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ExtraUser.
 */
@Entity
@Table(name = "extra_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ExtraUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cin")
    private String cin;

    @Column(name = "numero_telephone")
    private Double numeroTelephone;

    @Column(name = "date_naissance")
    private LocalDate dateNaissance;

    @Column(name = "nationalite")
    private String nationalite;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "genre")
    private String genre;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ExtraUser id(Long id) {
        this.id = id;
        return this;
    }

    public String getCin() {
        return this.cin;
    }

    public ExtraUser cin(String cin) {
        this.cin = cin;
        return this;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public Double getNumeroTelephone() {
        return this.numeroTelephone;
    }

    public ExtraUser numeroTelephone(Double numeroTelephone) {
        this.numeroTelephone = numeroTelephone;
        return this;
    }

    public void setNumeroTelephone(Double numeroTelephone) {
        this.numeroTelephone = numeroTelephone;
    }

    public LocalDate getDateNaissance() {
        return this.dateNaissance;
    }

    public ExtraUser dateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
        return this;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getNationalite() {
        return this.nationalite;
    }

    public ExtraUser nationalite(String nationalite) {
        this.nationalite = nationalite;
        return this;
    }

    public void setNationalite(String nationalite) {
        this.nationalite = nationalite;
    }

    public String getAdresse() {
        return this.adresse;
    }

    public ExtraUser adresse(String adresse) {
        this.adresse = adresse;
        return this;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getGenre() {
        return this.genre;
    }

    public ExtraUser genre(String genre) {
        this.genre = genre;
        return this;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public User getUser() {
        return this.user;
    }

    public ExtraUser user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ExtraUser)) {
            return false;
        }
        return id != null && id.equals(((ExtraUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ExtraUser{" +
            "id=" + getId() +
            ", cin='" + getCin() + "'" +
            ", numeroTelephone=" + getNumeroTelephone() +
            ", dateNaissance='" + getDateNaissance() + "'" +
            ", nationalite='" + getNationalite() + "'" +
            ", adresse='" + getAdresse() + "'" +
            ", genre='" + getGenre() + "'" +
            "}";
    }
}
