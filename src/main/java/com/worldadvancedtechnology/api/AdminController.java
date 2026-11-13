package com.worldadvancedtechnology.api;

import com.worldadvancedtechnology.entity.EmployeeSpotlight;
import com.worldadvancedtechnology.entity.JobOpening;
import com.worldadvancedtechnology.entity.ServiceItem;
import com.worldadvancedtechnology.entity.SiteSetting;
import com.worldadvancedtechnology.entity.Submission;
import com.worldadvancedtechnology.entity.TeamMember;
import com.worldadvancedtechnology.entity.TextOverride;
import com.worldadvancedtechnology.entity.WorkItem;
import com.worldadvancedtechnology.repo.EmployeeSpotlightRepository;
import com.worldadvancedtechnology.repo.JobOpeningRepository;
import com.worldadvancedtechnology.repo.ServiceItemRepository;
import com.worldadvancedtechnology.repo.SiteSettingRepository;
import com.worldadvancedtechnology.repo.SubmissionRepository;
import com.worldadvancedtechnology.repo.TeamMemberRepository;
import com.worldadvancedtechnology.repo.TextOverrideRepository;
import com.worldadvancedtechnology.repo.WorkItemRepository;
import com.worldadvancedtechnology.service.AdminUserService;
import com.worldadvancedtechnology.service.BackupService;
import com.worldadvancedtechnology.service.ContentEvents;
import com.worldadvancedtechnology.service.ContentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Secured admin API ({@code /admin/api/**}). Backs the dashboard: content CRUD,
 * section visibility, text overrides, submissions inbox, image uploads, backups
 * and password change.
 */
@RestController
@RequestMapping(value = "/admin/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class AdminController {

    private final ContentService content;
    private final SiteSettingRepository settings;
    private final TextOverrideRepository overrides;
    private final ServiceItemRepository services;
    private final TeamMemberRepository team;
    private final WorkItemRepository work;
    private final JobOpeningRepository jobs;
    private final SubmissionRepository submissions;
    private final BackupService backups;
    private final AdminUserService adminUsers;
    private final EmployeeSpotlightRepository spotlight;
    private final ContentEvents events;

    @Value("${wat.data-dir:./data}")
    private String dataDir;

    public AdminController(ContentService content, SiteSettingRepository settings,
                           TextOverrideRepository overrides, ServiceItemRepository services,
                           TeamMemberRepository team, WorkItemRepository work,
                           JobOpeningRepository jobs, SubmissionRepository submissions,
                           BackupService backups, AdminUserService adminUsers,
                           EmployeeSpotlightRepository spotlight, ContentEvents events) {
        this.content = content;
        this.settings = settings;
        this.overrides = overrides;
        this.services = services;
        this.team = team;
        this.work = work;
        this.jobs = jobs;
        this.submissions = submissions;
        this.backups = backups;
        this.adminUsers = adminUsers;
        this.spotlight = spotlight;
        this.events = events;
    }

    private static Map<String, Object> ok() {
        return Map.of("ok", true);
    }

    /** Evict the cached payload and notify connected pages (live update). */
    private void changed() {
        content.evictCache();
        events.publish();
    }

    // ---- who am I ----
    @GetMapping("/me")
    public Map<String, Object> me(org.springframework.security.core.Authentication auth) {
        String username = auth == null ? "" : auth.getName();
        String role = "VIEWER";
        if (auth != null) {
            for (var a : auth.getAuthorities()) {
                String r = a.getAuthority();
                if (r != null && r.startsWith("ROLE_")) { role = r.substring(5); break; }
            }
        }
        return Map.of("username", username, "role", role);
    }

    // ---- full editable state (all items, incl. hidden/inactive) ----
    @GetMapping("/state")
    public Map<String, Object> state() {
        return content.publicContent();
    }

    // ---- section visibility ----
    @PostMapping("/visibility")
    public Map<String, Object> setVisibility(@RequestBody Map<String, Object> body) {
        String section = String.valueOf(body.get("section"));
        boolean visible = Boolean.parseBoolean(String.valueOf(body.get("visible")));
        settings.save(new SiteSetting("section." + section + ".visible", String.valueOf(visible)));
        changed();
        return ok();
    }

    // ---- text overrides ----
    @GetMapping("/overrides")
    public Map<String, Map<String, String>> getOverrides() {
        return content.overrideMap();
    }

    @PutMapping("/overrides")
    @SuppressWarnings("unchecked")
    public Map<String, Object> putOverride(@RequestBody Map<String, Object> body) {
        String key = String.valueOf(body.get("key"));
        Map<String, Object> values = (Map<String, Object>) body.getOrDefault("values", Map.of());
        for (String lang : new String[]{"en", "fr", "es", "de"}) {
            Object raw = values.get(lang);
            String val = raw == null ? null : String.valueOf(raw);
            TextOverride existing = overrides.findByTextKeyAndLang(key, lang).orElse(null);
            if (val == null || val.isBlank()) {
                // Blank means "use the built-in value" — drop any override.
                if (existing != null) overrides.delete(existing);
            } else if (existing != null) {
                existing.setValue(val);
                overrides.save(existing);
            } else {
                overrides.save(new TextOverride(key, lang, val));
            }
        }
        changed();
        return ok();
    }

    // ---- services ----
    @PostMapping("/services")
    public ServiceItem createService(@RequestBody ServiceItem s) {
        s.setId(null);
        ServiceItem saved = services.save(s);
        changed();
        return saved;
    }

    @PutMapping("/services/{id}")
    public ServiceItem updateService(@PathVariable Long id, @RequestBody ServiceItem s) {
        s.setId(id);
        ServiceItem saved = services.save(s);
        changed();
        return saved;
    }

    @DeleteMapping("/services/{id}")
    public Map<String, Object> deleteService(@PathVariable Long id) {
        services.deleteById(id);
        changed();
        return ok();
    }

    // ---- team ----
    @PostMapping("/team")
    public TeamMember createMember(@RequestBody TeamMember m) {
        m.setId(null);
        TeamMember saved = team.save(m);
        changed();
        return saved;
    }

    @PutMapping("/team/{id}")
    public TeamMember updateMember(@PathVariable Long id, @RequestBody TeamMember m) {
        m.setId(id);
        TeamMember saved = team.save(m);
        changed();
        return saved;
    }

    @DeleteMapping("/team/{id}")
    public Map<String, Object> deleteMember(@PathVariable Long id) {
        team.deleteById(id);
        changed();
        return ok();
    }

    // ---- work ----
    @PostMapping("/work")
    public WorkItem createWork(@RequestBody WorkItem w) {
        w.setId(null);
        WorkItem saved = work.save(w);
        changed();
        return saved;
    }

    @PutMapping("/work/{id}")
    public WorkItem updateWork(@PathVariable Long id, @RequestBody WorkItem w) {
        w.setId(id);
        WorkItem saved = work.save(w);
        changed();
        return saved;
    }

    @DeleteMapping("/work/{id}")
    public Map<String, Object> deleteWork(@PathVariable Long id) {
        work.deleteById(id);
        changed();
        return ok();
    }

    // ---- jobs ----
    @PostMapping("/jobs")
    public JobOpening createJob(@RequestBody JobOpening j) {
        j.setId(null);
        JobOpening saved = jobs.save(j);
        changed();
        return saved;
    }

    @PutMapping("/jobs/{id}")
    public JobOpening updateJob(@PathVariable Long id, @RequestBody JobOpening j) {
        j.setId(id);
        JobOpening saved = jobs.save(j);
        changed();
        return saved;
    }

    @DeleteMapping("/jobs/{id}")
    public Map<String, Object> deleteJob(@PathVariable Long id) {
        jobs.deleteById(id);
        changed();
        return ok();
    }

    // ---- employee spotlight (Employee of the Month/Week) ----
    @GetMapping("/spotlight")
    public EmployeeSpotlight getSpotlight() {
        return spotlight.findById(1L).orElseGet(EmployeeSpotlight::new);
    }

    @PutMapping("/spotlight")
    public EmployeeSpotlight putSpotlight(@RequestBody EmployeeSpotlight s) {
        s.setId(1L);
        EmployeeSpotlight saved = spotlight.save(s);
        changed();
        return saved;
    }

    // ---- submissions inbox ----
    @GetMapping("/submissions")
    public List<Submission> listSubmissions() {
        return submissions.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping("/submissions/{id}/read")
    public Map<String, Object> markRead(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        boolean read = Boolean.parseBoolean(String.valueOf(body.getOrDefault("read", true)));
        submissions.findById(id).ifPresent(s -> {
            s.setRead(read);
            submissions.save(s);
        });
        return ok();
    }

    @DeleteMapping("/submissions/{id}")
    public Map<String, Object> deleteSubmission(@PathVariable Long id) {
        submissions.deleteById(id);
        return ok();
    }

    @GetMapping("/submissions/{id}/cv")
    public ResponseEntity<FileSystemResource> downloadCv(@PathVariable Long id) {
        Submission s = submissions.findById(id).orElse(null);
        if (s == null || s.getCvFile() == null || s.getCvFile().isBlank()) {
            return ResponseEntity.notFound().build();
        }
        Path f = Paths.get(dataDir, "cv", s.getCvFile());
        if (!Files.exists(f)) return ResponseEntity.notFound().build();
        String ext = "";
        int dot = s.getCvFile().lastIndexOf('.');
        if (dot >= 0) ext = s.getCvFile().substring(dot);
        String safeName = (s.getName() == null ? "applicant" : s.getName()).replaceAll("[^A-Za-z0-9]+", "_");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"CV-" + safeName + ext + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new FileSystemResource(f));
    }

    // ---- image upload ----
    @PostMapping(value = "/uploads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("ok", false, "message", "Empty file"));
        }
        String ct = file.getContentType();
        if (ct == null || !ct.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("ok", false, "message", "Only image files are allowed"));
        }
        String original = file.getOriginalFilename() == null ? "img" : file.getOriginalFilename();
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0 && dot < original.length() - 1) {
            ext = original.substring(dot).replaceAll("[^A-Za-z0-9.]", "");
        }
        String name = UUID.randomUUID().toString().replace("-", "") + ext;
        Path uploads = Paths.get(dataDir, "uploads");
        Files.createDirectories(uploads);
        file.transferTo(uploads.resolve(name).toAbsolutePath());
        return ResponseEntity.ok(Map.of("ok", true, "path", "/uploads/" + name));
    }

    // ---- backups ----
    @GetMapping("/backups")
    public List<Map<String, Object>> listBackups() throws IOException {
        return backups.listBackups();
    }

    @PostMapping("/backups")
    public Map<String, Object> createBackup() throws IOException {
        return Map.of("ok", true, "name", backups.createBackup("backup"));
    }

    @PostMapping("/backups/{name}/restore")
    public Map<String, Object> restoreBackup(@PathVariable String name) throws IOException {
        backups.restore(name);
        changed();
        return ok();
    }

    @DeleteMapping("/backups/{name}")
    public Map<String, Object> deleteBackup(@PathVariable String name) throws IOException {
        backups.deleteBackup(name);
        return ok();
    }

    @GetMapping("/backups/{name}/download")
    public ResponseEntity<FileSystemResource> downloadBackup(@PathVariable String name) throws IOException {
        Path file = backups.backupFile(name);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(new FileSystemResource(file));
    }

    // ---- account: change password ----
    @PostMapping("/account/password")
    public ResponseEntity<Map<String, Object>> changePassword(Principal p, @RequestBody Map<String, Object> body) {
        String current = String.valueOf(body.getOrDefault("current", ""));
        String next = String.valueOf(body.getOrDefault("next", ""));
        if (next.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("ok", false, "message", "New password must be at least 8 characters."));
        }
        boolean okChange = adminUsers.changePassword(p.getName(), current, next);
        if (!okChange) {
            return ResponseEntity.badRequest().body(Map.of("ok", false, "message", "Current password is incorrect."));
        }
        return ResponseEntity.ok(Map.of("ok", true, "message", "Password updated. Please log in again."));
    }
}
