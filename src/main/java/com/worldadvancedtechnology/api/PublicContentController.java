package com.worldadvancedtechnology.api;

import com.worldadvancedtechnology.service.ContentEvents;
import com.worldadvancedtechnology.service.ContentService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

/**
 * Public, read-only content feed consumed by the front-end on page load, plus
 * a live Server-Sent Events stream that pushes a signal whenever admin content
 * changes so the page updates in real time.
 */
@RestController
@RequestMapping(value = "/api")
public class PublicContentController {

    private final ContentService content;
    private final ContentEvents events;

    public PublicContentController(ContentService content, ContentEvents events) {
        this.content = content;
        this.events = events;
    }

    @GetMapping(value = "/content", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> content() {
        return content.publicContent();
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        return events.subscribe();
    }
}
