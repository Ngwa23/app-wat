package com.worldadvancedtechnology.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.worldadvancedtechnology.entity.AdminUser;
import com.worldadvancedtechnology.entity.EmployeeSpotlight;
import com.worldadvancedtechnology.entity.JobOpening;
import com.worldadvancedtechnology.entity.ServiceItem;
import com.worldadvancedtechnology.entity.SiteSetting;
import com.worldadvancedtechnology.entity.TeamMember;
import com.worldadvancedtechnology.entity.WorkItem;
import com.worldadvancedtechnology.repo.AdminUserRepository;
import com.worldadvancedtechnology.repo.EmployeeSpotlightRepository;
import com.worldadvancedtechnology.repo.JobOpeningRepository;
import com.worldadvancedtechnology.repo.ServiceItemRepository;
import com.worldadvancedtechnology.repo.SiteSettingRepository;
import com.worldadvancedtechnology.repo.TeamMemberRepository;
import com.worldadvancedtechnology.repo.WorkItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;

/**
 * Seeds the database on first run so the public site renders exactly the same
 * content it did as a static page. Text comes from {@code assets/i18n/base.json};
 * structure (icons, images, ordering, team) comes from {@code seed/seed.json},
 * which was generated from the original {@code index.html}.
 *
 * <p>Idempotent: each collection is only seeded when its table is empty, so
 * admin edits are never overwritten on restart.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    /** Sections the admin can show/hide (all visible by default). */
    static final String[] TOGGLE_SECTIONS = {
            "about", "services", "voip", "work", "team", "spotlight",
            "testimonials", "reviews", "cta", "payment", "careers", "contact"
    };

    private final AdminUserRepository adminUsers;
    private final SiteSettingRepository settings;
    private final ServiceItemRepository services;
    private final TeamMemberRepository team;
    private final WorkItemRepository work;
    private final JobOpeningRepository jobs;
    private final EmployeeSpotlightRepository spotlight;

    @Value("${wat.admin.username}")
    private String adminUsername;

    @Value("${wat.admin.password-hash}")
    private String adminPasswordHash;

    private final ObjectMapper mapper = new ObjectMapper();
    private JsonNode base;
    private JsonNode seed;

    public DataSeeder(AdminUserRepository adminUsers, SiteSettingRepository settings,
                      ServiceItemRepository services, TeamMemberRepository team,
                      WorkItemRepository work, JobOpeningRepository jobs,
                      EmployeeSpotlightRepository spotlight) {
        this.adminUsers = adminUsers;
        this.settings = settings;
        this.services = services;
        this.team = team;
        this.work = work;
        this.jobs = jobs;
        this.spotlight = spotlight;
    }

    @Override
    public void run(String... args) throws Exception {
        base = read("static/assets/i18n/base.json");
        seed = read("seed/seed.json");

        seedAdmin();
        seedVisibility();
        seedServices();
        seedTeam();
        seedWork();
        seedJobs();
        seedSpotlight();
    }

    private void seedSpotlight() {
        if (spotlight.existsById(1L)) return;
        EmployeeSpotlight s = new EmployeeSpotlight();
        s.setId(1L);
        s.setEnabled(true);
        s.setPeriod("MONTH");
        s.setName("NGWA RANSOME");
        s.setImagePath("/images/team/ransome.jpg");
        s.setRoleEn("Employee of the Month");
        s.setRoleFr("Employé du mois");
        s.setRoleEs("Empleado del mes");
        s.setRoleDe("Mitarbeiter des Monats");
        s.setCitationEn("Recognised for outstanding dedication, teamwork and excellent service to our clients.");
        s.setCitationFr("Reconnu pour son dévouement exceptionnel, son esprit d'équipe et son excellent service client.");
        s.setCitationEs("Reconocido por su extraordinaria dedicación, trabajo en equipo y excelente servicio al cliente.");
        s.setCitationDe("Ausgezeichnet für außergewöhnliches Engagement, Teamwork und hervorragenden Kundenservice.");
        spotlight.save(s);
        log.info("Seeded employee spotlight.");
    }

    private JsonNode read(String classpath) throws Exception {
        try (InputStream in = new ClassPathResource(classpath).getInputStream()) {
            return mapper.readTree(in);
        }
    }

    /** Built-in text for a key in a given language (null if absent). */
    private String txt(String lang, String key) {
        if (key == null) return null;
        JsonNode l = base.get(lang);
        if (l == null) return null;
        JsonNode v = l.get(key);
        return v == null ? null : v.asText();
    }

    private static String str(JsonNode n, String field) {
        JsonNode v = n.get(field);
        return (v == null || v.isNull()) ? null : v.asText();
    }

    private void seedAdmin() {
        if (adminUsers.count() == 0) {
            adminUsers.save(new AdminUser(adminUsername, adminPasswordHash));
            log.info("Seeded superadmin user '{}'.", adminUsername);
        }
    }

    private void seedVisibility() {
        for (String s : TOGGLE_SECTIONS) {
            String key = "section." + s + ".visible";
            if (!settings.existsById(key)) {
                settings.save(new SiteSetting(key, "true"));
            }
        }
    }

    private void seedServices() {
        if (services.count() > 0) return;
        for (JsonNode n : seed.get("services")) {
            ServiceItem e = new ServiceItem();
            e.setSortOrder(n.get("order").asInt());
            e.setIconSvg(str(n, "iconSvg"));
            e.setCtaType(str(n, "ctaType"));
            String tk = str(n, "titleKey"), dk = str(n, "descKey"), detk = str(n, "detailsKey");
            e.setTitleEn(txt("en", tk)); e.setTitleFr(txt("fr", tk)); e.setTitleEs(txt("es", tk)); e.setTitleDe(txt("de", tk));
            e.setDescEn(txt("en", dk)); e.setDescFr(txt("fr", dk)); e.setDescEs(txt("es", dk)); e.setDescDe(txt("de", dk));
            e.setDetailsEn(txt("en", detk)); e.setDetailsFr(txt("fr", detk)); e.setDetailsEs(txt("es", detk)); e.setDetailsDe(txt("de", detk));
            services.save(e);
        }
        log.info("Seeded {} services.", services.count());
    }

    private void seedTeam() {
        if (team.count() > 0) return;
        for (JsonNode n : seed.get("team")) {
            TeamMember e = new TeamMember();
            e.setSortOrder(n.get("order").asInt());
            e.setName(str(n, "name"));
            e.setImagePath(str(n, "image"));
            e.setBadge(str(n, "badge"));
            e.setLead(n.get("lead").asBoolean());
            String roleKey = str(n, "roleKey");
            if (roleKey != null) {
                e.setRoleEn(txt("en", roleKey)); e.setRoleFr(txt("fr", roleKey));
                e.setRoleEs(txt("es", roleKey)); e.setRoleDe(txt("de", roleKey));
            } else {
                e.setRoleEn(str(n, "roleEn"));
            }
            team.save(e);
        }
        log.info("Seeded {} team members.", team.count());
    }

    private void seedWork() {
        if (work.count() > 0) return;
        for (JsonNode n : seed.get("work")) {
            WorkItem e = new WorkItem();
            e.setSortOrder(n.get("order").asInt());
            e.setThumbPath(str(n, "thumb"));
            e.setFullPath(str(n, "full"));
            String tk = str(n, "titleKey"), ck = str(n, "catKey");
            e.setTitleEn(txt("en", tk)); e.setTitleFr(txt("fr", tk)); e.setTitleEs(txt("es", tk)); e.setTitleDe(txt("de", tk));
            e.setCategoryEn(txt("en", ck)); e.setCategoryFr(txt("fr", ck)); e.setCategoryEs(txt("es", ck)); e.setCategoryDe(txt("de", ck));
            work.save(e);
        }
        log.info("Seeded {} work items.", work.count());
    }

    private void seedJobs() {
        if (jobs.count() > 0) return;
        for (JsonNode n : seed.get("jobs")) {
            JobOpening e = new JobOpening();
            e.setSortOrder(n.get("order").asInt());
            e.setLocation(str(n, "location"));
            e.setType(str(n, "type"));
            String tk = str(n, "titleKey");
            e.setTitleEn(txt("en", tk)); e.setTitleFr(txt("fr", tk)); e.setTitleEs(txt("es", tk)); e.setTitleDe(txt("de", tk));
            jobs.save(e);
        }
        log.info("Seeded {} job openings.", jobs.count());
    }
}
