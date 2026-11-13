package com.worldadvancedtechnology.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

/**
 * Authentication for the superadmin area.
 *
 * <p>The public website and its read/submit APIs stay open; everything under
 * {@code /admin} (except the login page) requires an authenticated session.
 * Passwords are verified with BCrypt against {@code AdminUserService}.
 *
 * <p>CSRF tokens are disabled in favour of a {@code SameSite=Lax} session
 * cookie (see application.yml): the admin cookie is never sent on a cross-site
 * POST, so forged requests cannot act as the admin. The two public form
 * endpoints need no session and are open.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Admin login page + its processing endpoint are open.
                .requestMatchers("/admin/login.html", "/admin/login").permitAll()
                // User management is ADMIN-only (all methods).
                .requestMatchers("/admin/api/users/**").hasRole("ADMIN")
                // Any logged-in user may change their own password.
                .requestMatchers(HttpMethod.POST, "/admin/api/account/password").authenticated()
                // Viewers may read; only Admin/Editor may change content.
                .requestMatchers(HttpMethod.GET, "/admin/api/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/admin/api/**").hasAnyRole("ADMIN", "EDITOR")
                .requestMatchers(HttpMethod.PUT, "/admin/api/**").hasAnyRole("ADMIN", "EDITOR")
                .requestMatchers(HttpMethod.DELETE, "/admin/api/**").hasAnyRole("ADMIN", "EDITOR")
                // Dashboard pages are available to any authenticated role.
                .requestMatchers("/admin/**").authenticated()
                // Public site, assets, uploads, health, SSE and public APIs are open.
                .anyRequest().permitAll()
            )
            .formLogin(form -> form
                .loginPage("/admin/login.html")
                .loginProcessingUrl("/admin/login")
                .defaultSuccessUrl("/admin/index.html", true)
                .failureUrl("/admin/login.html?error")
                .permitAll()
            )
            // Persistent "remember me" so sessions survive browser/app restarts.
            .rememberMe(rm -> rm
                .key("wat-remember-me-key-2026")
                .rememberMeParameter("remember-me")
                .tokenValiditySeconds(60 * 60 * 24 * 30)
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/admin/logout", "POST"))
                .logoutSuccessUrl("/admin/login.html?logout")
                .deleteCookies("JSESSIONID", "remember-me")
                .permitAll()
            );
        return http.build();
    }
}
