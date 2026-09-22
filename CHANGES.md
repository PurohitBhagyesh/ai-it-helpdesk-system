# 📑 Project Changelog & Master Commit Ledger

All major features, security enhancements, architecture implementations, UI overhauls, test suites, and deployment configurations created and committed for the **Enterprise AI IT Support & Helpdesk Platform** are documented below in chronological order.

---

## 🌟 Executive Summary of Completed Work

1. **🏛️ Enterprise Core & Spring Boot 3 Backend:** Full REST API, JPA Repositories, Multi-Tenant Enterprise entities, User identity provisioning, Incident management, Real-time Natural Language AI Triage, and Enquiry Mailbox.
2. **🎨 Apple Cupertino Dark Glass Design System:** Superellipse squircles, liquid ambient gradient lighting, glassmorphism (`backdrop-filter: blur(32px)`), responsive grid scaling, and accessible contrast.
3. **🛡️ 3-Tier Governed Identity Model:** Strict administrative provisioning with two operational sub-roles: `EMPLOYEE` and `IT_TECHNICIAN` (`STAFF`), plus master `ADMIN` passkeys.
4. **🏢 Dynamic Company Branding:** Automatic company name propagation across all portals (`Welcome to <Company Name> Helpdesk` / `Welcome to <Company Name> Support Console`).
5. **📋 Interactive Directory & Live Profile Inspector:** Row-click modal to inspect all extended attributes (Join Date, Experience, Specialization, Designation, Phone, Employee ID Code), edit live via `PUT /api/users/{id}`, or permanently delete accounts.
6. **🎫 Incident Management & Direct Contact Location:** Problem diagnostic studio, category/priority scoring, and reporter contact phone & desk location.
7. **🔒 Security, OWASP & Encrypted Messaging:** Token-bucket IP rate limiter, HTML escaping, SQLi protection, OWASP security headers, SHA-256 salted hashing, and E2EE support room markers.
8. **☁️ Multi-Cloud & GitHub Pages Deployment:** Pre-configured deployment blueprints for **Render** (`render.yaml`), **Railway** (`railway.json`), **Vercel** (`vercel.json`), **Docker Compose** (`docker-compose.yml`), and automated **GitHub Pages** CI/CD (`deploy-pages.yml`).

---

## 📜 Chronological Commit History & Release Notes

### Commit 1: `5d8d057` & `79d8291` — Initial Setup & PRD Baseline
* Initialized Git repository structure and `.gitignore`.
* Created Product Requirements Document ([`PRD.md`](PRD.md)) outlining technical architecture, functional specifications, AI triage rules, and role permissions.

### Commit 2: `4f8c2fa` — Architectural Module Scaffolding
* Created initial directory layout for `frontend/`, `backend/`, and `database/` modules.
* Drafted initial documentation and architectural blueprints.

### Commit 3: `86323dc` — Initial Frontend Construction
* Built initial HTML view templates (`index.html`, `employee-dashboard.html`, `staff-dashboard.html`, `admin-dashboard.html`, `ticket-details.html`).
* Added initial modular ES6 JavaScript clients (`api.js`, `auth.js`, `employee.js`, `staff.js`, `admin.js`, `ticket-details.js`).

### Commit 4: `c363671` — Spring Boot 3 Enterprise Backend Engine
* Implemented core Spring Boot 3 backend application with JPA entities: `User`, `Ticket`, `TicketMessage`, `Resolution`, `Enquiry`, `Enterprise`, `Role`, `Category`, `Priority`, `Status`.
* Built NLP Rule-Based AI engine (`AIService`, `KeywordClassifier`, `SolutionAdvisor`).
* Created REST Controllers: `AuthController`, `TicketController`, `UserController`, `EnquiryController`, `EnterpriseController`, `AdminController`.
* Added [`DataInitializer.java`](backend/src/main/java/com/helpdesk/config/DataInitializer.java) for automated seed data bootstrapping.

### Commit 5: `98dafc6` — Cross-Platform Maven Wrapper
* Added Unix and Windows Maven Wrapper scripts (`mvnw`, `mvnw.cmd`, `.mvn/`) for cross-platform zero-install compilation.

### Commit 6: `6f26cd7` — Security Documentation & Environment Configs
* Created [`SECURITY.md`](SECURITY.md), [`ARCHITECTURE.md`](ARCHITECTURE.md), [`CONTRIBUTING.md`](CONTRIBUTING.md), and [`.env.example`](.env.example).
* Documented vulnerability reporting guidelines and environment variable mappings.

### Commit 7: `8f57783` — OWASP Headers, IP Rate Limiter & SQLi Sanitizer
* Implemented `SecurityHeadersFilter` applying `X-Content-Type-Options`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and `Content-Security-Policy`.
* Built token-bucket `RateLimiter` preventing IP brute force and API flood attacks.
* Created `InputSanitizer` for automated HTML escaping and SQL injection prevention.
* Added responsive media queries for mobile, tablet, and ultra-wide displays.

### Commit 8: `3533bf4` — Containerization & Full-Stack Deployment Guides
* Created multi-stage [`Dockerfile`](Dockerfile) with minimal Alpine JRE runtime and non-root security user.
* Created [`docker-compose.yml`](docker-compose.yml) orchestrating Frontend, Spring Boot, and MySQL 8.0 services.
* Created initial [`DEPLOYMENT.md`](DEPLOYMENT.md).

