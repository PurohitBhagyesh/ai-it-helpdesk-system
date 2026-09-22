#  Enterprise AI-Driven IT Support & Helpdesk Platform

A next-generation, high-performance IT Incident Management and Helpdesk Platform designed with **Apple Cupertino Dark Glass Aesthetics**, **Spring Boot 3 Enterprise Architecture**, **Real-Time Natural Language AI Triage**, **End-to-End Encrypted Support Chat**, and **Strict Admin-Governed Identity Provisioning**.

---

## 📑 Executive Summary

Traditional IT helpdesk workflows suffer from fragmented ticket submission, delayed prioritization, informal communication, and security blindspots. This platform solves organizational IT friction through:

1. **Automated AI Problem Triage:** Instant NLP categorization, priority scoring, and immediate resolution suggestions before ticket creation.
2. **Strict Admin-Exclusive Account Provisioning:** Zero unvetted public registration. Only the IT Administrator can provision credentials with strictly two operational tiers: `EMPLOYEE` and `IT_TECHNICIAN` (`STAFF`).
3. **IT Technician Acceptance & Re-routing Engine:** Technicians can inspect incoming triage items, accept ownership, or decline & re-route tickets back to the global queue with logged justification notes.
4. **End-to-End Encrypted (E2EE) Support Chat:** Live bidirectional messaging between Employees and assigned IT Technicians with AES-256 cryptographic verification indicators.
5. **Official Administrator Enquiry Mailbox:** A dedicated, auditable communication channel allowing both Employees and IT Technicians to send inquiries, feedback, and escalation reports directly to the Administrator.
6. **Cupertino Dark Glass Experience:** Pure Vanilla CSS/JS design built on Apple design principles: blur backdrops, vibrant semantic accents, smooth fluid transitions, and responsive multi-device support.

---

## 🏛️ System Architecture

```
                                  +-------------------------------------------------------+
                                  |            CLIENT LAYER (Apple Cupertino UI)          |
                                  |  HTML5 + Vanilla CSS Glassmorphism + Modular ES6+ JS   |
                                  +---------------------------+---------------------------+
                                                              |
                                           HTTPS / REST & JSON Payloads (Port 3000 -> 8080)
                                                              |
                                                              v
+-------------------------------------------------------------------------------------------------------------------------+
|                                              SPRING BOOT 3 ENTERPRISE BACKEND                                           |
|                                                                                                                         |
|  +---------------------+  +----------------------+  +-----------------------+  +-------------------------------------+  |
|  |   Security Layer    |  |    REST Controllers  |  |    Service Engines    |  |           Data Layer (JPA)          |  |
|  | - IP Rate Limiter   |  | - AuthController     |  | - AuthService         |  | - UserRepository                    |  |
|  | - XSS Sanitizer     |  | - TicketController   |  | - TicketService       |  | - TicketRepository                  |  |
|  | - SQLi Protection   |  | - AIController       |  | - AIService (NLP)     |  | - MessageRepository                 |  |
|  | - OWASP Headers     |  | - EnquiryController  |  | - EnquiryService      |  | - EnquiryRepository                 |  |
|  | - SHA-256 Crypto    |  | - UserController     |  | - UserService         |  | - H2 / MySQL In-Memory / Production |  |
|  +---------------------+  +----------------------+  +-----------------------+  +-------------------------------------+  |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 🎨 Apple Cupertino Design System

The frontend is built entirely using standard HTML5, modern Vanilla CSS, and ES6+ JavaScript—delivering a native-feeling desktop and mobile experience without third-party framework overhead.

* **Cupertino Glass Elements:** `backdrop-filter: blur(24px) saturate(180%)` with calibrated multi-layer translucent specular borders (`rgba(255, 255, 255, 0.08)`).
* **Apple Typography:** Native Apple System Font Stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, sans-serif`).
* **Semantic Dark Palette:**
  * Background Canvas: `#000000` / `#0a0a0c`
  * Surface Glass: `rgba(28, 28, 30, 0.65)`
  * Accent Blue: `#0071e3` (System Accent)
  * Success Emerald: `#30d158` (Resolved State)
  * Warning Amber: `#ffd60a` (Triage / In Progress)
  * Critical Red: `#ff453a` (High Priority / Revocation)
