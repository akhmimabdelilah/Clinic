package com.clinique.repository;

import com.clinique.domain.MedecinPatient;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the MedecinPatient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MedecinPatientRepository extends JpaRepository<MedecinPatient, Long> {}
