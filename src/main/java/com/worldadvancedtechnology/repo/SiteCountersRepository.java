package com.worldadvancedtechnology.repo;

import com.worldadvancedtechnology.entity.SiteCounters;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteCountersRepository extends JpaRepository<SiteCounters, Long> {
}
