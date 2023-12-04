package com.clinique.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.clinique.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MedecinPatientTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MedecinPatient.class);
        MedecinPatient medecinPatient1 = new MedecinPatient();
        medecinPatient1.setId(1L);
        MedecinPatient medecinPatient2 = new MedecinPatient();
        medecinPatient2.setId(medecinPatient1.getId());
        assertThat(medecinPatient1).isEqualTo(medecinPatient2);
        medecinPatient2.setId(2L);
        assertThat(medecinPatient1).isNotEqualTo(medecinPatient2);
        medecinPatient1.setId(null);
        assertThat(medecinPatient1).isNotEqualTo(medecinPatient2);
    }
}
