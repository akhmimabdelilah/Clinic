package com.clinique.repository;

import com.clinique.domain.Mesure;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Mesure entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MesureRepository extends JpaRepository<Mesure, Long> {}