### Commit 9: `039f5bf` — Apple Cupertino Glass Design Overhaul
* Transformed frontend styling into authentic Apple Cupertino Dark Glass aesthetics.
* Added segmented slider navigation, specular highlights, and real-time live registration forms.

### Commit 10: `7502677` — Admin-Exclusive Provisioning Engine
* Locked down user registration to Admin-only governance.
* Added password assignment and instant credential management tools.

### Commit 11: `62e3bbd` — IT Technician Re-Routing & Admin Mailbox
* Built IT Technician Ticket Acceptance & Rejection engine with audit trail logging.
* Created official Administrator Enquiry Mailbox for bi-directional organizational communication.
* Added AES-256 E2EE chat verification indicators.

### Commit 12: `ec04e62` — Enterprise Registration & Email Verification
* Created multi-step enterprise registration wizard with 6-digit email verification simulation.
* Built macOS Mail Dispatch preview card with 1-click code auto-fill.
* Added initial team onboarding wizard for foundational Employee and Technician provisioning.

### Commit 13: `862e36b` — Company Branding & Interactive User Directory
* Implemented dynamic `Welcome to <Company Name>` banner across all dashboards.
* Added custom Employee fields (`Employee ID Code`, `Join Date`, `Designation`, `Phone`) and Technician fields (`Technician ID Code`, `Experience`, `Specialization`, `Phone`).
* Created interactive Directory Table with row-click Profile Modal for live editing (`PUT /api/users/{id}`) and permanent deletion.
* Added `contactInfo` (Desk Location & Phone) to ticket submission and detail workspaces.
* Added auto-populated Contact Admin enquiry form with submission feedback alert.

### Commit 14: `31152bd` — Multi-Cloud Deployment Blueprints
* Added [`render.yaml`](render.yaml) for Render Blueprint deployments.
* Added [`railway.json`](railway.json) for Railway Docker builds.
* Added [`vercel.json`](vercel.json) and [`frontend/vercel.json`](frontend/vercel.json) for Vercel edge hosting.
* Added dynamic `API_BASE_URL` auto-resolution and interactive `🌐 Backend API Endpoint` modal in [`frontend/index.html`](frontend/index.html).

### Commit 15: `8159e63` — Database Schema DDL Synchronization
* Updated [`database/schema.sql`](database/schema.sql) with all extended fields (`employee_id_code`, `company_name`, `join_date`, `designation`, `experience`, `specialization`, `phone`, `contact_info`, `enquiries`, and `enterprises`).

### Commit 16: `74957e5` — GitHub Pages CI/CD & NoJekyll Setup
* Added [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) for automated GitHub Pages deployments.
* Added [`frontend/.nojekyll`](frontend/.nojekyll) to bypass Jekyll processing on GitHub Pages.

### Commit 17: `05e14b1` — Master Professional README
* Overhauled [`README.md`](README.md) with technology badges, live deployment links matrix, quick start guides, default seed credentials, and repository tree.

### Commit 18: `82f4997` — Comprehensive Unit Test Suite
* Added comprehensive unit test suites for [`UserServiceTest.java`](backend/src/test/java/com/helpdesk/service/UserServiceTest.java) and [`TicketServiceTest.java`](backend/src/test/java/com/helpdesk/service/TicketServiceTest.java).
* Executed 12 unit tests with 100% pass rate.

### Commit 19: `5c94144` — Advanced Apple Cupertino UI & Shape Refinement
* Enhanced [`frontend/css/style.css`](frontend/css/style.css) with Apple superellipse border radii, multi-point ambient liquid radiance, elevated table cards, and fluid responsive clamps.
* Synchronized `gh-pages` branch for immediate live deployment.

### Commit 20: `3b7d51a` — HealthController, Enterprise Re-Registration & Cloudflare Tunnel
* Added [`HealthController.java`](backend/src/main/java/com/helpdesk/controller/HealthController.java) mapping `GET /api/health` with rate-limit bypass.
* Streamlined [`EnterpriseService.java`](backend/src/main/java/com/helpdesk/service/EnterpriseService.java) to automatically clean up unverified enterprise records upon re-registration attempts.
* Enhanced [`frontend/js/api.js`](frontend/js/api.js) fallback simulation across multi-cloud and GitHub Pages environments.
* Installed standalone Apple Silicon [`cloudflared`](~/.local/bin/cloudflared) CLI for zero-cost secure HTTPS backend tunneling.

### Commit 21: `fbdd5b7` — Enterprise & Workforce Login Resolution & End-to-End Test Suite
* Fixed missing `hideAlert` function in [`frontend/index.html`](frontend/index.html) which previously halted authentication form submission and tab switches.
* Added `POST /api/tickets/{id}/assign` endpoint to [`TicketController.java`](backend/src/main/java/com/helpdesk/controller/TicketController.java).
* Built and executed full 10-step end-to-end headless test suite (`scratch/test_flows.js`) verifying health, logins, enterprise onboarding, team provisioning, and ticket lifecycle (100% pass rate).
* Pushed latest build to `origin main` and synchronized live `gh-pages` deployment.

---

## 🌐 Live Production Links

* **Live GitHub Pages Web Application:** 👉 **[https://purohitbhagyesh.github.io/ai-it-helpdesk-system/](https://purohitbhagyesh.github.io/ai-it-helpdesk-system/)**
* **Local Web Application:** `http://localhost:3000`
* **Local Backend API:** `http://localhost:8080/api/tickets`
* **Local H2 Database Console:** `http://localhost:8080/h2-console`
