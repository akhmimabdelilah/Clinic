package com.clinique.web.rest;

import com.clinique.domain.BoitierPatient;
import com.clinique.repository.BoitierPatientRepository;
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
 * REST controller for managing {@link com.clinique.domain.BoitierPatient}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BoitierPatientResource {

    private final Logger log = LoggerFactory.getLogger(BoitierPatientResource.class);

    private static final String ENTITY_NAME = "boitierPatient";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BoitierPatientRepository boitierPatientRepository;

    public BoitierPatientResource(BoitierPatientRepository boitierPatientRepository) {
        this.boitierPatientRepository = boitierPatientRepository;
    }

    /**
     * {@code POST  /boitier-patients} : Create a new boitierPatient.
     *
     * @param boitierPatient the boitierPatient to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new boitierPatient, or with status {@code 400 (Bad Request)} if the boitierPatient has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/boitier-patients")
    public ResponseEntity<BoitierPatient> createBoitierPatient(@RequestBody BoitierPatient boitierPatient) throws URISyntaxException {
        log.debug("REST request to save BoitierPatient : {}", boitierPatient);
        if (boitierPatient.getId() != null) {
            throw new BadRequestAlertException("A new boitierPatient cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BoitierPatient result = boitierPatientRepository.save(boitierPatient);
        return ResponseEntity
            .created(new URI("/api/boitier-patients/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /boitier-patients/:id} : Updates an existing boitierPatient.
     *
     * @param id the id of the boitierPatient to save.
     * @param boitierPatient the boitierPatient to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated boitierPatient,
     * or with status {@code 400 (Bad Request)} if the boitierPatient is not valid,
     * or with status {@code 500 (Internal Server Error)} if the boitierPatient couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/boitier-patients/{id}")
    public ResponseEntity<BoitierPatient> updateBoitierPatient(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BoitierPatient boitierPatient
    ) throws URISyntaxException {
        log.debug("REST request to update BoitierPatient : {}, {}", id, boitierPatient);
        if (boitierPatient.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, boitierPatient.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!boitierPatientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BoitierPatient result = boitierPatientRepository.save(boitierPatient);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, boitierPatient.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /boitier-patients/:id} : Partial updates given fields of an existing boitierPatient, field will ignore if it is null
     *
     * @param id the id of the boitierPatient to save.
     * @param boitierPatient the boitierPatient to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated boitierPatient,
     * or with status {@code 400 (Bad Request)} if the boitierPatient is not valid,
     * or with status {@code 404 (Not Found)} if the boitierPatient is not found,
     * or with status {@code 500 (Internal Server Error)} if the boitierPatient couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/boitier-patients/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<BoitierPatient> partialUpdateBoitierPatient(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody BoitierPatient boitierPatient
    ) throws URISyntaxException {
        log.debug("REST request to partial update BoitierPatient partially : {}, {}", id, boitierPatient);
        if (boitierPatient.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, boitierPatient.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!boitierPatientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BoitierPatient> result = boitierPatientRepository
            .findById(boitierPatient.getId())
            .map(
                existingBoitierPatient -> {
                    if (boitierPatient.getDateDebut() != null) {
                        existingBoitierPatient.setDateDebut(boitierPatient.getDateDebut());
                    }
                    if (boitierPatient.getDateFin() != null) {
                        existingBoitierPatient.setDateFin(boitierPatient.getDateFin());
                    }

                    return existingBoitierPatient;
                }
            )
            .map(boitierPatientRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, boitierPatient.getId().toString())
        );
    }

    /**
     * {@code GET  /boitier-patients} : get all the boitierPatients.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of boitierPatients in body.
     */
    @GetMapping("/boitier-patients")
    public List<BoitierPatient> getAllBoitierPatients() {
        log.debug("REST request to get all BoitierPatients");
        return boitierPatientRepository.findAll();
    }

    /**
     * {@code GET  /boitier-patients/:id} : get the "id" boitierPatient.
     *
     * @param id the id of the boitierPatient to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the boitierPatient, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/boitier-patients/{id}")
    public ResponseEntity<BoitierPatient> getBoitierPatient(@PathVariable Long id) {
        log.debug("REST request to get BoitierPatient : {}", id);
        Optional<BoitierPatient> boitierPatient = boitierPatientRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(boitierPatient);
    }

    /**
     * {@code DELETE  /boitier-patients/:id} : delete the "id" boitierPatient.
     *
     * @param id the id of the boitierPatient to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/boitier-patients/{id}")
    public ResponseEntity<Void> deleteBoitierPatient(@PathVariable Long id) {
        log.debug("REST request to delete BoitierPatient : {}", id);
        boitierPatientRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
