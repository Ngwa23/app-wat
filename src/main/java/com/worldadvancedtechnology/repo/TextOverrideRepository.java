package com.worldadvancedtechnology.repo;

import com.worldadvancedtechnology.entity.TextOverride;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TextOverrideRepository extends JpaRepository<TextOverride, Long> {
    Optional<TextOverride> findByTextKeyAndLang(String textKey, String lang);
    List<TextOverride> findByTextKey(String textKey);
}
