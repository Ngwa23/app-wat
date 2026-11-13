package com.worldadvancedtechnology.service;

import com.worldadvancedtechnology.entity.EmployeeSpotlight;
import com.worldadvancedtechnology.entity.JobOpening;
import com.worldadvancedtechnology.entity.NewsArticle;
import com.worldadvancedtechnology.entity.Review;
import com.worldadvancedtechnology.entity.ServiceItem;
import com.worldadvancedtechnology.entity.SiteCounters;
import com.worldadvancedtechnology.entity.SiteSetting;
import com.worldadvancedtechnology.entity.TeamMember;
import com.worldadvancedtechnology.entity.TextOverride;
import com.worldadvancedtechnology.entity.WorkItem;
import com.worldadvancedtechnology.repo.EmployeeSpotlightRepository;
import com.worldadvancedtechnology.repo.JobOpeningRepository;
import com.worldadvancedtechnology.repo.NewsArticleRepository;
import com.worldadvancedtechnology.repo.ReviewRepository;
import com.worldadvancedtechnology.repo.ServiceItemRepository;
import com.worldadvancedtechnology.repo.SiteCountersRepository;
import com.worldadvancedtechnology.repo.SiteSettingRepository;
import com.worldadvancedtechnology.repo.TeamMemberRepository;
import com.worldadvancedtechnology.repo.TextOverrideRepository;
import com.worldadvancedtechnology.repo.WorkItemRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Builds the JSON payload the public page fetches from {@code GET /api/content}
 * — section visibility, text overrides, and the four editable collections.
 */
@Service
public class ContentService {

    private static final String[] LANGS = {"en", "fr", "es", "de"};

    private final SiteSettingRepository settings;
    private final TextOverrideRepository overrides;
    private final ServiceItemRepository services;
    private final TeamMemberRepository team;
    private final WorkItemRepository work;
    private final JobOpeningRepository jobs;
    private final EmployeeSpotlightRepository spotlight;
    private final ReviewRepository reviews;
    private final SiteCountersRepository counters;
    private final NewsArticleRepository news;

    public ContentService(SiteSettingRepository settings, TextOverrideRepository overrides,
                          ServiceItemRepository services, TeamMemberRepository team,
                          WorkItemRepository work, JobOpeningRepository jobs,
                          EmployeeSpotlightRepository spotlight, ReviewRepository reviews,
                          SiteCountersRepository counters, NewsArticleRepository news) {
        this.settings = settings;
        this.overrides = overrides;
        this.services = services;
        this.team = team;
        this.work = work;
        this.jobs = jobs;
        this.spotlight = spotlight;
        this.reviews = reviews;
        this.counters = counters;
        this.news = news;
    }

    /** Clears the cached public payload; called whenever content changes. */
    @CacheEvict(cacheNames = "publicContent", allEntries = true)
    public void evictCache() {
    }

    @Cacheable(cacheNames = "publicContent", key = "'all'")
    @Transactional(readOnly = true)
    public Map<String, Object> publicContent() {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("visibility", visibility());
        out.put("overrides", overrideMap());
        out.put("services", services.findAllByOrderBySortOrderAsc().stream().map(this::service).toList());
        out.put("team", team.findAllByOrderBySortOrderAsc().stream().map(this::member).toList());
        out.put("work", work.findAllByOrderBySortOrderAsc().stream().map(this::workItem).toList());
        out.put("jobs", jobs.findAllByOrderBySortOrderAsc().stream().map(this::job).toList());
        out.put("spotlight", spotlightMap());
        out.put("engagement", engagementMap());
        out.put("news", news.findByPublishedTrueOrderBySortOrderAscCreatedAtDesc().stream().map(this::newsItem).toList());
        return out;
    }

