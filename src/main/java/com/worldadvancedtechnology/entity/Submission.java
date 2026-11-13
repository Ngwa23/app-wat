package com.worldadvancedtechnology.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/**
 * A stored form submission — either a contact message or a job application.
 * Persisting these means nothing is lost even when email delivery is disabled,
 * and the superadmin can review them in the Inbox.
 */
@Entity
@Table(name = "submission")
public class Submission {

    /** "CONTACT" or "APPLICATION". */
    public enum Type { CONTACT, APPLICATION }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(length = 160) private String name;
    @Column(length = 200) private String email;
    @Column(length = 60)  private String phone;

    /** Service needed (contact) or position applied for (application). */
    @Column(length = 160) private String subjectOrPosition;

    /** Contact subject or applicant years of experience. */
    @Column(length = 200) private String extra;

    @Column(length = 4000) private String message;

    /** Stored CV filename (job applications only); downloaded via the admin API. */
    @Column(name = "cv_file", length = 300)
    private String cvFile;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "read_flag", nullable = false)
    private boolean read = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getSubjectOrPosition() { return subjectOrPosition; }
    public void setSubjectOrPosition(String subjectOrPosition) { this.subjectOrPosition = subjectOrPosition; }

    public String getExtra() { return extra; }
    public void setExtra(String extra) { this.extra = extra; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCvFile() { return cvFile; }
    public void setCvFile(String cvFile) { this.cvFile = cvFile; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}
