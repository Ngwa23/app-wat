package com.worldadvancedtechnology.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Site-wide like / dislike counters (single row, id = 1).
 */
@Entity
@Table(name = "site_counters")
public class SiteCounters {

    @Id
    private Long id = 1L;

    @Column(nullable = false)
    private long likes = 0;

    @Column(nullable = false)
    private long dislikes = 0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public long getLikes() { return likes; }
    public void setLikes(long likes) { this.likes = likes; }

    public long getDislikes() { return dislikes; }
    public void setDislikes(long dislikes) { this.dislikes = dislikes; }
}
