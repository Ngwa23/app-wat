package com.worldadvancedtechnology.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Lightweight in-memory pub/sub for Server-Sent Events. The public page keeps
 * one open {@link SseEmitter}; whenever the admin changes content we push a
 * "changed" event so the page can re-fetch and update live — no reload.
 */
@Service
public class ContentEvents {

    private static final Logger log = LoggerFactory.getLogger(ContentEvents.class);
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L); // no timeout
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError(e -> emitters.remove(emitter));
        try {
            emitter.send(SseEmitter.event().name("hello").data("ok"));
        } catch (IOException e) {
            emitters.remove(emitter);
        }
        return emitter;
    }

    /** Notify every connected page that content changed. */
    public void publish() {
        for (SseEmitter e : emitters) {
            try {
                e.send(SseEmitter.event().name("changed").data(String.valueOf(System.currentTimeMillis())));
            } catch (Exception ex) {
                emitters.remove(e);
            }
        }
        log.debug("Published content-changed to {} client(s)", emitters.size());
    }
}
