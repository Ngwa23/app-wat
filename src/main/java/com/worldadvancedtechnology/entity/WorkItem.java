package com.worldadvancedtechnology.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A tile in the "Our Work" carousel. {@code thumbPath} is shown in the grid;
 * {@code fullPath} opens in the lightbox.
 */
@Entity
@Table(name = "work_item")
public class WorkItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(length = 200) private String titleEn;
    @Column(length = 200) private String titleFr;
    @Column(length = 200) private String titleEs;
    @Column(length = 200) private String titleDe;

    @Column(length = 120) private String categoryEn;
    @Column(length = 120) private String categoryFr;
    @Column(length = 120) private String categoryEs;
    @Column(length = 120) private String categoryDe;

    @Column(name = "thumb_path", length = 500)
    private String thumbPath;

    @Column(name = "full_path", length = 500)
    private String fullPath;

    @Column(nullable = false)
    private boolean visible = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public String getTitleFr() { return titleFr; }
    public void setTitleFr(String titleFr) { this.titleFr = titleFr; }
    public String getTitleEs() { return titleEs; }
    public void setTitleEs(String titleEs) { this.titleEs = titleEs; }
    public String getTitleDe() { return titleDe; }
    public void setTitleDe(String titleDe) { this.titleDe = titleDe; }

    public String getCategoryEn() { return categoryEn; }
    public void setCategoryEn(String categoryEn) { this.categoryEn = categoryEn; }
    public String getCategoryFr() { return categoryFr; }
    public void setCategoryFr(String categoryFr) { this.categoryFr = categoryFr; }
    public String getCategoryEs() { return categoryEs; }
    public void setCategoryEs(String categoryEs) { this.categoryEs = categoryEs; }
    public String getCategoryDe() { return categoryDe; }
    public void setCategoryDe(String categoryDe) { this.categoryDe = categoryDe; }

    public String getThumbPath() { return thumbPath; }
    public void setThumbPath(String thumbPath) { this.thumbPath = thumbPath; }

    public String getFullPath() { return fullPath; }
    public void setFullPath(String fullPath) { this.fullPath = fullPath; }

    public boolean isVisible() { return visible; }
    public void setVisible(boolean visible) { this.visible = visible; }
}
