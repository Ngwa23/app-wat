package com.worldadvancedtechnology.repo;

import com.worldadvancedtechnology.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    List<NewsArticle> findAllByOrderBySortOrderAscCreatedAtDesc();
    List<NewsArticle> findByPublishedTrueOrderBySortOrderAscCreatedAtDesc();
}
