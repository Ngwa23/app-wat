package com.worldadvancedtechnology.service;

import com.worldadvancedtechnology.entity.AdminUser;
import com.worldadvancedtechnology.repo.AdminUserRepository;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Loads users for Spring Security and manages the user accounts (create / edit
 * role / reset password / delete) plus self-service password change.
 */
@Service
public class AdminUserService implements UserDetailsService {

    public static final Set<String> ROLES = Set.of("ADMIN", "EDITOR", "VIEWER");

    private final AdminUserRepository users;
    private final PasswordEncoder encoder;

    public AdminUserService(AdminUserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminUser u = users.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user: " + username));
        String role = (u.getRole() == null || u.getRole().isBlank()) ? "ADMIN" : u.getRole();
        return new User(u.getUsername(), u.getPasswordHash(),
                AuthorityUtils.createAuthorityList("ROLE_" + role));
    }

    @Transactional
    public boolean changePassword(String username, String currentPassword, String newPassword) {
        AdminUser u = users.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("No user: " + username));
        if (!encoder.matches(currentPassword, u.getPasswordHash())) {
            return false;
        }
        u.setPasswordHash(encoder.encode(newPassword));
        users.save(u);
        return true;
    }

    /* ----------------------- user management (ADMIN only) ----------------------- */

    public List<Map<String, Object>> listUsers() {
        return users.findAll().stream().map(u -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId());
            m.put("username", u.getUsername());
            m.put("role", u.getRole());
            m.put("displayName", u.getDisplayName());
            return m;
        }).toList();
    }

    private String normaliseRole(String role) {
        if (role == null) return "VIEWER";
        String r = role.trim().toUpperCase();
        return ROLES.contains(r) ? r : "VIEWER";
    }

    @Transactional
    public AdminUser createUser(String username, String password, String role, String displayName) {
        if (username == null || username.isBlank()) throw new IllegalArgumentException("Username is required");
        if (password == null || password.length() < 8) throw new IllegalArgumentException("Password must be at least 8 characters");
        if (users.findByUsername(username).isPresent()) throw new IllegalArgumentException("That username already exists");
        AdminUser u = new AdminUser(username.trim(), encoder.encode(password), normaliseRole(role), displayName);
        return users.save(u);
    }

    @Transactional
    public void updateUser(Long id, String role, String displayName, String newPassword) {
        AdminUser u = users.findById(id).orElseThrow(() -> new IllegalArgumentException("No such user"));
        if (role != null) {
            // Never leave the system without an ADMIN.
            if (!normaliseRole(role).equals("ADMIN") && "ADMIN".equals(u.getRole()) && adminCount() <= 1) {
                throw new IllegalArgumentException("Cannot demote the only remaining admin");
            }
            u.setRole(normaliseRole(role));
        }
        if (displayName != null) u.setDisplayName(displayName);
        if (newPassword != null && !newPassword.isBlank()) {
            if (newPassword.length() < 8) throw new IllegalArgumentException("Password must be at least 8 characters");
            u.setPasswordHash(encoder.encode(newPassword));
        }
        users.save(u);
    }

    @Transactional
    public void deleteUser(Long id, String currentUsername) {
        AdminUser u = users.findById(id).orElseThrow(() -> new IllegalArgumentException("No such user"));
        if (u.getUsername().equals(currentUsername)) throw new IllegalArgumentException("You cannot delete your own account");
        if ("ADMIN".equals(u.getRole()) && adminCount() <= 1) throw new IllegalArgumentException("Cannot delete the only remaining admin");
        users.delete(u);
    }

    private long adminCount() {
        return users.findAll().stream().filter(x -> "ADMIN".equals(x.getRole())).count();
    }
}
