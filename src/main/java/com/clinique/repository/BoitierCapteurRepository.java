package com.clinique.repository;

import com.clinique.domain.BoitierCapteur;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the BoitierCapteur entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BoitierCapteurRepository extends JpaRepository<BoitierCapteur, Long> {}
