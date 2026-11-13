package com.worldadvancedtechnology.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A single key/value site setting — used for section visibility flags such as
 * {@code section.careers.visible} and other simple singletons.
 */
@Entity
@Table(name = "site_setting")
public class SiteSetting {

    @Id
    @Column(name = "setting_key", length = 120)
    private String key;

    @Column(name = "setting_value", length = 2000)
    private String value;

    public SiteSetting() {
    }

    public SiteSetting(String key, String value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
