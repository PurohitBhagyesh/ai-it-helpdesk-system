#  Enterprise AI-Driven IT Support & Helpdesk Platform

A next-generation, high-performance IT Incident Management and Helpdesk Platform designed with **Apple Cupertino Dark Glass Aesthetics**, **Spring Boot 3 Enterprise Architecture**, **Real-Time Natural Language AI Triage**, **End-to-End Encrypted Support Chat**, **Strict Admin-Governed Identity Provisioning**, and **Multi-Step Enterprise Organization Onboarding & Email Verification**.

---

## 📑 Executive Summary

Traditional IT helpdesk workflows suffer from fragmented ticket submission, delayed prioritization, informal communication, and security blindspots. This platform solves organizational IT friction through:

1. **Dual-Slider Access Gate:** Clean segmented slider providing dedicated paths for **Company Workforce** and **Enterprise Administrator**.
2. **Enterprise Organization Registration & Verification:** Allows new corporate administrators to register their enterprise (Organization Name, Admin Name, Location/HQ, Contact Hotline, Details), receive an interactive 6-digit email verification code, and verify their workspace.
3. **Initial Foundational Team Provisioning:** Post-verification onboarding wizard allowing the Admin to provision an initial **Employee ID** and **IT Technician ID** before launching the Executive Command Center.
4. **Automated AI Problem Triage:** Instant NLP categorization, priority scoring, and immediate resolution suggestions before ticket creation.
5. **Strict Admin-Exclusive Account Provisioning:** Zero unvetted public registration. Only the IT Administrator can provision credentials with strictly two operational tiers: `EMPLOYEE` and `IT_TECHNICIAN` (`STAFF`).
6. **IT Technician Acceptance & Re-routing Engine:** Technicians can inspect incoming triage items, accept ownership, or decline & re-route tickets back to the global queue with logged justification notes.
7. **End-to-End Encrypted (E2EE) Support Chat:** Live bidirectional messaging between Employees and assigned IT Technicians with AES-256 cryptographic verification indicators.
8. **Official Administrator Enquiry Mailbox:** A dedicated, auditable communication channel allowing both Employees and IT Technicians to send inquiries, feedback, and escalation reports directly to the Administrator.
9. **Cupertino Dark Glass Experience:** Pure Vanilla CSS/JS design built on Apple design principles: blur backdrops, vibrant semantic accents, smooth fluid transitions, and responsive multi-device support.

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
|  | - SHA-256 Crypto    |  | - EnterpriseContr... |  | - EnterpriseService   |  | - EnterpriseRepository              |  |
|  | - Master Passkeys   |  | - UserController     |  | - UserService         |  | - H2 / MySQL In-Memory / Production |  |
|  +---------------------+  +----------------------+  +-----------------------+  +-------------------------------------+  |
+-------------------------------------------------------------------------------------------------------------------------+
```

---

## 🎨 Apple Cupertino Design System

The frontend is built entirely using standard HTML5, modern Vanilla CSS, and ES6+ JavaScript—delivering a native-feeling desktop and mobile experience without third-party framework overhead.

* **Cupertino Glass Elements:** `backdrop-filter: blur(24px) saturate(180%)` with calibrated multi-layer translucent specular borders (`rgba(255, 255, 255, 0.08)`).
* **Apple Typography:** Native Apple System Font Stack (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, sans-serif`).
* **Interactive Segmented Slider:** Instant transition between Company Workforce sign-in and Enterprise Admin authentication / registration.
* **Simulated macOS Mail Dispatch:** High-fidelity interactive email dispatch preview showcasing incoming 6-digit verification codes.
* **Semantic Dark Palette:**
  * Background Canvas: `#000000` / `#0a0a0c`
  * Surface Glass: `rgba(28, 28, 30, 0.65)`
  * Accent Blue: `#0071e3` (System Accent)
  * Success Emerald: `#30d158` (Resolved State)
  * Warning Amber: `#ffd60a` (Triage / In Progress)
  * Critical Red: `#ff453a` (High Priority / Revocation)

---

## 👥 Role Matrix & Workflows

### 1. 🛡️ System Administrator
* **Enterprise Registration & Verification:** Multi-step wizard to register enterprise details, complete 6-digit email verification, and onboard initial team members.
* **Company Branding & Governance:** Configurable corporate identity dynamically displayed across all Employee and Technician dashboards (`Welcome to <Company Name> Helpdesk`).
* **Passkey Security:** Secure master passkey authentication into the Executive Command Center.
* **Executive Telemetry:** Real-time KPI counters (Total Incidents, Triage Queue, Active Progress, SLA Resolution Rate) and category/priority breakdown graphs.
* **Incident Oversight:** Full inspection access to all organization-wide tickets, assigned technicians, contact phone/desk locations, and status transitions.
* **Corporate User Provisioning & Management:** Exclusive authority to provision accounts with strictly two operational roles:
  * `👤 EMPLOYEE`: Requires Full Name, Corporate Email, Secure Password, Employee ID Code (e.g. `EMP-1050`), Join Date, Department/Field, Designation/Title, and Phone Number.
  * `🛠️ IT_TECHNICIAN` (`STAFF` Support Engineer): Requires Full Name, Corporate Email, Secure Password, Technician ID Code (e.g. `TECH-2050`), Join Date, Department/Field, Years of Experience, Technical Specialization/Certifications, and Phone Number.
