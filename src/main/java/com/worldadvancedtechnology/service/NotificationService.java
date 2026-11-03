package com.worldadvancedtechnology.service;

import com.worldadvancedtechnology.dto.ContactRequest;
import com.worldadvancedtechnology.dto.JobApplicationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Handles inbound form submissions.
 *
 * <p>Every submission is recorded in the application log so nothing is lost.
 * If SMTP credentials are configured (see {@code application.yml} / environment
 * variables) a notification email is also sent to the WAT inbox. The mail
 * sender is resolved lazily, so the app starts and the forms keep working even
 * when no mail server is configured — ideal for local development.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${wat.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${wat.mail.to:worldadvancedtechnology23@gmail.com}")
    private String recipient;

    @Value("${wat.mail.from:no-reply@worldadvancedtechnology.cm}")
    private String from;

    public NotificationService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    public void handleContact(ContactRequest r) {
        log.info("New contact message | name={} email={} phone={} service={} subject={}",
                r.name(), r.email(), r.phone(), r.service(), r.subject());

        String body = """
                New contact message from the WAT website

                Name    : %s
                Email   : %s
                Phone   : %s
                Service : %s
                Subject : %s

                Message:
                %s
                """.formatted(safe(r.name()), safe(r.email()), safe(r.phone()),
                safe(r.service()), safe(r.subject()), safe(r.message()));

        send("WAT Website — Contact: " + r.subject(), body, r.email());
    }

    public void handleJobApplication(JobApplicationRequest r) {
        log.info("New job application | name={} email={} position={} experience={}",
                r.name(), r.email(), r.position(), r.experience());

        String body = """
                New job application from the WAT website

                Name       : %s
                Email      : %s
                Phone      : %s
                Position   : %s
                Experience : %s

                Cover message:
                %s
                """.formatted(safe(r.name()), safe(r.email()), safe(r.phone()),
                safe(r.position()), safe(r.experience()), safe(r.message()));

        send("WAT Careers — Application: " + r.position(), body, r.email());
    }

    private void send(String subject, String body, String replyTo) {
        if (!mailEnabled) {
            log.debug("Mail delivery disabled; submission recorded to log only.");
            return;
        }
        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null) {
            log.warn("Mail is enabled but no JavaMailSender is configured; skipping email.");
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(from);
            msg.setTo(recipient);
            msg.setReplyTo(replyTo);
            msg.setSubject(subject);
            msg.setText(body);
            sender.send(msg);
            log.info("Notification email sent to {}", recipient);
        } catch (Exception ex) {
            // Never fail the user's submission because of a mail hiccup.
            log.error("Failed to send notification email: {}", ex.getMessage());
        }
    }

    private static String safe(String s) {
        return (s == null || s.isBlank()) ? "—" : s;
    }
}
