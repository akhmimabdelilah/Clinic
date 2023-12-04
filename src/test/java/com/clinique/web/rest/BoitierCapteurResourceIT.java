package com.clinique.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.clinique.IntegrationTest;
import com.clinique.domain.BoitierCapteur;
import com.clinique.repository.BoitierCapteurRepository;
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
 * Integration tests for the {@link BoitierCapteurResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class BoitierCapteurResourceIT {

    private static final String DEFAULT_BRANCHE = "AAAAAAAAAA";
    private static final String UPDATED_BRANCHE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ETAT = false;
    private static final Boolean UPDATED_ETAT = true;

    private static final String ENTITY_API_URL = "/api/boitier-capteurs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private BoitierCapteurRepository boitierCapteurRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBoitierCapteurMockMvc;

    private BoitierCapteur boitierCapteur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BoitierCapteur createEntity(EntityManager em) {
        BoitierCapteur boitierCapteur = new BoitierCapteur().branche(DEFAULT_BRANCHE).etat(DEFAULT_ETAT);
        return boitierCapteur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BoitierCapteur createUpdatedEntity(EntityManager em) {
        BoitierCapteur boitierCapteur = new BoitierCapteur().branche(UPDATED_BRANCHE).etat(UPDATED_ETAT);
        return boitierCapteur;
    }

    @BeforeEach
    public void initTest() {
        boitierCapteur = createEntity(em);
    }

    @Test
    @Transactional
    void createBoitierCapteur() throws Exception {
        int databaseSizeBeforeCreate = boitierCapteurRepository.findAll().size();
        // Create the BoitierCapteur
        restBoitierCapteurMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boitierCapteur))
            )
            .andExpect(status().isCreated());

        // Validate the BoitierCapteur in the database
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeCreate + 1);
        BoitierCapteur testBoitierCapteur = boitierCapteurList.get(boitierCapteurList.size() - 1);
        assertThat(testBoitierCapteur.getBranche()).isEqualTo(DEFAULT_BRANCHE);
        assertThat(testBoitierCapteur.getEtat()).isEqualTo(DEFAULT_ETAT);
    }

    @Test
    @Transactional
    void createBoitierCapteurWithExistingId() throws Exception {
        // Create the BoitierCapteur with an existing ID
        boitierCapteur.setId(1L);

        int databaseSizeBeforeCreate = boitierCapteurRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBoitierCapteurMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boitierCapteur))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoitierCapteur in the database
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllBoitierCapteurs() throws Exception {
        // Initialize the database
        boitierCapteurRepository.saveAndFlush(boitierCapteur);

        // Get all the boitierCapteurList
        restBoitierCapteurMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(boitierCapteur.getId().intValue())))
            .andExpect(jsonPath("$.[*].branche").value(hasItem(DEFAULT_BRANCHE)))
            .andExpect(jsonPath("$.[*].etat").value(hasItem(DEFAULT_ETAT.booleanValue())));
    }

    @Test
    @Transactional
    void getBoitierCapteur() throws Exception {
        // Initialize the database
        boitierCapteurRepository.saveAndFlush(boitierCapteur);

        // Get the boitierCapteur
        restBoitierCapteurMockMvc
            .perform(get(ENTITY_API_URL_ID, boitierCapteur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(boitierCapteur.getId().intValue()))
            .andExpect(jsonPath("$.branche").value(DEFAULT_BRANCHE))
            .andExpect(jsonPath("$.etat").value(DEFAULT_ETAT.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingBoitierCapteur() throws Exception {
        // Get the boitierCapteur
        restBoitierCapteurMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewBoitierCapteur() throws Exception {
        // Initialize the database
        boitierCapteurRepository.saveAndFlush(boitierCapteur);

        int databaseSizeBeforeUpdate = boitierCapteurRepository.findAll().size();

        // Update the boitierCapteur
        BoitierCapteur updatedBoitierCapteur = boitierCapteurRepository.findById(boitierCapteur.getId()).get();
        // Disconnect from session so that the updates on updatedBoitierCapteur are not directly saved in db
        em.detach(updatedBoitierCapteur);
        updatedBoitierCapteur.branche(UPDATED_BRANCHE).etat(UPDATED_ETAT);

        restBoitierCapteurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBoitierCapteur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedBoitierCapteur))
            )
            .andExpect(status().isOk());

        // Validate the BoitierCapteur in the database
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeUpdate);
        BoitierCapteur testBoitierCapteur = boitierCapteurList.get(boitierCapteurList.size() - 1);
        assertThat(testBoitierCapteur.getBranche()).isEqualTo(UPDATED_BRANCHE);
        assertThat(testBoitierCapteur.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void putNonExistingBoitierCapteur() throws Exception {
        int databaseSizeBeforeUpdate = boitierCapteurRepository.findAll().size();
        boitierCapteur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBoitierCapteurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, boitierCapteur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(boitierCapteur))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoitierCapteur in the database
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBoitierCapteur() throws Exception {
        int databaseSizeBeforeUpdate = boitierCapteurRepository.findAll().size();
        boitierCapteur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierCapteurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(boitierCapteur))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoitierCapteur in the database
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBoitierCapteur() throws Exception {
        int databaseSizeBeforeUpdate = boitierCapteurRepository.findAll().size();
        boitierCapteur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierCapteurMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(boitierCapteur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BoitierCapteur in the database
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBoitierCapteurWithPatch() throws Exception {
        // Initialize the database
        boitierCapteurRepository.saveAndFlush(boitierCapteur);

        int databaseSizeBeforeUpdate = boitierCapteurRepository.findAll().size();

        // Update the boitierCapteur using partial update
        BoitierCapteur partialUpdatedBoitierCapteur = new BoitierCapteur();
        partialUpdatedBoitierCapteur.setId(boitierCapteur.getId());

        partialUpdatedBoitierCapteur.branche(UPDATED_BRANCHE).etat(UPDATED_ETAT);

        restBoitierCapteurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBoitierCapteur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBoitierCapteur))
            )
            .andExpect(status().isOk());

        // Validate the BoitierCapteur in the database
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeUpdate);
        BoitierCapteur testBoitierCapteur = boitierCapteurList.get(boitierCapteurList.size() - 1);
        assertThat(testBoitierCapteur.getBranche()).isEqualTo(UPDATED_BRANCHE);
        assertThat(testBoitierCapteur.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void fullUpdateBoitierCapteurWithPatch() throws Exception {
        // Initialize the database
        boitierCapteurRepository.saveAndFlush(boitierCapteur);

        int databaseSizeBeforeUpdate = boitierCapteurRepository.findAll().size();

        // Update the boitierCapteur using partial update
        BoitierCapteur partialUpdatedBoitierCapteur = new BoitierCapteur();
        partialUpdatedBoitierCapteur.setId(boitierCapteur.getId());

        partialUpdatedBoitierCapteur.branche(UPDATED_BRANCHE).etat(UPDATED_ETAT);

        restBoitierCapteurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBoitierCapteur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedBoitierCapteur))
            )
            .andExpect(status().isOk());

        // Validate the BoitierCapteur in the database
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeUpdate);
        BoitierCapteur testBoitierCapteur = boitierCapteurList.get(boitierCapteurList.size() - 1);
        assertThat(testBoitierCapteur.getBranche()).isEqualTo(UPDATED_BRANCHE);
        assertThat(testBoitierCapteur.getEtat()).isEqualTo(UPDATED_ETAT);
    }

    @Test
    @Transactional
    void patchNonExistingBoitierCapteur() throws Exception {
        int databaseSizeBeforeUpdate = boitierCapteurRepository.findAll().size();
        boitierCapteur.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBoitierCapteurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, boitierCapteur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(boitierCapteur))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoitierCapteur in the database
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBoitierCapteur() throws Exception {
        int databaseSizeBeforeUpdate = boitierCapteurRepository.findAll().size();
        boitierCapteur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierCapteurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(boitierCapteur))
            )
            .andExpect(status().isBadRequest());

        // Validate the BoitierCapteur in the database
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBoitierCapteur() throws Exception {
        int databaseSizeBeforeUpdate = boitierCapteurRepository.findAll().size();
        boitierCapteur.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBoitierCapteurMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(boitierCapteur))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the BoitierCapteur in the database
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBoitierCapteur() throws Exception {
        // Initialize the database
        boitierCapteurRepository.saveAndFlush(boitierCapteur);

        int databaseSizeBeforeDelete = boitierCapteurRepository.findAll().size();

        // Delete the boitierCapteur
        restBoitierCapteurMockMvc
            .perform(delete(ENTITY_API_URL_ID, boitierCapteur.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BoitierCapteur> boitierCapteurList = boitierCapteurRepository.findAll();
        assertThat(boitierCapteurList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
