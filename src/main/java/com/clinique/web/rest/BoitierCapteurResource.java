package com.clinique.web.rest;

import com.clinique.domain.BoitierCapteur;
import com.clinique.repository.BoitierCapteurRepository;
import com.clinique.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.clinique.domain.BoitierCapteur}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BoitierCapteurResource {

    private final Logger log = LoggerFactory.getLogger(BoitierCapteurResource.class);

    private static final String ENTITY_NAME = "boitierCapteur";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BoitierCapteurRepository boitierCapteurRepository;

    public BoitierCapteurResource(BoitierCapteurRepository boitierCapteurRepository) {
        this.boitierCapteurRepository = boitierCapteurRepository;
    }

    /**
     * {@code POST  /boitier-capteurs} : Create a new boitierCapteur.
     *
     * @param boitierCapteur the boitierCapteur to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new boitierCapteur, or with status {@code 400 (Bad Request)} if the boitierCapteur has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/boitier-capteurs")
    public ResponseEntity<BoitierCapteur> createBoitierCapteur(@RequestBody BoitierCapteur boitierCapteur) throws URISyntaxException {
        log.debug("REST request to save BoitierCapteur : {}", boitierCapteur);
        if (boitierCapteur.getId() != null) {
            throw new BadRequestAlertException("A new boitierCapteur cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BoitierCapteur result = boitierCapteurRepository.save(boitierCapteur);
        return ResponseEntity
            .created(new URI("/api/boitier-capteurs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /boitier-capteurs/:id} : Updates an existing boitierCapteur.
     *
     * @param id the id of the boitierCapteur to save.
     * @param boitierCapteur the boitierCapteur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated boitierCapteur,
     * or with status {@code 400 (Bad Request)} if the boitierCapteur is not valid,
     * or with status {@code 500 (Internal Server Error)} if the boitierCapteur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/boitier-capteurs/{id}")
    public ResponseEntity<BoitierCapteur> updateBoitierCapteur(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BoitierCapteur boitierCapteur
    ) throws URISyntaxException {
        log.debug("REST request to update BoitierCapteur : {}, {}", id, boitierCapteur);
        if (boitierCapteur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, boitierCapteur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!boitierCapteurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BoitierCapteur result = boitierCapteurRepository.save(boitierCapteur);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, boitierCapteur.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /boitier-capteurs/:id} : Partial updates given fields of an existing boitierCapteur, field will ignore if it is null
     *
     * @param id the id of the boitierCapteur to save.
     * @param boitierCapteur the boitierCapteur to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated boitierCapteur,
     * or with status {@code 400 (Bad Request)} if the boitierCapteur is not valid,
     * or with status {@code 404 (Not Found)} if the boitierCapteur is not found,
     * or with status {@code 500 (Internal Server Error)} if the boitierCapteur couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/boitier-capteurs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<BoitierCapteur> partialUpdateBoitierCapteur(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BoitierCapteur boitierCapteur
    ) throws URISyntaxException {
        log.debug("REST request to partial update BoitierCapteur partially : {}, {}", id, boitierCapteur);
        if (boitierCapteur.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, boitierCapteur.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!boitierCapteurRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BoitierCapteur> result = boitierCapteurRepository
            .findById(boitierCapteur.getId())
            .map(
                existingBoitierCapteur -> {
                    if (boitierCapteur.getBranche() != null) {
                        existingBoitierCapteur.setBranche(boitierCapteur.getBranche());
                    }
                    if (boitierCapteur.getEtat() != null) {
                        existingBoitierCapteur.setEtat(boitierCapteur.getEtat());
                    }

                    return existingBoitierCapteur;
                }
            )
            .map(boitierCapteurRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, boitierCapteur.getId().toString())
        );
    }

    /**
     * {@code GET  /boitier-capteurs} : get all the boitierCapteurs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of boitierCapteurs in body.
     */
    @GetMapping("/boitier-capteurs")
    public List<BoitierCapteur> getAllBoitierCapteurs() {
        log.debug("REST request to get all BoitierCapteurs");
        return boitierCapteurRepository.findAll();
    }

    /**
     * {@code GET  /boitier-capteurs/:id} : get the "id" boitierCapteur.
     *
     * @param id the id of the boitierCapteur to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the boitierCapteur, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/boitier-capteurs/{id}")
    public ResponseEntity<BoitierCapteur> getBoitierCapteur(@PathVariable Long id) {
        log.debug("REST request to get BoitierCapteur : {}", id);
        Optional<BoitierCapteur> boitierCapteur = boitierCapteurRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(boitierCapteur);
    }

    /**
     * {@code DELETE  /boitier-capteurs/:id} : delete the "id" boitierCapteur.
     *
     * @param id the id of the boitierCapteur to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/boitier-capteurs/{id}")
    public ResponseEntity<Void> deleteBoitierCapteur(@PathVariable Long id) {
        log.debug("REST request to delete BoitierCapteur : {}", id);
        boitierCapteurRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
