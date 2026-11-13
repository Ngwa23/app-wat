package com.worldadvancedtechnology.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Per-day visitor counters. {@code day} is an ISO date (yyyy-MM-dd).
 * {@code views} counts every page load; {@code visitors} counts unique
 * browsers per day (first load of the day).
 */
@Entity
@Table(name = "visit_stat")
public class VisitStat {

    @Id
    @Column(name = "stat_day", length = 10)
    private String day;

    @Column(nullable = false)
    private long views = 0;

    @Column(nullable = false)
    private long visitors = 0;

    public VisitStat() {
    }

    public VisitStat(String day) {
        this.day = day;
    }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public long getViews() { return views; }
    public void setViews(long views) { this.views = views; }

    public long getVisitors() { return visitors; }
    public void setVisitors(long visitors) { this.visitors = visitors; }
}
