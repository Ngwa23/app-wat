package com.worldadvancedtechnology.repo;

import com.worldadvancedtechnology.entity.SiteSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteSettingRepository extends JpaRepository<SiteSetting, String> {
}
