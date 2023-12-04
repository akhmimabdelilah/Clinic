package com.clinique.web.rest;

import com.clinique.domain.MedecinPatient;
import com.clinique.repository.MedecinPatientRepository;
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
 * REST controller for managing {@link com.clinique.domain.MedecinPatient}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MedecinPatientResource {

    private final Logger log = LoggerFactory.getLogger(MedecinPatientResource.class);

    private static final String ENTITY_NAME = "medecinPatient";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MedecinPatientRepository medecinPatientRepository;

    public MedecinPatientResource(MedecinPatientRepository medecinPatientRepository) {
        this.medecinPatientRepository = medecinPatientRepository;
    }

    /**
     * {@code POST  /medecin-patients} : Create a new medecinPatient.
     *
     * @param medecinPatient the medecinPatient to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new medecinPatient, or with status {@code 400 (Bad Request)} if the medecinPatient has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/medecin-patients")
    public ResponseEntity<MedecinPatient> createMedecinPatient(@RequestBody MedecinPatient medecinPatient) throws URISyntaxException {
        log.debug("REST request to save MedecinPatient : {}", medecinPatient);
        if (medecinPatient.getId() != null) {
            throw new BadRequestAlertException("A new medecinPatient cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MedecinPatient result = medecinPatientRepository.save(medecinPatient);
        return ResponseEntity
            .created(new URI("/api/medecin-patients/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /medecin-patients/:id} : Updates an existing medecinPatient.
     *
     * @param id the id of the medecinPatient to save.
     * @param medecinPatient the medecinPatient to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medecinPatient,
     * or with status {@code 400 (Bad Request)} if the medecinPatient is not valid,
     * or with status {@code 500 (Internal Server Error)} if the medecinPatient couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/medecin-patients/{id}")
    public ResponseEntity<MedecinPatient> updateMedecinPatient(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MedecinPatient medecinPatient
    ) throws URISyntaxException {
        log.debug("REST request to update MedecinPatient : {}, {}", id, medecinPatient);
        if (medecinPatient.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medecinPatient.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medecinPatientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MedecinPatient result = medecinPatientRepository.save(medecinPatient);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medecinPatient.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /medecin-patients/:id} : Partial updates given fields of an existing medecinPatient, field will ignore if it is null
     *
     * @param id the id of the medecinPatient to save.
     * @param medecinPatient the medecinPatient to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated medecinPatient,
     * or with status {@code 400 (Bad Request)} if the medecinPatient is not valid,
     * or with status {@code 404 (Not Found)} if the medecinPatient is not found,
     * or with status {@code 500 (Internal Server Error)} if the medecinPatient couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/medecin-patients/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<MedecinPatient> partialUpdateMedecinPatient(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody MedecinPatient medecinPatient
    ) throws URISyntaxException {
        log.debug("REST request to partial update MedecinPatient partially : {}, {}", id, medecinPatient);
        if (medecinPatient.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, medecinPatient.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!medecinPatientRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MedecinPatient> result = medecinPatientRepository
            .findById(medecinPatient.getId())
            .map(
                existingMedecinPatient -> {
                    if (medecinPatient.getDateDebut() != null) {
                        existingMedecinPatient.setDateDebut(medecinPatient.getDateDebut());
                    }
                    if (medecinPatient.getDateFin() != null) {
                        existingMedecinPatient.setDateFin(medecinPatient.getDateFin());
                    }

                    return existingMedecinPatient;
                }
            )
            .map(medecinPatientRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, medecinPatient.getId().toString())
        );
    }

    /**
     * {@code GET  /medecin-patients} : get all the medecinPatients.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of medecinPatients in body.
     */
    @GetMapping("/medecin-patients")
    public List<MedecinPatient> getAllMedecinPatients() {
        log.debug("REST request to get all MedecinPatients");
        return medecinPatientRepository.findAll();
    }

    /**
     * {@code GET  /medecin-patients/:id} : get the "id" medecinPatient.
     *
     * @param id the id of the medecinPatient to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the medecinPatient, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/medecin-patients/{id}")
    public ResponseEntity<MedecinPatient> getMedecinPatient(@PathVariable Long id) {
        log.debug("REST request to get MedecinPatient : {}", id);
        Optional<MedecinPatient> medecinPatient = medecinPatientRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(medecinPatient);
    }

    /**
     * {@code DELETE  /medecin-patients/:id} : delete the "id" medecinPatient.
     *
     * @param id the id of the medecinPatient to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/medecin-patients/{id}")
    public ResponseEntity<Void> deleteMedecinPatient(@PathVariable Long id) {
        log.debug("REST request to delete MedecinPatient : {}", id);
        medecinPatientRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
