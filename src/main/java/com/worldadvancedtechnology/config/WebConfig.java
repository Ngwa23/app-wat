package com.worldadvancedtechnology.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;
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

    @Value("${wat.data-dir:./data}")
    private String dataDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Images change rarely — cache hard for a year.
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/")
                .setCacheControl(CacheControl.maxAge(Duration.ofDays(365)).cachePublic());

        // CSS / JS — must revalidate every load so admin/content changes in the
        // app's behaviour appear immediately (the browser still gets a cheap 304
        // when the file is unchanged). Avoids stale cached scripts.
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/")
                .setCacheControl(CacheControl.noCache().cachePublic());

        // Admin-uploaded images live outside the jar under the data directory.
        String uploads = Paths.get(dataDir, "uploads").toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploads)
                .setCacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePublic());
    }
}
