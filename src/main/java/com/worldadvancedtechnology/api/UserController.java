package com.worldadvancedtechnology.api;

import com.worldadvancedtechnology.service.AdminUserService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * User management — create/list/update/delete admin users. ADMIN-only
 * (enforced in {@code SecurityConfig} for {@code /admin/api/users/**}).
 */
@RestController
@RequestMapping(value = "/admin/api/users", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {

    private final AdminUserService users;

    public UserController(AdminUserService users) {
        this.users = users;
    }

    @GetMapping
    public List<Map<String, Object>> list() {
        return users.listUsers();
    }

    @PostMapping
    public Map<String, Object> create(@RequestBody Map<String, Object> body) {
        users.createUser(
                str(body, "username"), str(body, "password"), str(body, "role"), str(body, "displayName"));
        return Map.of("ok", true);
    }

    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        users.updateUser(id, str(body, "role"), str(body, "displayName"), str(body, "password"));
        return Map.of("ok", true);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id, Principal p) {
        users.deleteUser(id, p == null ? "" : p.getName());
        return Map.of("ok", true);
    }

    private static String str(Map<String, Object> m, String k) {
        Object v = m.get(k);
        return v == null ? null : String.valueOf(v);
    }
}
