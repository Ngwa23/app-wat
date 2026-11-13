package com.worldadvancedtechnology.service;

import com.worldadvancedtechnology.entity.Review;
import com.worldadvancedtechnology.entity.SiteCounters;
import com.worldadvancedtechnology.repo.ReviewRepository;
import com.worldadvancedtechnology.repo.SiteCountersRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Visitor engagement: moderated reviews (star rating + comment) and site-wide
 * like / dislike counters.
 */
@Service
public class EngagementService {

    private final ReviewRepository reviews;
    private final SiteCountersRepository counters;

    public EngagementService(ReviewRepository reviews, SiteCountersRepository counters) {
        this.reviews = reviews;
        this.counters = counters;
    }

    @Transactional
    public void submitReview(String name, int rating, String comment) {
        if (rating < 1 || rating > 5) throw new IllegalArgumentException("Please give a rating from 1 to 5 stars");
        if (comment == null || comment.trim().isEmpty()) throw new IllegalArgumentException("Please write a short comment");
        if (comment.length() > 4000) throw new IllegalArgumentException("Comment is too long");
        Review r = new Review();
        r.setName(name == null || name.isBlank() ? "Anonymous" : name.trim());
        r.setRating(rating);
        r.setComment(comment.trim());
        r.setApproved(false);
        reviews.save(r);
    }

    @Transactional
    public void setApproved(Long id, boolean approved) {
        reviews.findById(id).ifPresent(r -> { r.setApproved(approved); reviews.save(r); });
    }

    @Transactional
    public void deleteReview(Long id) {
        reviews.deleteById(id);
    }

    private SiteCounters load() {
        return counters.findById(1L).orElseGet(() -> {
            SiteCounters c = new SiteCounters();
            c.setId(1L);
            return counters.save(c);
        });
    }

    @Transactional
    public synchronized Map<String, Object> react(String type) {
        SiteCounters c = load();
        if ("like".equalsIgnoreCase(type)) c.setLikes(c.getLikes() + 1);
        else if ("dislike".equalsIgnoreCase(type)) c.setDislikes(c.getDislikes() + 1);
        else throw new IllegalArgumentException("Unknown reaction");
        counters.save(c);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("likes", c.getLikes());
        m.put("dislikes", c.getDislikes());
        return m;
    }
}