* **Interactive Directory & Profile Editor:** Touching/clicking any user in the directory table opens a full interactive Profile Modal where the Administrator can view all attributes, edit profile information live, or delete accounts permanently.
* **Official Admin Enquiry Mailbox:** Reviews, tracks, and resolves all incoming inquiries dispatched by employees and technicians with sender ID codes and direct contact information.

### 2. 👤 Employee (Ticket Submitter)
* **Company-Branded Portal:** Dynamic `Welcome to <Company Name> Helpdesk` welcome banner tailored to the user's registered organization.
* **AI Problem Diagnostic Studio:** Real-time problem analysis giving instant troubleshooting suggestions, auto-categorization (`NETWORK`, `HARDWARE`, `SOFTWARE`, `ACCESS`), and priority scoring before ticket submission.
* **Comprehensive Ticket Submission:** Includes Problem Summary, Description, Category, Priority, and mandatory **Contact Phone / Desk Location** for quick on-site IT resolution.
* **Active Incident Tracking:** Live view of submitted tickets with current operational status (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
* **Assigned IT Technician Details:** Clear visibility of the specific IT Engineer assigned to their ticket.
* **End-to-End Encrypted Support Chat:** Direct, encrypted bidirectional communication with the assigned technician.
* **Contact Administrator Channel:** Auto-fetches employee name, email, and ID code (with an interactive `+ Edit / Add Employee ID` option) and confirms submission with `"Message sent to Admin. Please wait for an administrator response."`

### 3. 🛠️ IT Technician (Support Engineer)
* **Company-Branded Console:** Dynamic `Welcome to <Company Name> Support Console` dashboard.
* **Incident Triage Desk:** Real-time overview of unassigned and active support tickets with direct access to the reporter's contact phone and desk location.
* **Ticket Acceptance Engine:** Accept open tickets to assign ownership and transition status to `IN_PROGRESS`.
* **Ticket Rejection / Re-routing:** Decline a ticket and return it to the global triage queue with mandatory justification notes automatically logged into the incident audit timeline.
* **Work Progress & Direct Chat:** Collaborate directly with the employee in real-time under E2EE encryption.
* **Resolution Engine:** Document root cause and final resolution notes to officially close tickets (`RESOLVED`).
* **Contact Administrator Channel:** Integrated enquiry modal with auto-populated technician ID code and instant delivery confirmation.

---

## 🔒 Security & Enterprise Compliance

| Security Layer | Implementation Detail |
| :--- | :--- |
| **Authentication & Provisioning** | Admin-exclusive account creation + Verified Enterprise Registration. |
| **Password Hashing** | SHA-256 cryptographic hashing with per-user salt strings. |
| **Rate Limiting** | Token-bucket IP rate limiter preventing brute force login attacks and API floods. |
| **Input Sanitization** | Automatic HTML escaping, XSS filtering, and SQL injection prevention across all inputs. |
| **OWASP Security Headers** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Content-Security-Policy`. |
| **E2EE Chat Security** | Encrypted message transport with cryptographic session markers and end-to-end audit badges. |

---

## 📡 REST API Reference

### 1. Enterprise Onboarding & Verification
* `POST /api/enterprise/register` - Register enterprise profile & trigger 6-digit verification code.
* `POST /api/enterprise/verify` - Verify corporate code and activate enterprise workspace.
* `POST /api/enterprise/provision-initial-team` - Provision foundational Employee ID and IT Technician ID.

### 2. Authentication & User Management (Admin Only)
* `POST /api/auth/login` - Authenticate user credentials / passkey and return corporate session token.
* `GET /api/users` - Retrieve complete corporate user directory.
* `POST /api/users` - Provision new employee or IT technician account.
* `PUT /api/users/{id}/password` - Reset user password.
* `DELETE /api/users/{id}` - Revoke user account access.

### 3. AI Incident & Ticket Operations
* `POST /api/tickets/analyze` - NLP rule engine analysis for category, priority, and troubleshooting suggestions.
* `GET /api/tickets` - List all tickets (supports `?employeeId=` filter).
* `GET /api/tickets/{id}` - Get complete ticket details with message history.
* `POST /api/tickets` - Create new support ticket.
* `POST /api/tickets/{id}/assign` - IT Technician accepts ticket (`IN_PROGRESS`).
* `POST /api/tickets/{id}/reject` - IT Technician declines & re-routes ticket (`OPEN`).
* `POST /api/tickets/{id}/resolve` - Resolve ticket with closing resolution notes.
* `POST /api/tickets/{id}/messages` - Send real-time encrypted support message.

### 4. Administrator Enquiry Mailbox
* `POST /api/enquiries` - Submit inquiry/escalation to Administrator.
* `GET /api/enquiries` - Administrator inbox feed.
* `PUT /api/enquiries/{id}/status` - Update enquiry status (`RESOLVED`).

### 5. Admin Analytics
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
│   │   ├── controller/          # REST API endpoints (Auth, Tickets, Enquiries, Enterprise, Users, Admin)
│   │   ├── dto/                 # Request & Response Data Transfer Objects
│   │   ├── model/               # JPA Entities (User, Ticket, Message, Enquiry, Enterprise, Role)
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
│   ├── index.html               # Corporate Access Portal (Workforce / Admin Slider & Onboarding)
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
