package com.worldadvancedtechnology.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * "Employee of the Month/Week" — a single highlighted staff member shown on the
 * public site. Stored as one row (id = 1).
 */
@Entity
@Table(name = "employee_spotlight")
public class EmployeeSpotlight {

    @Id
    private Long id = 1L;

    @Column(nullable = false)
    private boolean enabled = true;

    /** "MONTH" or "WEEK" — drives the heading. */
    @Column(length = 10)
    private String period = "MONTH";

    @Column(length = 160)
    private String name;

    @Column(name = "image_path", length = 500)
    private String imagePath;

    @Column(length = 160) private String roleEn;
    @Column(length = 160) private String roleFr;
    @Column(length = 160) private String roleEs;
    @Column(length = 160) private String roleDe;

    @Column(length = 2000) private String citationEn;
    @Column(length = 2000) private String citationFr;
    @Column(length = 2000) private String citationEs;
    @Column(length = 2000) private String citationDe;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getRoleEn() { return roleEn; }
    public void setRoleEn(String roleEn) { this.roleEn = roleEn; }
    public String getRoleFr() { return roleFr; }
    public void setRoleFr(String roleFr) { this.roleFr = roleFr; }
    public String getRoleEs() { return roleEs; }
    public void setRoleEs(String roleEs) { this.roleEs = roleEs; }
    public String getRoleDe() { return roleDe; }
    public void setRoleDe(String roleDe) { this.roleDe = roleDe; }

    public String getCitationEn() { return citationEn; }
    public void setCitationEn(String citationEn) { this.citationEn = citationEn; }
    public String getCitationFr() { return citationFr; }
    public void setCitationFr(String citationFr) { this.citationFr = citationFr; }
    public String getCitationEs() { return citationEs; }
    public void setCitationEs(String citationEs) { this.citationEs = citationEs; }
    public String getCitationDe() { return citationDe; }
    public void setCitationDe(String citationDe) { this.citationDe = citationDe; }
}
