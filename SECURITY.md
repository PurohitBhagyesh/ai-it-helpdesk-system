# Security Policy & Hardening Guide

## 🔒 Security Overview
The **AI-Based IT Support & Helpdesk System** is hardened with defense-in-depth security principles covering Rate Limiting, SQL Injection & XSS sanitization, OWASP HTTP response security headers, password hashing, role-based access control (RBAC), and multi-device adaptive layout design.

---

## 🛡️ Key Security Features Implemented

### 1. ⏱️ Rate Limiting (DoS & Brute-Force Prevention)
* **Component:** `RateLimitFilter.java`
* **Mechanism:** Token bucket / sliding-window tracking per client IP address.
* **Limits:** Configurable rate limit (default `120 requests/minute`) via `app.security.rate-limit.max-requests-per-minute`.
* **Headers Emitted:**
  * `X-RateLimit-Limit: 120`
  * `X-RateLimit-Remaining: 119`
* **Response on Violation:** Returns HTTP `429 Too Many Requests` with a `Retry-After: 60` header.

### 2. 💉 SQL Injection & XSS Sanitization
* **Component:** `InputSanitizer.java`
* **Mechanisms:**
  * **PreparedStatements:** All Spring Data JPA / Hibernate queries use parameterized PreparedStatements preventing SQL injection attacks.
  * **Input Sanitization:** Strips dangerous script tags (`<script>`, `javascript:`, `onerror=`), control characters, and SQL meta-characters from problem titles, descriptions, messages, and resolution reports prior to persistence.
  * **Frontend Escaping:** All dynamic text elements use `escapeHtml()` before rendering to the DOM.

### 3. 🛡️ OWASP Recommended HTTP Security Headers
* **Component:** `SecurityHeadersFilter.java`
* **Applied to every response:**
  * `X-Content-Type-Options: nosniff` (prevents MIME-type sniffing)
  * `X-Frame-Options: SAMEORIGIN` (prevents Clickjacking attacks)
  * `X-XSS-Protection: 1; mode=block` (browser-level XSS filter)
  * `Referrer-Policy: strict-origin-when-cross-origin`
  * `Content-Security-Policy: default-src 'self' ...`

### 4. 🔑 Cryptographic Password Hashing
* **Component:** `PasswordEncoder.java`
* **Algorithm:** SHA-256 with static application salt.
* Supports both secure hashed passwords and safe fallback verification for initial academic demo accounts.

### 5. 🛡️ Secure Global Exception Handler
* **Component:** `GlobalExceptionHandler.java`
* Catches all unhandled server exceptions and returns standardized, sanitized JSON error responses without exposing server stack traces, database schemas, or filesystem paths.

### 6. 📱 Universal Multi-Device Responsive UI
* Fluid typography using CSS `clamp()` and auto-fit grid layouts.
* Responsive table wrappers with smooth touch scrolling for mobile and tablet screens.
* Minimum touch targets ($\ge 44\text{px}$) on all buttons, forms, and navigation links.

---

## 🔑 Default Academic & Demo Credentials

> [!WARNING]
> The following credentials are provided strictly for **local development, academic testing, and evaluator demonstration**. For production deployment, you MUST override these credentials using environment variables.

| Role | Username / Email | Default Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@helpdesk.com` | `admin123` | Full system analytics, all tickets, system oversight |
| **🛠️ IT Staff** | `alex.staff@helpdesk.com` | `staff123` | Ticket queue claim, status management, resolutions |
| **🛠️ IT Staff** | `sarah.staff@helpdesk.com` | `staff123` | Network & hardware ticket management |
| **👤 Employee** | `john.doe@company.com` | `user123` | Problem submission, AI preview, personal ticket tracking |
| **👤 Employee** | `emily.davis@company.com` | `user123` | Problem submission, personal ticket tracking |

---

## ⚙️ Production Environment Variables (`.env`)

```bash
# Server & Database
SERVER_PORT=8080
DB_URL=jdbc:mysql://your-prod-db-host:3306/it_helpdesk_db
DB_USERNAME=prod_db_user
DB_PASSWORD=SuperSecretStrongPassword123!

# Production Admin Override
ADMIN_NAME="Enterprise IT Admin"
ADMIN_EMAIL="security.admin@enterprise.org"
ADMIN_PASSWORD="StrongEnterprisePassword#2026"
ADMIN_DEPT="Information Security Operations"
```

---

## 🚨 Reporting a Vulnerability
If you discover a security vulnerability within this project, please contact: `purohitunofficialbhagyesh@gmail.com`.
