package com.worldadvancedtechnology.repo;

import com.worldadvancedtechnology.entity.JobOpening;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobOpeningRepository extends JpaRepository<JobOpening, Long> {
    List<JobOpening> findAllByOrderBySortOrderAsc();
}
