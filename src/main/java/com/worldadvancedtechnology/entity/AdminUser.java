package com.worldadvancedtechnology.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A superadmin account. The password is stored only as a BCrypt hash.
 */
@Entity
@Table(name = "admin_user")
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    /** ADMIN = Super Admin (full + user management), EDITOR, VIEWER, or CUSTOM. */
    @Column(nullable = false, length = 20)
    private String role = "ADMIN";

    @Column(name = "display_name", length = 120)
    private String displayName;

    /** Granular permissions. READ = view admin; WRITE = edit content;
     *  EXECUTE = sensitive operations (user management, backups/restore). */
    @Column(name = "can_read", nullable = false, columnDefinition = "boolean default true")
    private boolean canRead = true;

    @Column(name = "can_write", nullable = false, columnDefinition = "boolean default false")
    private boolean canWrite = false;

    @Column(name = "can_execute", nullable = false, columnDefinition = "boolean default false")
    private boolean canExecute = false;

    public AdminUser() {
    }

    public AdminUser(String username, String passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
    }

    public AdminUser(String username, String passwordHash, String role, String displayName) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.displayName = displayName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public boolean isCanRead() { return canRead; }
    public void setCanRead(boolean canRead) { this.canRead = canRead; }

    public boolean isCanWrite() { return canWrite; }
    public void setCanWrite(boolean canWrite) { this.canWrite = canWrite; }

    public boolean isCanExecute() { return canExecute; }
    public void setCanExecute(boolean canExecute) { this.canExecute = canExecute; }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
}
