# WORLD ADVANCED TECHNOLOGY — Website (`app-wat`)

A premium, cinematic company website for **World Advanced Technology (WAT)** — an IT
Consultancy, DevOps and private VoIP company based in **Yaoundé, Cameroon**.

Built as a single self-contained **Spring Boot** application that serves a static,
animated front-end and exposes a small JSON API for the contact and careers forms.

- **Artifact:** `app-wat`  •  **Version:** `3.0.0`
- **Group:** `com.worldadvancedtechnology`
- **Runs on:** **port 8081** (configurable)
- **Author:** NGWA CLOVIS OCHANG — CEO & Lead Architect

---

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Prerequisites](#prerequisites)
5. [Build & Run](#build--run)
6. [Configuration](#configuration)
7. [HTTP API](#http-api)
8. [Front-End Details](#front-end-details)
9. [Docker](#docker)
10. [Kubernetes](#kubernetes)
11. [Code Quality — SonarQube](#code-quality--sonarqube)
12. [Publishing — Nexus](#publishing--nexus)
13. [Company Information](#company-information)
14. [Notes & Known Points](#notes--known-points)

---

## Features

### Front-end (static site)
- **Cinematic premium design** — animated aurora background, film grain + vignette,
  scroll-progress bar, kinetic hero headline, a CSS-3D orbiting-icon hero visual,
  tech marquee, staggered scroll reveals and animated stat counters.
- **3D interactions** — pointer-driven tilt on cards; a work-gallery carousel with
  3D tilt, cursor glare and a 3D swing-in entrance.
- **Dark / light theme toggle** — a vibrant, colorful light mode and a dark mode,
  remembered per visitor (`localStorage`).
- **Full i18n in 4 languages** — English, French, Spanish, German (toggle in the header).
- **Services** with per-service detail modals (IT Consultancy, DevOps, VoIP, Network &
  Security, Web & Mobile, Starlink, WiFi Zones).
- **"Our Work" gallery** — a horizontal carousel of real client-work photos with a
  full-screen lightbox (left/right navigation, keyboard + swipe).
- **Instant-discussion chatbot** — a rule-based "WAT Assistant" (EN/FR, with EN fallback
  for ES/DE) that answers common questions and hands off to WhatsApp/email. Chat history
  is retained in `localStorage` **only after the visitor taps "Accept"** (consent-gated;
  nothing is sent to a server).
- **Floating actions** — WhatsApp button, a red **Emergency Call** button
  (`tel:+237651798173`, pulsing, translated label), and back-to-top.
- **Contact & Careers forms** posting to the JSON API, with inline validation feedback.
- **Accessibility** — respects `prefers-reduced-motion`; 3D/tilt effects only run on
  fine-pointer devices.
- **SEO** — Open Graph tags and `LocalBusiness` JSON-LD structured data.

### Back-end
- Serves the static site and exposes a small JSON API (`/api/contact`, `/api/careers`).
- **Bean Validation** on all form submissions with structured error responses.
- **Email notifications** (optional) via Spring Mail — submissions are always logged;
  email is sent only when SMTP is configured and enabled.
- **Actuator** health endpoints (incl. Kubernetes liveness/readiness probes).
- HTTP/2, response compression and tuned static-resource caching.

---

## Tech Stack

| Layer      | Technology |
|------------|-----------|
| Language   | Java 17 |
| Framework  | Spring Boot 3.5.6 (Web, Validation, Actuator, Mail) |
| Build      | Maven (with Maven Wrapper, Maven 3.9.10) |
| Front-end  | Vanilla HTML + CSS + JavaScript (no framework, no WebGL) |
| Fonts      | Space Grotesk, Inter |
| Packaging  | Executable Spring Boot fat JAR (`target/app-wat.jar`) |
| Container  | Docker (multi-stage, Temurin 21 JRE Alpine, non-root) |
| Quality    | SonarQube (`sonar-maven-plugin`) + JaCoCo coverage |
| Registry   | Nexus Repository Manager (`distributionManagement`) |

---

## Project Structure

```
app-wat/
├── pom.xml                      # Maven build (deps, Sonar/JaCoCo, Nexus distribution)
├── mvnw, mvnw.cmd, .mvn/        # Maven Wrapper (pins Maven 3.9.10)
├── Dockerfile                   # Multi-stage container build
├── .dockerignore
├── sonar-project.properties     # Config for the standalone sonar-scanner CLI
├── deployment.yml               # Kubernetes Deployment
├── service.yml                  # Kubernetes Services (ClusterIP / NodePort / LoadBalancer)
├── deployment-service.yaml      # Combined K8s manifest
├── workpics/                    # Source client-work photos (not bundled; JPG/HEIC)
└── src/
    ├── main/
    │   ├── java/com/worldadvancedtechnology/
    │   │   ├── WatWebsiteApplication.java      # Spring Boot entry point
    │   │   ├── api/
    │   │   │   ├── FormController.java          # POST /api/contact, /api/careers
    │   │   │   ├── ApiResult.java               # JSON response record
    │   │   │   └── ApiExceptionHandler.java     # Validation → structured errors
    │   │   ├── dto/
    │   │   │   ├── ContactRequest.java
    │   │   │   └── JobApplicationRequest.java
    │   │   ├── service/
    │   │   │   └── NotificationService.java     # Logs + optional email
    │   │   └── config/
    │   │       └── WebConfig.java               # Static-resource cache headers
    │   └── resources/
    │       ├── application.yml                  # Server, mail, actuator config
    │       └── static/
    │           ├── index.html                   # The whole page
    │           ├── assets/css/styles.css
    │           ├── assets/js/app.js             # i18n, theme, chatbot, gallery, effects
    │           └── images/                      # logo, services, team, work/
    └── test/java/...                            # WatWebsiteApplicationTests
```

---

## Prerequisites

- **JDK 17+** (the project targets Java 17; an **arm64** JDK is required on Apple Silicon —
  an x86_64 JDK under Rosetta can hang).
- Maven is **not** required — use the bundled wrapper (`./mvnw`).
- (Optional) Docker, a Kubernetes cluster, SonarQube, Nexus.

---

## Build & Run

Using the Maven Wrapper (recommended — no local Maven needed):

```bash
# macOS / Linux
./mvnw clean package -DskipTests
java -jar target/app-wat.jar

# Windows
mvnw.cmd clean package -DskipTests
java -jar target/app-wat.jar
```

Then open **http://localhost:8081**.

> **First build after plugin changes must be online** — JaCoCo and the Sonar plugin are
> downloaded on first use, so don't use `-o` (offline) the first time.

Run tests / coverage:

```bash
./mvnw clean verify          # runs tests + writes target/site/jacoco/jacoco.xml
```

---

## Configuration

All settings live in `src/main/resources/application.yml` and can be overridden with
environment variables.

| Setting | Env var | Default | Purpose |
|---------|---------|---------|---------|
| Server port | `PORT` | `8081` | HTTP port |
| SMTP host | `MAIL_HOST` | *(empty)* | Mail server host |
| SMTP port | `MAIL_PORT` | `587` | Mail server port |
| SMTP user | `MAIL_USERNAME` | *(empty)* | Mail username |
| SMTP password | `MAIL_PASSWORD` | *(empty)* | Mail password |
| Enable email | `WAT_MAIL_ENABLED` | `false` | Actually send emails |
| Recipient | `WAT_MAIL_TO` | `worldadvancedtechnology23@gmail.com` | Where submissions go |
| Sender | `WAT_MAIL_FROM` | `no-reply@worldadvancedtechnology.cm` | From address |

Example — run on port 8080 with email enabled:

```bash
PORT=8080 \
WAT_MAIL_ENABLED=true \
MAIL_HOST=smtp.gmail.com MAIL_USERNAME=you@example.com MAIL_PASSWORD=app-password \
java -jar target/app-wat.jar
```

Management/actuator exposes only `health` and `info`
(`/actuator/health`, `/actuator/health/liveness`, `/actuator/health/readiness`).
The SMTP health check is disabled so an unconfigured mail server won't mark the app DOWN.

---

## HTTP API

Base path: `/api` • JSON in / JSON out.

### `POST /api/contact`
Request body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+237 6xx xxx xxx",
  "service": "VoIP Solutions",
  "subject": "Quote request",
  "message": "I'd like a VoIP quote."
}
```
Required: `name`, `email` (valid), `message`. Others optional (size-limited).

### `POST /api/careers`
Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+237 6xx xxx xxx",
  "position": "DevOps Engineer",
  "experience": "3 years",
  "message": "Cover letter / message."
}
```
Required: `name`, `email` (valid), `position`.

### Responses
Success:
```json
{ "ok": true, "message": "Thank you, Jane Doe! Your message has been received — we respond within 2 hours.", "errors": null }
```
Validation error (HTTP 400):
```json
{ "ok": false, "message": "Please fix the highlighted fields.", "errors": { "email": "Please enter a valid email address" } }
```

Every submission is logged; an email is sent only when `WAT_MAIL_ENABLED=true` and SMTP is configured.

---

## Front-End Details

- Single page: `src/main/resources/static/index.html`.
- All behaviour in `assets/js/app.js` (one IIFE): i18n dictionary `T` (en/fr/es/de),
  theme toggle (`wat-theme`), language toggle (`wat-lang`), service modals, scroll
  effects, animated counters, pointer tilt, the work-gallery carousel + lightbox, and
  the chatbot module (`initChatbot`).
- Styling in `assets/css/styles.css` using CSS custom properties; the light theme is a
  separate `:root[data-theme="light"]` block.
- Persistent client-side keys: `wat-theme`, `wat-lang`, `wat-chat-consent`, `wat-chat-history`.
- Company figures shown on the site (kept consistent everywhere): **38+ Clients Served**,
  **7+ Years Experience**, **35+ Projects**, **24/7 Support**, founded **2019**.

---

## Docker

Multi-stage build (builds with Maven + Temurin 21, runs on a non-root Alpine JRE):

```bash
docker build -t app-wat:3.0.0 .
docker run -p 8080:8080 -e PORT=8080 app-wat:3.0.0
# open http://localhost:8080
```

The image `EXPOSE`s **8080** and has a `HEALTHCHECK` on `/actuator/health`, so set
`PORT=8080` when running the container (the app itself defaults to 8081).

---

## Kubernetes

Manifests are in the repo root:

- `deployment.yml` — a `Deployment` (2 replicas, container port 8080 via `PORT=8080`,
  startup/liveness/readiness probes on the actuator endpoints, resource limits, hardened
  non-root `securityContext`, optional `app-wat-mail` Secret for SMTP).
- `service.yml` — three Services defined separately: **ClusterIP** (`app-wat`),
  **NodePort** (`app-wat-nodeport`, 30080), **LoadBalancer** (`app-wat-lb`).
- `deployment-service.yaml` — a combined manifest.

```bash
# set a real image first in deployment.yml (image: app-wat:3.0.0 is a placeholder)
kubectl apply -f deployment.yml -f service.yml
```

---

## Code Quality — SonarQube

Configured in `pom.xml` (`sonar-maven-plugin` + JaCoCo). Run analysis:

```bash
# start SonarQube (example)
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community

# build + test + coverage, then analyze
./mvnw clean verify sonar:sonar -Dsonar.token=YOUR_TOKEN
```

- Default server: `http://localhost:9000` (override with `-Dsonar.host.url=...`).
- Coverage report consumed from `target/site/jacoco/jacoco.xml`.
- **Never commit the token** — pass it via `-Dsonar.token=` or `SONAR_TOKEN`.
- `sonar-project.properties` exists for the standalone `sonar-scanner` CLI (ignored when
  running via Maven).

---

## Publishing — Nexus

`pom.xml` defines `distributionManagement` for `mvn deploy`:

```bash
./mvnw clean deploy
```

Before deploying:
1. Replace `NEXUS_HOST` in `pom.xml` with your Nexus host (use HTTPS if available).
2. Add matching `<server>` credentials for ids `nexus-releases` / `nexus-snapshots` in
   `~/.m2/settings.xml` (never in `pom.xml`).

Maven routes by version automatically: `-SNAPSHOT` → snapshots repo, release → releases repo.

---

## Company Information

- **Company:** World Advanced Technology (WAT)
- **Location:** Nkolbisson, L'Caramba, Yaoundé, Cameroon
- **Hours:** Mon–Fri, 08:00–17:00
- **Phone / WhatsApp / Emergency:** +237 651 798 173
- **Email:** worldadvancedtechnology23@gmail.com
- **Payments:** MTN MoMo +237 651 798 173 • Orange Money +237 693 638 404
- **Services:** IT Consultancy • DevOps • VoIP Solutions • Network & Security •
  Web & Mobile Development • Starlink Installation • WiFi Zone Setup

---

## Notes & Known Points

- **Apple Silicon:** build and run with an **arm64 JDK** (JDK 25 arm64 confirmed working).
  An x86_64 JDK/toolchain under Rosetta can hang.
- The JAR is ~36–42 MB because the client-work photos are bundled under
  `images/work/` (converted from the originals in `workpics/`).
- **Not a Git repository** yet — run `git init` to start version control.
- The site advertises "24/7 Support" while office hours are Mon–Fri 08:00–17:00; align
  the wording if a single message is preferred.

---

© World Advanced Technology. Built with Spring Boot.
