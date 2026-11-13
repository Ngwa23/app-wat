package com.worldadvancedtechnology.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A card in the "Our Services" grid. Localized fields are stored per language;
 * {@code details*} are pipe ("|") separated bullet lists shown in the modal.
 */
@Entity
@Table(name = "service_item")
public class ServiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(name = "icon_svg", length = 4000)
    private String iconSvg;

    @Column(length = 200) private String titleEn;
    @Column(length = 200) private String titleFr;
    @Column(length = 200) private String titleEs;
    @Column(length = 200) private String titleDe;

    @Column(length = 2000) private String descEn;
    @Column(length = 2000) private String descFr;
    @Column(length = 2000) private String descEs;
    @Column(length = 2000) private String descDe;

    @Column(length = 4000) private String detailsEn;
    @Column(length = 4000) private String detailsFr;
    @Column(length = 4000) private String detailsEs;
    @Column(length = 4000) private String detailsDe;

    /** "contact" or "voip" — controls the card link target and label. */
    @Column(name = "cta_type", length = 20)
    private String ctaType = "contact";

    @Column(nullable = false)
    private boolean visible = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public String getIconSvg() { return iconSvg; }
    public void setIconSvg(String iconSvg) { this.iconSvg = iconSvg; }

    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public String getTitleFr() { return titleFr; }
    public void setTitleFr(String titleFr) { this.titleFr = titleFr; }
    public String getTitleEs() { return titleEs; }
    public void setTitleEs(String titleEs) { this.titleEs = titleEs; }
    public String getTitleDe() { return titleDe; }
    public void setTitleDe(String titleDe) { this.titleDe = titleDe; }

    public String getDescEn() { return descEn; }
    public void setDescEn(String descEn) { this.descEn = descEn; }
    public String getDescFr() { return descFr; }
    public void setDescFr(String descFr) { this.descFr = descFr; }
    public String getDescEs() { return descEs; }
    public void setDescEs(String descEs) { this.descEs = descEs; }
    public String getDescDe() { return descDe; }
    public void setDescDe(String descDe) { this.descDe = descDe; }

    public String getDetailsEn() { return detailsEn; }
    public void setDetailsEn(String detailsEn) { this.detailsEn = detailsEn; }
    public String getDetailsFr() { return detailsFr; }
    public void setDetailsFr(String detailsFr) { this.detailsFr = detailsFr; }
    public String getDetailsEs() { return detailsEs; }
    public void setDetailsEs(String detailsEs) { this.detailsEs = detailsEs; }
    public String getDetailsDe() { return detailsDe; }
    public void setDetailsDe(String detailsDe) { this.detailsDe = detailsDe; }

    public String getCtaType() { return ctaType; }
    public void setCtaType(String ctaType) { this.ctaType = ctaType; }

    public boolean isVisible() { return visible; }
    public void setVisible(boolean visible) { this.visible = visible; }
}
