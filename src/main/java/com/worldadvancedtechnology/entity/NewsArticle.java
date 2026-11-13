package com.worldadvancedtechnology.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/**
 * A news / blog article. Supports multiple photos (pipe-separated paths), one
 * video and one attached document. Localized title and body (EN required;
 * other languages optional, falling back to EN).
 */
@Entity
@Table(name = "news_article")
public class NewsArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    /** Display date, ISO yyyy-MM-dd. */
    @Column(length = 10)
    private String date;

    @Column(length = 250) private String titleEn;
    @Column(length = 250) private String titleFr;
    @Column(length = 250) private String titleEs;
    @Column(length = 250) private String titleDe;

    @Column(length = 10000) private String bodyEn;
    @Column(length = 10000) private String bodyFr;
    @Column(length = 10000) private String bodyEs;
    @Column(length = 10000) private String bodyDe;

    /** Pipe ("|") separated image paths. */
    @Column(length = 3000)
    private String images;

    @Column(name = "video_path", length = 500)
    private String videoPath;

    @Column(name = "document_path", length = 500)
    private String documentPath;

    @Column(nullable = false)
    private boolean published = true;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public String getTitleFr() { return titleFr; }
    public void setTitleFr(String titleFr) { this.titleFr = titleFr; }
    public String getTitleEs() { return titleEs; }
    public void setTitleEs(String titleEs) { this.titleEs = titleEs; }
    public String getTitleDe() { return titleDe; }
    public void setTitleDe(String titleDe) { this.titleDe = titleDe; }

    public String getBodyEn() { return bodyEn; }
    public void setBodyEn(String bodyEn) { this.bodyEn = bodyEn; }
    public String getBodyFr() { return bodyFr; }
    public void setBodyFr(String bodyFr) { this.bodyFr = bodyFr; }
    public String getBodyEs() { return bodyEs; }
    public void setBodyEs(String bodyEs) { this.bodyEs = bodyEs; }
    public String getBodyDe() { return bodyDe; }
    public void setBodyDe(String bodyDe) { this.bodyDe = bodyDe; }

    public String getImages() { return images; }
    public void setImages(String images) { this.images = images; }

    public String getVideoPath() { return videoPath; }
    public void setVideoPath(String videoPath) { this.videoPath = videoPath; }

    public String getDocumentPath() { return documentPath; }
    public void setDocumentPath(String documentPath) { this.documentPath = documentPath; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
