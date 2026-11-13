package com.worldadvancedtechnology.api;

import com.worldadvancedtechnology.dto.ContactRequest;
import com.worldadvancedtechnology.dto.JobApplicationRequest;
import com.worldadvancedtechnology.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * JSON/multipart API backing the contact and careers forms. Careers accepts an
 * attached CV (PDF/DOC/DOCX) stored privately under the data directory.
 */
@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class FormController {

    private static final Set<String> CV_EXTS = Set.of(".pdf", ".doc", ".docx");
    private static final long MAX_CV_BYTES = 5L * 1024 * 1024;

    private final NotificationService notifications;

    @Value("${wat.data-dir:./data}")
    private String dataDir;

    public FormController(NotificationService notifications) {
        this.notifications = notifications;
    }

    @PostMapping(value = "/contact", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResult contact(@Valid @RequestBody ContactRequest request) {
        notifications.handleContact(request);
        return ApiResult.success("Thank you, " + request.name()
                + "! Your message has been received — we respond within 2 hours.");
    }

    @PostMapping(value = "/careers", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResult> careers(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam(required = false) String phone,
            @RequestParam String position,
            @RequestParam(required = false) String experience,
            @RequestParam String message,
            @RequestParam(value = "cv", required = false) MultipartFile cv) throws IOException {

        Map<String, String> errors = new LinkedHashMap<>();
        if (isBlank(name)) errors.put("name", "Name is required");
        if (isBlank(email)) errors.put("email", "Email is required");
        else if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) errors.put("email", "Please enter a valid email address");
        if (isBlank(position)) errors.put("position", "Please select the position you are applying for");
        if (isBlank(message)) errors.put("message", "A short cover message is required");

        if (cv == null || cv.isEmpty()) {
            errors.put("cv", "Please attach your CV (PDF, DOC or DOCX)");
        } else {
            String ext = extensionOf(cv.getOriginalFilename());
            if (!CV_EXTS.contains(ext)) errors.put("cv", "CV must be a PDF, DOC or DOCX file");
            else if (cv.getSize() > MAX_CV_BYTES) errors.put("cv", "CV is too large (max 5 MB)");
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResult.failure("Please check the highlighted fields and try again.", errors));
        }

        String stored = storeCv(cv);
        notifications.handleJobApplication(
                new JobApplicationRequest(name, email, phone, position, experience, message), stored);
        return ResponseEntity.ok(ApiResult.success("Thank you, " + name
                + "! Your application for " + position + " has been submitted with your CV."));
    }

    private String storeCv(MultipartFile cv) throws IOException {
        String ext = extensionOf(cv.getOriginalFilename());
        String stored = UUID.randomUUID().toString().replace("-", "") + ext;
        Path dir = Paths.get(dataDir, "cv");
        Files.createDirectories(dir);
        cv.transferTo(dir.resolve(stored).toAbsolutePath());
        return stored;
    }

    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }

    private static String extensionOf(String filename) {
        if (filename == null) return "";
        int dot = filename.lastIndexOf('.');
        return dot < 0 ? "" : filename.substring(dot).toLowerCase();
    }
}
