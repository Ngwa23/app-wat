package com.worldadvancedtechnology.api;

import com.worldadvancedtechnology.service.ContentEvents;
import com.worldadvancedtechnology.service.ContentService;
import com.worldadvancedtechnology.service.EngagementService;
import com.worldadvancedtechnology.service.StatsService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Public engagement endpoints: submit a review, like/dislike, and record a
 * visit. All open (no auth). Reviews are held for admin approval.
 */
@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class FeedbackController {

    private final EngagementService engagement;
    private final StatsService stats;
    private final ContentService content;
    private final ContentEvents events;

    public FeedbackController(EngagementService engagement, StatsService stats,
                              ContentService content, ContentEvents events) {
        this.engagement = engagement;
        this.stats = stats;
        this.content = content;
        this.events = events;
    }

    @PostMapping("/reviews")
    public ApiResult submitReview(@RequestBody Map<String, Object> body) {
        String name = str(body, "name");
        int rating = intOf(body.get("rating"));
        String comment = str(body, "comment");
        engagement.submitReview(name, rating, comment);
        return ApiResult.success("Thank you! Your review was submitted and will appear once approved.");
    }

    @PostMapping("/reaction")
    public Map<String, Object> react(@RequestBody Map<String, Object> body) {
        Map<String, Object> counts = engagement.react(str(body, "type"));
        content.evictCache();
        events.publish();
        return counts;
    }

    @PostMapping("/visit")
    public Map<String, Object> visit(@RequestBody(required = false) Map<String, Object> body) {
        boolean unique = body != null && Boolean.parseBoolean(String.valueOf(body.getOrDefault("unique", false)));
        stats.recordVisit(unique);
        return Map.of("ok", true);
    }

    private static String str(Map<String, Object> m, String k) {
        Object v = m.get(k);
        return v == null ? null : String.valueOf(v);
    }

    private static int intOf(Object o) {
        if (o == null) return 0;
        try { return (int) Math.round(Double.parseDouble(String.valueOf(o))); } catch (NumberFormatException e) { return 0; }
    }
}
