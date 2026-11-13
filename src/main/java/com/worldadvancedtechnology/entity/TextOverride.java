package com.worldadvancedtechnology.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

/**
 * An admin override for one i18n text key in one language. When present it
 * takes precedence over the built-in value in {@code assets/i18n/base.json}.
 */
@Entity
@Table(name = "text_override",
        uniqueConstraints = @UniqueConstraint(columnNames = {"text_key", "lang"}))
public class TextOverride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "text_key", nullable = false, length = 120)
    private String textKey;

    @Column(nullable = false, length = 8)
    private String lang;

    @Column(name = "text_value", length = 8000)
    private String value;

    public TextOverride() {
    }

    public TextOverride(String textKey, String lang, String value) {
        this.textKey = textKey;
        this.lang = lang;
        this.value = value;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTextKey() {
        return textKey;
    }

    public void setTextKey(String textKey) {
        this.textKey = textKey;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
