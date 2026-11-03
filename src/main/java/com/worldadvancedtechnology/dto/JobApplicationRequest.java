package com.worldadvancedtechnology.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * A careers application submitted through the "We Are Hiring" form.
 */
public record JobApplicationRequest(

        @NotBlank(message = "Name is required")
        @Size(max = 120)
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Please enter a valid email address")
        @Size(max = 160)
        String email,

        @Size(max = 40)
        String phone,

        @NotBlank(message = "Please select the position you are applying for")
        @Size(max = 120)
        String position,

        @Size(max = 40)
        String experience,

        @NotBlank(message = "A short cover message is required")
        @Size(max = 4000)
        String message
) {}