    private Map<String, Object> newsItem(NewsArticle n) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", n.getId());
        m.put("date", n.getDate());
        m.put("video", n.getVideoPath());
        m.put("document", n.getDocumentPath());
        List<String> imgs = new java.util.ArrayList<>();
        if (n.getImages() != null) {
            for (String p : n.getImages().split("\\|")) {
                if (p != null && !p.isBlank()) imgs.add(p.trim());
            }
        }
        m.put("images", imgs);
        m.put("title", loc(n.getTitleEn(), n.getTitleFr(), n.getTitleEs(), n.getTitleDe()));
        m.put("body", loc(n.getBodyEn(), n.getBodyFr(), n.getBodyEs(), n.getBodyDe()));
        return m;
    }

    private Map<String, Object> engagementMap() {
        List<Review> approved = reviews.findByApprovedTrueOrderByCreatedAtDesc();
        List<Map<String, Object>> list = approved.stream().limit(50).map(r -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("name", r.getName());
            m.put("rating", r.getRating());
            m.put("comment", r.getComment());
            m.put("date", r.getCreatedAt() == null ? Instant.now().toString() : r.getCreatedAt().toString());
            return m;
        }).toList();

        double sum = 0;
        for (Review r : approved) sum += r.getRating();
        double avg = approved.isEmpty() ? 0 : Math.round((sum / approved.size()) * 10.0) / 10.0;

        SiteCounters c = counters.findById(1L).orElse(null);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("reviews", list);
        m.put("ratingAvg", avg);
        m.put("ratingCount", approved.size());
        m.put("likes", c == null ? 0 : c.getLikes());
        m.put("dislikes", c == null ? 0 : c.getDislikes());
        return m;
    }

    private Map<String, Object> spotlightMap() {
        EmployeeSpotlight s = spotlight.findById(1L).orElse(null);
        if (s == null) return null;
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("enabled", s.isEnabled());
        m.put("period", s.getPeriod());
        m.put("name", s.getName());
        m.put("image", s.getImagePath());
        m.put("role", loc(s.getRoleEn(), s.getRoleFr(), s.getRoleEs(), s.getRoleDe()));
        m.put("citation", loc(s.getCitationEn(), s.getCitationFr(), s.getCitationEs(), s.getCitationDe()));
        return m;
    }

    /** sectionId -> visible flag. */
    public Map<String, Boolean> visibility() {
        Map<String, Boolean> vis = new LinkedHashMap<>();
        for (SiteSetting s : settings.findAll()) {
            String k = s.getKey();
            if (k.startsWith("section.") && k.endsWith(".visible")) {
                String id = k.substring("section.".length(), k.length() - ".visible".length());
                vis.put(id, Boolean.parseBoolean(s.getValue()));
            }
        }
        return vis;
    }

    /** lang -> (textKey -> value). */
    public Map<String, Map<String, String>> overrideMap() {
        Map<String, Map<String, String>> byLang = new LinkedHashMap<>();
        for (String l : LANGS) byLang.put(l, new LinkedHashMap<>());
        for (TextOverride o : overrides.findAll()) {
            if (o.getValue() == null) continue;
            byLang.computeIfAbsent(o.getLang(), k -> new LinkedHashMap<>()).put(o.getTextKey(), o.getValue());
        }
        return byLang;
    }

    private Map<String, String> loc(String en, String fr, String es, String de) {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("en", en);
        m.put("fr", fr);
        m.put("es", es);
        m.put("de", de);
        return m;
    }

    private Map<String, Object> service(ServiceItem s) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", s.getId());
        m.put("order", s.getSortOrder());
        m.put("icon", s.getIconSvg());
        m.put("cta", s.getCtaType());
        m.put("visible", s.isVisible());
        m.put("title", loc(s.getTitleEn(), s.getTitleFr(), s.getTitleEs(), s.getTitleDe()));
        m.put("desc", loc(s.getDescEn(), s.getDescFr(), s.getDescEs(), s.getDescDe()));
        m.put("details", loc(s.getDetailsEn(), s.getDetailsFr(), s.getDetailsEs(), s.getDetailsDe()));
        return m;
    }

    private Map<String, Object> member(TeamMember t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", t.getId());
        m.put("order", t.getSortOrder());
        m.put("name", t.getName());
        m.put("image", t.getImagePath());
        m.put("badge", t.getBadge());
        m.put("lead", t.isLead());
        m.put("visible", t.isVisible());
        m.put("role", loc(t.getRoleEn(), t.getRoleFr(), t.getRoleEs(), t.getRoleDe()));
        return m;
    }

    private Map<String, Object> workItem(WorkItem w) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", w.getId());
        m.put("order", w.getSortOrder());
        m.put("thumb", w.getThumbPath());
        m.put("full", w.getFullPath());
        m.put("visible", w.isVisible());
        m.put("title", loc(w.getTitleEn(), w.getTitleFr(), w.getTitleEs(), w.getTitleDe()));
        m.put("cat", loc(w.getCategoryEn(), w.getCategoryFr(), w.getCategoryEs(), w.getCategoryDe()));
        return m;
    }

    private Map<String, Object> job(JobOpening j) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", j.getId());
        m.put("order", j.getSortOrder());
        m.put("location", j.getLocation());
        m.put("type", j.getType());
        m.put("active", j.isActive());
        m.put("title", loc(j.getTitleEn(), j.getTitleFr(), j.getTitleEs(), j.getTitleDe()));
        return m;
    }
}
