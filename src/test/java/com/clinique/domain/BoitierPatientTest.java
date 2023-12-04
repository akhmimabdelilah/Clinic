package com.clinique.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.clinique.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BoitierPatientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BoitierPatient.class);
        BoitierPatient boitierPatient1 = new BoitierPatient();
        boitierPatient1.setId(1L);
        BoitierPatient boitierPatient2 = new BoitierPatient();
        boitierPatient2.setId(boitierPatient1.getId());
        assertThat(boitierPatient1).isEqualTo(boitierPatient2);
        boitierPatient2.setId(2L);
        assertThat(boitierPatient1).isNotEqualTo(boitierPatient2);
        boitierPatient1.setId(null);
        assertThat(boitierPatient1).isNotEqualTo(boitierPatient2);
    }
}
