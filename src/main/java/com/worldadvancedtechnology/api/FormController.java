package com.worldadvancedtechnology.api;

import com.worldadvancedtechnology.dto.ContactRequest;
import com.worldadvancedtechnology.dto.JobApplicationRequest;
import com.worldadvancedtechnology.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * JSON API backing the contact and careers forms.
 */
@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class FormController {

    private final NotificationService notifications;

    public FormController(NotificationService notifications) {
        this.notifications = notifications;
    }

    @PostMapping(value = "/contact", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResult contact(@Valid @RequestBody ContactRequest request) {
        notifications.handleContact(request);
        return ApiResult.success("Thank you, " + request.name()
                + "! Your message has been received — we respond within 2 hours.");
    }

    @PostMapping(value = "/careers", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ApiResult careers(@Valid @RequestBody JobApplicationRequest request) {
        notifications.handleJobApplication(request);
        return ApiResult.success("Thank you, " + request.name()
                + "! Your application for " + request.position() + " has been submitted.");
    }
}
