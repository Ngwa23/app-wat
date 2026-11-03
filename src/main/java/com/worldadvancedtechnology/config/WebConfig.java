package com.worldadvancedtechnology.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Duration;

/**
 * Static-resource tuning for fast, cache-friendly delivery.
 *
 * <p>Fingerprint-free assets (images, css, js) are served with a long cache
 * lifetime so returning visitors load the site almost instantly, while the
 * HTML entry point stays revalidated so content changes appear immediately.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Images change rarely — cache hard for a year.
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/")
                .setCacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic());

        // CSS / JS — cache for a week, allow revalidation.
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/")
                .setCacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePublic());
    }
}
