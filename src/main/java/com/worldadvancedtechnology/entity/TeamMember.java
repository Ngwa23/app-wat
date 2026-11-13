package com.worldadvancedtechnology.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A person shown in the "Our Team" section. {@code lead=true} renders in the
 * top leadership row (with a badge); otherwise in the development-team grid.
 */
@Entity
@Table(name = "team_member")
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(length = 160)
    private String name;

    @Column(length = 160) private String roleEn;
    @Column(length = 160) private String roleFr;
    @Column(length = 160) private String roleEs;
    @Column(length = 160) private String roleDe;

    @Column(name = "image_path", length = 500)
    private String imagePath;

    @Column(length = 40)
    private String badge;

    @Column(name = "is_lead", nullable = false)
    private boolean lead = false;

    @Column(nullable = false)
    private boolean visible = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRoleEn() { return roleEn; }
    public void setRoleEn(String roleEn) { this.roleEn = roleEn; }
    public String getRoleFr() { return roleFr; }
    public void setRoleFr(String roleFr) { this.roleFr = roleFr; }
    public String getRoleEs() { return roleEs; }
    public void setRoleEs(String roleEs) { this.roleEs = roleEs; }
    public String getRoleDe() { return roleDe; }
    public void setRoleDe(String roleDe) { this.roleDe = roleDe; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public boolean isLead() { return lead; }
    public void setLead(boolean lead) { this.lead = lead; }

    public boolean isVisible() { return visible; }
    public void setVisible(boolean visible) { this.visible = visible; }
}
