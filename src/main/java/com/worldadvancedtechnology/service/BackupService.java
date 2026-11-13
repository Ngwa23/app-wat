package com.worldadvancedtechnology.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.worldadvancedtechnology.entity.JobOpening;
import com.worldadvancedtechnology.entity.ServiceItem;
import com.worldadvancedtechnology.entity.SiteSetting;
import com.worldadvancedtechnology.entity.TeamMember;
import com.worldadvancedtechnology.entity.TextOverride;
import com.worldadvancedtechnology.entity.WorkItem;
import com.worldadvancedtechnology.repo.JobOpeningRepository;
import com.worldadvancedtechnology.repo.ServiceItemRepository;
import com.worldadvancedtechnology.repo.SiteSettingRepository;
import com.worldadvancedtechnology.repo.TeamMemberRepository;
import com.worldadvancedtechnology.repo.TextOverrideRepository;
import com.worldadvancedtechnology.repo.WorkItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

/**
 * Backup &amp; restore of the admin-editable content (sections visibility, text
 * overrides and the four collections) as timestamped JSON snapshots on disk.
 * Submissions and the admin account are intentionally left out — a restore
 * changes site content only.
 */
@Service
public class BackupService {

    private static final Logger log = LoggerFactory.getLogger(BackupService.class);
    private static final DateTimeFormatter STAMP =
            DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss").withZone(ZoneId.systemDefault());

    private final SiteSettingRepository settings;
    private final TextOverrideRepository overrides;
    private final ServiceItemRepository services;
    private final TeamMemberRepository team;
    private final WorkItemRepository work;
    private final JobOpeningRepository jobs;
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${wat.data-dir:./data}")
    private String dataDir;

    public BackupService(SiteSettingRepository settings, TextOverrideRepository overrides,
                         ServiceItemRepository services, TeamMemberRepository team,
                         WorkItemRepository work, JobOpeningRepository jobs) {
        this.settings = settings;
        this.overrides = overrides;
        this.services = services;
        this.team = team;
        this.work = work;
        this.jobs = jobs;
    }

    /** JSON-serializable snapshot of all editable content. */
    public static class Snapshot {
        public List<SiteSetting> settings = new ArrayList<>();
        public List<TextOverride> overrides = new ArrayList<>();
        public List<ServiceItem> services = new ArrayList<>();
        public List<TeamMember> team = new ArrayList<>();
        public List<WorkItem> work = new ArrayList<>();
        public List<JobOpening> jobs = new ArrayList<>();
    }

    private Path dir() throws IOException {
        Path p = Paths.get(dataDir, "backups");
        Files.createDirectories(p);
        return p;
    }

    @Transactional(readOnly = true)
    public String createBackup(String labelPrefix) throws IOException {
        Snapshot snap = new Snapshot();
        snap.settings = settings.findAll();
        snap.overrides = overrides.findAll();
        snap.services = services.findAll();
        snap.team = team.findAll();
        snap.work = work.findAll();
        snap.jobs = jobs.findAll();

        String prefix = (labelPrefix == null || labelPrefix.isBlank()) ? "backup" : labelPrefix;
        String name = prefix + "-" + STAMP.format(Instant.now()) + ".json";
        Path file = dir().resolve(name);
        mapper.writerWithDefaultPrettyPrinter().writeValue(file.toFile(), snap);
        log.info("Created content backup {}", name);
        return name;
    }

    public List<Map<String, Object>> listBackups() throws IOException {
        try (Stream<Path> s = Files.list(dir())) {
            return s.filter(p -> p.getFileName().toString().endsWith(".json"))
                    .sorted(Comparator.comparing((Path p) -> p.getFileName().toString()).reversed())
                    .map(p -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("name", p.getFileName().toString());
                        try {
                            m.put("size", Files.size(p));
                            m.put("modified", Files.getLastModifiedTime(p).toMillis());
                        } catch (IOException e) {
                            m.put("size", 0);
                            m.put("modified", 0);
                        }
                        return m;
                    })
                    .toList();
        }
    }

    private Path resolveSafe(String name) throws IOException {
        // Guard against path traversal — only a plain file name in the backups dir.
        if (name == null || name.contains("/") || name.contains("\\") || name.contains("..")) {
            throw new IllegalArgumentException("Invalid backup name");
        }
        Path file = dir().resolve(name);
        if (!Files.exists(file)) {
            throw new IllegalArgumentException("No such backup: " + name);
        }
        return file;
    }

    @Transactional
    public void restore(String name) throws IOException {
        Path file = resolveSafe(name);
        Snapshot snap = mapper.readValue(file.toFile(), Snapshot.class);

        // Safety net: snapshot the current state before overwriting it.
        createBackup("autobackup");

        settings.deleteAllInBatch();
        overrides.deleteAllInBatch();
        services.deleteAllInBatch();
        team.deleteAllInBatch();
        work.deleteAllInBatch();
        jobs.deleteAllInBatch();

        settings.saveAll(snap.settings);
        snap.overrides.forEach(o -> o.setId(null));
        overrides.saveAll(snap.overrides);
        snap.services.forEach(e -> e.setId(null));
        services.saveAll(snap.services);
        snap.team.forEach(e -> e.setId(null));
        team.saveAll(snap.team);
        snap.work.forEach(e -> e.setId(null));
        work.saveAll(snap.work);
        snap.jobs.forEach(e -> e.setId(null));
        jobs.saveAll(snap.jobs);
        log.info("Restored content from backup {}", name);
    }

    public void deleteBackup(String name) throws IOException {
        Files.deleteIfExists(resolveSafe(name));
    }

    public Path backupFile(String name) throws IOException {
        return resolveSafe(name);
    }
}
