package com.clinique.repository;

import com.clinique.domain.BoitierPatient;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BoitierPatient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BoitierPatientRepository extends JpaRepository<BoitierPatient, Long> {}
