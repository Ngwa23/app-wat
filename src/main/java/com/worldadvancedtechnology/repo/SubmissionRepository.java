package com.worldadvancedtechnology.repo;

import com.worldadvancedtechnology.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findAllByOrderByCreatedAtDesc();
}
