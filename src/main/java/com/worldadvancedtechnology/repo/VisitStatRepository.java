package com.worldadvancedtechnology.repo;

import com.worldadvancedtechnology.entity.VisitStat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisitStatRepository extends JpaRepository<VisitStat, String> {
    List<VisitStat> findByDayGreaterThanEqualOrderByDayAsc(String day);
}
