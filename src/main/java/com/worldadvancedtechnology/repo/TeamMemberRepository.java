package com.worldadvancedtechnology.repo;

import com.worldadvancedtechnology.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findAllByOrderBySortOrderAsc();
}