* **Responsive Multi-Device Layouts:** CSS Grid and Flexbox layouts automatically adjust from 320px mobile screens to ultra-wide 4K monitors.

---

## 👥 Role Matrix & Workflows

### 1. 🛡️ System Administrator
* **Executive Telemetry:** Real-time KPI counters (Total Incidents, Triage Queue, Active Progress, SLA Resolution Rate) and category/priority breakdown graphs.
* **Incident Oversight:** Full inspection access to all organization-wide tickets, assigned technicians, and status transitions.
* **Corporate User Provisioning:** Exclusive authority to provision accounts with strictly two roles:
  * `👤 EMPLOYEE` (Incident submitter)
  * `🛠️ IT_TECHNICIAN` (`STAFF` Support Engineer)
* **Credential Management:** Instant secure password assignment/reset and account revocation.
* **Official Admin Enquiry Mailbox:** Reviews, tracks, and resolves all incoming inquiries sent by employees and technicians.

### 2. 👤 Employee (Ticket Submitter)
* **AI Problem Diagnostic Studio:** Real-time problem analysis giving instant troubleshooting suggestions, auto-categorization (`NETWORK`, `HARDWARE`, `SOFTWARE`, `ACCESS`), and priority scoring before ticket submission.
* **Active Incident Tracking:** Live view of submitted tickets with current operational status (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
* **Assigned IT Technician Details:** Clear visibility of the specific IT Engineer assigned to their ticket.
* **End-to-End Encrypted Support Chat:** Direct, encrypted bidirectional communication with the assigned technician.
* **Contact Administrator Channel:** Integrated official enquiry modal to dispatch urgent escalations or organizational queries directly to the Admin mailbox.

### 3. 🛠️ IT Technician (Support Engineer)
* **Incident Triage Desk:** Real-time overview of unassigned and active support tickets.
* **Ticket Acceptance Engine:** Accept open tickets to assign ownership and transition status to `IN_PROGRESS`.
* **Ticket Rejection / Re-routing:** Decline a ticket and return it to the global triage queue with mandatory justification notes automatically logged into the incident audit timeline.
* **Work Progress & Direct Chat:** Collaborate directly with the employee in real-time under E2EE encryption.
* **Resolution Engine:** Document root cause and final resolution notes to officially close tickets (`RESOLVED`).
* **Contact Administrator Channel:** Send infrastructure reports, resource requests, or administrative inquiries directly to the Admin mailbox.

---

## 🔒 Security & Enterprise Compliance

| Security Layer | Implementation Detail |
| :--- | :--- |
| **Authentication & Provisioning** | Admin-exclusive account creation. Public self-registration is completely disabled. |
| **Password Hashing** | SHA-256 cryptographic hashing with per-user salt strings. |
| **Rate Limiting** | Token-bucket IP rate limiter preventing brute force login attacks and API floods. |
| **Input Sanitization** | Automatic HTML escaping, XSS filtering, and SQL injection prevention across all inputs. |
| **OWASP Security Headers** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Content-Security-Policy`. |
| **E2EE Chat Security** | Encrypted message transport with cryptographic session markers and end-to-end audit badges. |

---

## 📡 REST API Reference

### 1. Authentication & User Management (Admin Only)
* `POST /api/auth/login` - Authenticate user credentials and return corporate session token.
* `GET /api/users` - Retrieve complete corporate user directory.
* `POST /api/users` - Provision new employee or IT technician account.
* `PUT /api/users/{id}/password` - Reset user password.
* `DELETE /api/users/{id}` - Revoke user account access.

### 2. AI Incident & Ticket Operations
* `POST /api/tickets/analyze` - NLP rule engine analysis for category, priority, and troubleshooting suggestions.
* `GET /api/tickets` - List all tickets (supports `?employeeId=` filter).
* `GET /api/tickets/{id}` - Get complete ticket details with message history.
* `POST /api/tickets` - Create new support ticket.
* `POST /api/tickets/{id}/assign` - IT Technician accepts ticket (`IN_PROGRESS`).
* `POST /api/tickets/{id}/reject` - IT Technician declines & re-routes ticket (`OPEN`).
* `POST /api/tickets/{id}/resolve` - Resolve ticket with closing resolution notes.
* `POST /api/tickets/{id}/messages` - Send real-time encrypted support message.

### 3. Administrator Enquiry Mailbox
* `POST /api/enquiries` - Submit inquiry/escalation to Administrator.
* `GET /api/enquiries` - Administrator inbox feed.
* `PUT /api/enquiries/{id}/status` - Update enquiry status (`RESOLVED`).

### 4. Admin Analytics
* `GET /api/admin/stats` - Summary counters, category distribution, and priority metrics.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Java:** JDK 17 or higher
* **Python:** Python 3.8+ (for frontend static server) or any modern HTTP server
* **Maven:** Included wrapper (`./mvnw`)

### 1. Start Spring Boot Backend Server
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/ai-it-helpdesk-system-1.0.0.jar
```
* Backend starts at `http://localhost:8080`
* H2 Database Console available at `http://localhost:8080/h2-console` (`JDBC URL: jdbc:h2:mem:helpdeskdb`, `User: SA`, `Password: [empty]`)

### 2. Start Frontend Web Server
```bash
cd frontend
python3 -m http.server 3000
```
* Open `http://localhost:3000` in your web browser.

---

## 🔐 Default Seed Credentials

| Role | Email | Password | Assigned Dashboard |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@helpdesk.com` | `admin123` | `admin-dashboard.html` |
| **IT Technician** | `alex.staff@helpdesk.com` | `staff123` | `staff-dashboard.html` |
| **IT Engineer** | `sarah.staff@helpdesk.com` | `staff123` | `staff-dashboard.html` |
| **Employee** | `john.doe@company.com` | `employee123` | `employee-dashboard.html` |
| **Employee** | `emily.davis@company.com` | `employee123` | `employee-dashboard.html` |

---

## 📂 Repository Structure

```
ai-it-helpdesk-system/
├── backend/
│   ├── src/main/java/com/helpdesk/
│   │   ├── config/              # Security filter, Rate limiter, DataInitializer
│   │   ├── controller/          # REST API endpoints (Auth, Tickets, Enquiries, Users, Admin)
│   │   ├── dto/                 # Request & Response Data Transfer Objects
│   │   ├── model/               # JPA Entities (User, Ticket, Message, Enquiry, Role)
│   │   ├── repository/          # Spring Data JPA Repositories
│   │   └── service/             # Business Logic & NLP Engine
│   └── pom.xml                  # Maven dependencies & build configuration
├── frontend/
│   ├── css/
│   │   └── style.css            # Apple Cupertino Dark Glass Design System
│   ├── js/
│   │   ├── api.js               # Centralized REST API client & local persistence fallback
│   │   ├── auth.js              # Session & Route Guard Authentication
│   │   ├── employee.js          # Employee portal & AI diagnostic studio controller
│   │   ├── staff.js             # IT Technician triage & acceptance controller
│   │   ├── admin.js             # Admin executive telemetry, user directory & mailbox
│   │   └── ticket-details.js    # Encrypted chat & ticket lifecycle inspector
│   ├── index.html               # Corporate SSO Sign-in Portal
│   ├── employee-dashboard.html  # Employee Incident Center
│   ├── staff-dashboard.html     # IT Technician Triage Desk
│   ├── admin-dashboard.html     # Administrator Command Console & Mailbox
│   └── ticket-details.html      # E2EE Support Room & Incident Workspace
├── ARCHITECTURE.md              # Technical Architecture & Security Specifications
├── CONTRIBUTING.md              # Development & Code Standards
├── PRD.md                       # Product Requirements Document
└── README.md                    # System Documentation & Guide
```

---

## 📜 License
This project is developed for enterprise IT support and academic minor project evaluation under the MIT License.
