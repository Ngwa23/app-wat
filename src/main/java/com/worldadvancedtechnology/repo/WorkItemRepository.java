package com.worldadvancedtechnology.repo;

import com.worldadvancedtechnology.entity.WorkItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkItemRepository extends JpaRepository<WorkItem, Long> {
    List<WorkItem> findAllByOrderBySortOrderAsc();
}
