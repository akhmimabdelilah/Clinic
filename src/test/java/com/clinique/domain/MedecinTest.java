package com.clinique.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.clinique.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MedecinTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Medecin.class);
        Medecin medecin1 = new Medecin();
        medecin1.setId(1L);
        Medecin medecin2 = new Medecin();
        medecin2.setId(medecin1.getId());
        assertThat(medecin1).isEqualTo(medecin2);
        medecin2.setId(2L);
        assertThat(medecin1).isNotEqualTo(medecin2);
        medecin1.setId(null);
        assertThat(medecin1).isNotEqualTo(medecin2);
    }
}
