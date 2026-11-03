package com.worldadvancedtechnology.api;

import java.util.Map;

/**
 * Small, uniform JSON envelope returned by the form API.
 *
 * @param ok      whether the request succeeded
 * @param message a human-friendly message the front-end can show
 * @param errors  field-level validation errors (empty on success)
 */
public record ApiResult(boolean ok, String message, Map<String, String> errors) {

    public static ApiResult success(String message) {
        return new ApiResult(true, message, Map.of());
    }

    public static ApiResult failure(String message, Map<String, String> errors) {
        return new ApiResult(false, message, errors);
    }
}
