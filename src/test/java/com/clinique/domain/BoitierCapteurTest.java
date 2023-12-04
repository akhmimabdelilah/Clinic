package com.clinique.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.clinique.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BoitierCapteurTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BoitierCapteur.class);
        BoitierCapteur boitierCapteur1 = new BoitierCapteur();
        boitierCapteur1.setId(1L);
        BoitierCapteur boitierCapteur2 = new BoitierCapteur();
        boitierCapteur2.setId(boitierCapteur1.getId());
        assertThat(boitierCapteur1).isEqualTo(boitierCapteur2);
        boitierCapteur2.setId(2L);
        assertThat(boitierCapteur1).isNotEqualTo(boitierCapteur2);
        boitierCapteur1.setId(null);
        assertThat(boitierCapteur1).isNotEqualTo(boitierCapteur2);
    }
}
