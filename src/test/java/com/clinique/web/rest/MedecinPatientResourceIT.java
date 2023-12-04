package com.clinique.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.clinique.IntegrationTest;
import com.clinique.domain.MedecinPatient;
import com.clinique.repository.MedecinPatientRepository;
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
 * Integration tests for the {@link MedecinPatientResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MedecinPatientResourceIT {

    private static final LocalDate DEFAULT_DATE_DEBUT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_DEBUT = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATE_FIN = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_FIN = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/medecin-patients";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MedecinPatientRepository medecinPatientRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMedecinPatientMockMvc;

    private MedecinPatient medecinPatient;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MedecinPatient createEntity(EntityManager em) {
        MedecinPatient medecinPatient = new MedecinPatient().dateDebut(DEFAULT_DATE_DEBUT).dateFin(DEFAULT_DATE_FIN);
        return medecinPatient;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MedecinPatient createUpdatedEntity(EntityManager em) {
        MedecinPatient medecinPatient = new MedecinPatient().dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);
        return medecinPatient;
    }

    @BeforeEach
    public void initTest() {
        medecinPatient = createEntity(em);
    }

    @Test
    @Transactional
    void createMedecinPatient() throws Exception {
        int databaseSizeBeforeCreate = medecinPatientRepository.findAll().size();
        // Create the MedecinPatient
        restMedecinPatientMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medecinPatient))
            )
            .andExpect(status().isCreated());

        // Validate the MedecinPatient in the database
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeCreate + 1);
        MedecinPatient testMedecinPatient = medecinPatientList.get(medecinPatientList.size() - 1);
        assertThat(testMedecinPatient.getDateDebut()).isEqualTo(DEFAULT_DATE_DEBUT);
        assertThat(testMedecinPatient.getDateFin()).isEqualTo(DEFAULT_DATE_FIN);
    }

    @Test
    @Transactional
    void createMedecinPatientWithExistingId() throws Exception {
        // Create the MedecinPatient with an existing ID
        medecinPatient.setId(1L);

        int databaseSizeBeforeCreate = medecinPatientRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMedecinPatientMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medecinPatient))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedecinPatient in the database
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMedecinPatients() throws Exception {
        // Initialize the database
        medecinPatientRepository.saveAndFlush(medecinPatient);

        // Get all the medecinPatientList
        restMedecinPatientMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(medecinPatient.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateDebut").value(hasItem(DEFAULT_DATE_DEBUT.toString())))
            .andExpect(jsonPath("$.[*].dateFin").value(hasItem(DEFAULT_DATE_FIN.toString())));
    }

    @Test
    @Transactional
    void getMedecinPatient() throws Exception {
        // Initialize the database
        medecinPatientRepository.saveAndFlush(medecinPatient);

        // Get the medecinPatient
        restMedecinPatientMockMvc
            .perform(get(ENTITY_API_URL_ID, medecinPatient.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(medecinPatient.getId().intValue()))
            .andExpect(jsonPath("$.dateDebut").value(DEFAULT_DATE_DEBUT.toString()))
            .andExpect(jsonPath("$.dateFin").value(DEFAULT_DATE_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMedecinPatient() throws Exception {
        // Get the medecinPatient
        restMedecinPatientMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMedecinPatient() throws Exception {
        // Initialize the database
        medecinPatientRepository.saveAndFlush(medecinPatient);

        int databaseSizeBeforeUpdate = medecinPatientRepository.findAll().size();

        // Update the medecinPatient
        MedecinPatient updatedMedecinPatient = medecinPatientRepository.findById(medecinPatient.getId()).get();
        // Disconnect from session so that the updates on updatedMedecinPatient are not directly saved in db
        em.detach(updatedMedecinPatient);
        updatedMedecinPatient.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restMedecinPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMedecinPatient.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMedecinPatient))
            )
            .andExpect(status().isOk());

        // Validate the MedecinPatient in the database
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeUpdate);
        MedecinPatient testMedecinPatient = medecinPatientList.get(medecinPatientList.size() - 1);
        assertThat(testMedecinPatient.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testMedecinPatient.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void putNonExistingMedecinPatient() throws Exception {
        int databaseSizeBeforeUpdate = medecinPatientRepository.findAll().size();
        medecinPatient.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedecinPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, medecinPatient.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medecinPatient))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedecinPatient in the database
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMedecinPatient() throws Exception {
        int databaseSizeBeforeUpdate = medecinPatientRepository.findAll().size();
        medecinPatient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedecinPatientMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(medecinPatient))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedecinPatient in the database
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMedecinPatient() throws Exception {
        int databaseSizeBeforeUpdate = medecinPatientRepository.findAll().size();
        medecinPatient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedecinPatientMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(medecinPatient)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MedecinPatient in the database
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMedecinPatientWithPatch() throws Exception {
        // Initialize the database
        medecinPatientRepository.saveAndFlush(medecinPatient);

        int databaseSizeBeforeUpdate = medecinPatientRepository.findAll().size();

        // Update the medecinPatient using partial update
        MedecinPatient partialUpdatedMedecinPatient = new MedecinPatient();
        partialUpdatedMedecinPatient.setId(medecinPatient.getId());

        partialUpdatedMedecinPatient.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restMedecinPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedecinPatient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedecinPatient))
            )
            .andExpect(status().isOk());

        // Validate the MedecinPatient in the database
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeUpdate);
        MedecinPatient testMedecinPatient = medecinPatientList.get(medecinPatientList.size() - 1);
        assertThat(testMedecinPatient.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testMedecinPatient.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void fullUpdateMedecinPatientWithPatch() throws Exception {
        // Initialize the database
        medecinPatientRepository.saveAndFlush(medecinPatient);

        int databaseSizeBeforeUpdate = medecinPatientRepository.findAll().size();

        // Update the medecinPatient using partial update
        MedecinPatient partialUpdatedMedecinPatient = new MedecinPatient();
        partialUpdatedMedecinPatient.setId(medecinPatient.getId());

        partialUpdatedMedecinPatient.dateDebut(UPDATED_DATE_DEBUT).dateFin(UPDATED_DATE_FIN);

        restMedecinPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMedecinPatient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMedecinPatient))
            )
            .andExpect(status().isOk());

        // Validate the MedecinPatient in the database
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeUpdate);
        MedecinPatient testMedecinPatient = medecinPatientList.get(medecinPatientList.size() - 1);
        assertThat(testMedecinPatient.getDateDebut()).isEqualTo(UPDATED_DATE_DEBUT);
        assertThat(testMedecinPatient.getDateFin()).isEqualTo(UPDATED_DATE_FIN);
    }

    @Test
    @Transactional
    void patchNonExistingMedecinPatient() throws Exception {
        int databaseSizeBeforeUpdate = medecinPatientRepository.findAll().size();
        medecinPatient.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMedecinPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, medecinPatient.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medecinPatient))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedecinPatient in the database
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMedecinPatient() throws Exception {
        int databaseSizeBeforeUpdate = medecinPatientRepository.findAll().size();
        medecinPatient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedecinPatientMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(medecinPatient))
            )
            .andExpect(status().isBadRequest());

        // Validate the MedecinPatient in the database
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMedecinPatient() throws Exception {
        int databaseSizeBeforeUpdate = medecinPatientRepository.findAll().size();
        medecinPatient.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMedecinPatientMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(medecinPatient))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MedecinPatient in the database
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMedecinPatient() throws Exception {
        // Initialize the database
        medecinPatientRepository.saveAndFlush(medecinPatient);

        int databaseSizeBeforeDelete = medecinPatientRepository.findAll().size();

        // Delete the medecinPatient
        restMedecinPatientMockMvc
            .perform(delete(ENTITY_API_URL_ID, medecinPatient.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MedecinPatient> medecinPatientList = medecinPatientRepository.findAll();
        assertThat(medecinPatientList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
