package com.worldadvancedtechnology.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * A message submitted through the "Contact Us" form.
 */
public record ContactRequest(

        @NotBlank(message = "Name is required")
        @Size(max = 120, message = "Name is too long")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Please enter a valid email address")
        @Size(max = 160)
        String email,

        @Size(max = 40)
        String phone,

        @Size(max = 80)
        String service,

        @NotBlank(message = "Subject is required")
        @Size(max = 160)
        String subject,

        @NotBlank(message = "Message is required")
        @Size(max = 4000, message = "Message is too long")
        String message
) {}
