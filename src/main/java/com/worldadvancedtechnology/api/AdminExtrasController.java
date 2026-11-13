package com.worldadvancedtechnology.api;

import com.worldadvancedtechnology.entity.Review;
import com.worldadvancedtechnology.repo.ReviewRepository;
import com.worldadvancedtechnology.service.ContentEvents;
import com.worldadvancedtechnology.service.ContentService;
import com.worldadvancedtechnology.service.EngagementService;
import com.worldadvancedtechnology.service.StatsService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Secured admin endpoints for review moderation and visitor statistics.
 */
@RestController
@RequestMapping(value = "/admin/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminExtrasController {

    private final ReviewRepository reviews;
    private final EngagementService engagement;
    private final StatsService stats;
    private final ContentService content;
    private final ContentEvents events;

    public AdminExtrasController(ReviewRepository reviews, EngagementService engagement,
                                 StatsService stats, ContentService content, ContentEvents events) {
        this.reviews = reviews;
        this.engagement = engagement;
        this.stats = stats;
        this.content = content;
        this.events = events;
    }

    private void changed() {
        content.evictCache();
        events.publish();
    }

    @GetMapping("/reviews")
    public List<Review> listReviews() {
        return reviews.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/reviews/{id}/approve")
    public Map<String, Object> approve(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        boolean approved = Boolean.parseBoolean(String.valueOf(body.getOrDefault("approved", true)));
        engagement.setApproved(id, approved);
        changed();
        return Map.of("ok", true);
    }

    @DeleteMapping("/reviews/{id}")
    public Map<String, Object> deleteReview(@PathVariable Long id) {
        engagement.deleteReview(id);
        changed();
        return Map.of("ok", true);
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return stats.stats();
    }
}
