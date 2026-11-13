package com.worldadvancedtechnology;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * World Advanced Technology — company web application.
 *
 * <p>A lightweight Spring Boot service that serves the refined marketing
 * front-end (static assets with long-lived caching) and a small JSON API for
 * the contact and careers forms. Packaged as a single executable JAR with an
 * embedded web server, so it deploys anywhere a JDK runs — no external Tomcat.
 */
@SpringBootApplication
@EnableCaching
public class WatWebsiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(WatWebsiteApplication.class, args);
    }
}
