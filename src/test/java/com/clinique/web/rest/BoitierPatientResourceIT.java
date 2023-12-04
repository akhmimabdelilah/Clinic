package com.clinique.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.clinique.IntegrationTest;
import com.clinique.domain.BoitierPatient;
import com.clinique.repository.BoitierPatientRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BoitierPatientResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BoitierPatientResourceIT {

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/boitier-patients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BoitierPatientRepository boitierPatientRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBoitierPatientMockMvc;

    private BoitierPatient boitierPatient;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BoitierPatient createEntity(EntityManager em) {
        BoitierPatient boitierPatient = new BoitierPatient().dateDebut(DEFAULT_DATE_DEBUT).dateFin(DEFAULT_DATE_FIN);
        return boitierPatient;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BoitierPatient createUpdatedEntity(EntityManager em) {
        BoitierPatient boitierPatient = new BoitierPatient().dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);
        return boitierPatient;
    }

    @BeforeEach
    public void initTest() {
        boitierPatient = createEntity(em);
    }

    @Test
    @Transactional
    void createBoitierPatient() throws Exception {
        int databaseSizeBeforeCreate = boitierPatientRepository.findAll().size();
        // Create the BoitierPatient
        restBoitierPatientMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boitierPatient))
            )
            .andExpect(status().isCreated());

        // Validate the BoitierPatient in the database
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeCreate + 1);
        BoitierPatient testBoitierPatient = boitierPatientList.get(boitierPatientList.size() - 1);
        assertThat(testBoitierPatient.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testBoitierPatient.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void createBoitierPatientWithExistingId() throws Exception {
        // Create the BoitierPatient with an existing ID
        boitierPatient.setId(1L);

        int databaseSizeBeforeCreate = boitierPatientRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBoitierPatientMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boitierPatient))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoitierPatient in the database
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBoitierPatients() throws Exception {
        // Initialize the database
        boitierPatientRepository.saveAndFlush(boitierPatient);

        // Get all the boitierPatientList
        restBoitierPatientMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(boitierPatient.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    void getBoitierPatient() throws Exception {
        // Initialize the database
        boitierPatientRepository.saveAndFlush(boitierPatient);

        // Get the boitierPatient
        restBoitierPatientMockMvc
            .perform(get(ENTITY_API_URL_ID, boitierPatient.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(boitierPatient.getId().intValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingBoitierPatient() throws Exception {
        // Get the boitierPatient
        restBoitierPatientMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBoitierPatient() throws Exception {
        // Initialize the database
        boitierPatientRepository.saveAndFlush(boitierPatient);

        int databaseSizeBeforeUpdate = boitierPatientRepository.findAll().size();

        // Update the boitierPatient
        BoitierPatient updatedBoitierPatient = boitierPatientRepository.findById(boitierPatient.getId()).get();
        // Disconnect from session so that the updates on updatedBoitierPatient are not directly saved in db
        em.detach(updatedBoitierPatient);
        updatedBoitierPatient.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restBoitierPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBoitierPatient.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBoitierPatient))
            )
            .andExpect(status().isOk());

        // Validate the BoitierPatient in the database
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeUpdate);
        BoitierPatient testBoitierPatient = boitierPatientList.get(boitierPatientList.size() - 1);
        assertThat(testBoitierPatient.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testBoitierPatient.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void putNonExistingBoitierPatient() throws Exception {
        int databaseSizeBeforeUpdate = boitierPatientRepository.findAll().size();
        boitierPatient.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBoitierPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, boitierPatient.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(boitierPatient))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoitierPatient in the database
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBoitierPatient() throws Exception {
        int databaseSizeBeforeUpdate = boitierPatientRepository.findAll().size();
        boitierPatient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(boitierPatient))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoitierPatient in the database
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBoitierPatient() throws Exception {
        int databaseSizeBeforeUpdate = boitierPatientRepository.findAll().size();
        boitierPatient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierPatientMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boitierPatient)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BoitierPatient in the database
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBoitierPatientWithPatch() throws Exception {
        // Initialize the database
        boitierPatientRepository.saveAndFlush(boitierPatient);

        int databaseSizeBeforeUpdate = boitierPatientRepository.findAll().size();

        // Update the boitierPatient using partial update
        BoitierPatient partialUpdatedBoitierPatient = new BoitierPatient();
        partialUpdatedBoitierPatient.setId(boitierPatient.getId());

        partialUpdatedBoitierPatient.dateDebut(UPDATED_DATE_DEBUT);

        restBoitierPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBoitierPatient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBoitierPatient))
            )
            .andExpect(status().isOk());

        // Validate the BoitierPatient in the database
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeUpdate);
        BoitierPatient testBoitierPatient = boitierPatientList.get(boitierPatientList.size() - 1);
        assertThat(testBoitierPatient.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testBoitierPatient.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void fullUpdateBoitierPatientWithPatch() throws Exception {
        // Initialize the database
        boitierPatientRepository.saveAndFlush(boitierPatient);

        int databaseSizeBeforeUpdate = boitierPatientRepository.findAll().size();

        // Update the boitierPatient using partial update
        BoitierPatient partialUpdatedBoitierPatient = new BoitierPatient();
        partialUpdatedBoitierPatient.setId(boitierPatient.getId());

        partialUpdatedBoitierPatient.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restBoitierPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBoitierPatient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBoitierPatient))
            )
            .andExpect(status().isOk());

        // Validate the BoitierPatient in the database
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeUpdate);
        BoitierPatient testBoitierPatient = boitierPatientList.get(boitierPatientList.size() - 1);
        assertThat(testBoitierPatient.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testBoitierPatient.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void patchNonExistingBoitierPatient() throws Exception {
        int databaseSizeBeforeUpdate = boitierPatientRepository.findAll().size();
        boitierPatient.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBoitierPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, boitierPatient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(boitierPatient))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoitierPatient in the database
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBoitierPatient() throws Exception {
        int databaseSizeBeforeUpdate = boitierPatientRepository.findAll().size();
        boitierPatient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(boitierPatient))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoitierPatient in the database
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBoitierPatient() throws Exception {
        int databaseSizeBeforeUpdate = boitierPatientRepository.findAll().size();
        boitierPatient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierPatientMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(boitierPatient))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BoitierPatient in the database
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBoitierPatient() throws Exception {
        // Initialize the database
        boitierPatientRepository.saveAndFlush(boitierPatient);

        int databaseSizeBeforeDelete = boitierPatientRepository.findAll().size();

        // Delete the boitierPatient
        restBoitierPatientMockMvc
            .perform(delete(ENTITY_API_URL_ID, boitierPatient.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BoitierPatient> boitierPatientList = boitierPatientRepository.findAll();
        assertThat(boitierPatientList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
