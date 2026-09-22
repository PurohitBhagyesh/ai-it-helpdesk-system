#  Enterprise AI IT Support & Incident Management Platform

<div align="center">

[![Spring Boot 3](https://img.shields.io/badge/Spring_Boot-3.2.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java 17](https://img.shields.io/badge/Java-17_LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Apple Cupertino UI](https://img.shields.io/badge/Design-Apple_Cupertino_Glass-000000?style=for-the-badge&logo=apple&logoColor=white)](https://developer.apple.com/design/)
[![GitHub Pages](https://img.shields.io/badge/Live_Demo-GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)](https://purohitbhagyesh.github.io/ai-it-helpdesk-system/)
[![Docker Ready](https://img.shields.io/badge/Docker-Multi--Stage_Build-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**A next-generation, high-performance IT Incident Management and Helpdesk Platform designed with Apple Cupertino Dark Glass Aesthetics, Spring Boot 3 Enterprise Architecture, Real-Time Natural Language AI Triage, End-to-End Encrypted Support Chat, and Multi-Tenant Enterprise Onboarding.**

[🌐 Explore Live Demo](https://purohitbhagyesh.github.io/ai-it-helpdesk-system/) • [📑 Architecture Specs](ARCHITECTURE.md) • [🚀 Cloud Deployment Guide](DEPLOYMENT.md) • [🔒 Security Policy](SECURITY.md)

</div>

---

## 🌟 Live Deployments & Demo Links

| Platform | Deployment Type | Live URL / Deploy Link | Status |
| :--- | :--- | :--- | :--- |
| **GitHub Pages** | Frontend Web App (Edge CDN) | 👉 **[https://purohitbhagyesh.github.io/ai-it-helpdesk-system/](https://purohitbhagyesh.github.io/ai-it-helpdesk-system/)** | 🟢 Live |
| **Vercel** | High-Speed Frontend CDN | [Deploy to Vercel Guide](DEPLOYMENT.md#-option-3-deploy-frontend-to-vercel-vercelcom) | ⚡ Ready |
| **Render** | Docker Full-Stack / Backend API | [Deploy to Render Guide](DEPLOYMENT.md#-option-1-deploy-backend-to-render-rendercom) | ⚡ Ready (`render.yaml`) |
| **Railway** | Spring Boot + MySQL Database | [Deploy to Railway Guide](DEPLOYMENT.md#-option-2-deploy-backend-to-railway-railwayapp) | ⚡ Ready (`railway.json`) |
| **Localhost** | Docker Compose (Full Stack) | `http://localhost:3000` & `http://localhost:8080` | 🐳 Ready (`docker-compose.yml`) |

> **💡 Quick Cloud Tip:** When running the frontend on **GitHub Pages** or **Vercel**, you can dynamically connect it to your live **Render** or **Railway** backend by clicking the **`🌐 Backend API Endpoint`** link at the bottom of the login card!

---

## 📑 Platform Overview & Core Innovations

Traditional IT helpdesk workflows suffer from fragmented ticket submission, delayed prioritization, informal communication, and security blindspots. This enterprise platform solves organizational IT friction through:

1. **Dual-Slider Access Gate:** Clean segmented slider providing dedicated paths for **Company Workforce** and **Enterprise Administrator**.
2. **Enterprise Organization Registration & Verification:** Multi-step wizard allowing corporate administrators to register their enterprise, receive an interactive 6-digit email verification code, and verify their workspace.
3. **Dynamic Company Branding Across Dashboards:** When users log in, their portal displays their organization's identity:
   * *Employees:* `Welcome to <Company Name> Helpdesk`
   * *IT Technicians:* `Welcome to <Company Name> Support Console`
4. **Automated AI Problem Triage:** Instant NLP categorization (`NETWORK`, `HARDWARE`, `SOFTWARE`, `ACCESS`), priority scoring, and immediate resolution suggestions before ticket creation.
5. **Strict Admin-Governed Identity Provisioning:** Zero unvetted public registration. Only the IT Administrator can provision accounts across three strictly governed roles (`ADMIN`, `EMPLOYEE`, `IT_TECHNICIAN`).
6. **Detailed Role Fields:**
   * **Employee:** Name, Corporate Email, Admin Password, Employee ID Code (e.g. `EMP-1050`), Join Date, Department/Field, Designation/Title, Contact Phone.
   * **IT Technician:** Name, Corporate Email, Admin Password, Technician ID Code (e.g. `TECH-2050`), Join Date, Department/Field, Years of Experience, Technical Specializations/Certifications, Contact Phone.
7. **Interactive Directory & Live Profile Modal:** Touching or clicking any user row in the Admin Directory opens a rich Profile Modal to inspect all fields, perform live updates via `PUT /api/users/{id}`, or permanently delete accounts.
8. **Incident Raising with Desk Location & Contact:** Employees provide their exact desk location and phone number for immediate on-site IT dispatch.
9. **IT Technician Acceptance & Re-routing Engine:** Technicians can inspect incoming triage items, accept ownership, or decline & re-route tickets back to the global queue with logged justification notes.
10. **End-to-End Encrypted (E2EE) Support Chat:** Live bidirectional messaging between Employees and assigned IT Technicians with cryptographic verification indicators.
11. **Official Administrator Enquiry Mailbox:** Auto-populates sender information and employee ID code with an interactive edit option, confirming dispatch with: *"Message sent to Admin. Please wait for an administrator response."*

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

## 🔐 Default Seed Logins (Quick-Fill Available)

| Role | Email | Password | Assigned Dashboard |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@helpdesk.com` | `admin123` | `admin-dashboard.html` |
| **IT Technician (Tier-1)** | `alex.staff@helpdesk.com` | `staff123` | `staff-dashboard.html` |
| **IT Engineer (Network)** | `sarah.staff@helpdesk.com` | `staff123` | `staff-dashboard.html` |
| **Employee (Engineering)** | `john.doe@company.com` | `employee123` | `employee-dashboard.html` |
| **Employee (Finance)** | `emily.davis@company.com` | `employee123` | `employee-dashboard.html` |

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

## 📡 REST API Specification

### 1. Enterprise Onboarding & Verification
* `POST /api/enterprise/register` — Register enterprise profile & trigger 6-digit verification code.
* `POST /api/enterprise/verify` — Verify corporate code and activate enterprise workspace.
* `POST /api/enterprise/provision-initial-team` — Provision foundational Employee ID and IT Technician ID.

### 2. Authentication & User Management (Admin Only)
* `POST /api/auth/login` — Authenticate user credentials / passkey and return corporate session token.
* `GET /api/users` — Retrieve complete corporate user directory with extended fields.
* `POST /api/users` — Provision new employee or IT technician account.
* `PUT /api/users/{id}` — Update user profile details (title, experience, specialization, phone, etc.).
* `PUT /api/users/{id}/password` — Reset user password.
* `DELETE /api/users/{id}` — Revoke user account access permanently.

### 3. AI Incident & Ticket Operations
* `POST /api/tickets/analyze` — NLP rule engine analysis for category, priority, and troubleshooting suggestions.
* `GET /api/tickets` — List all tickets (supports `?employeeId=` filter).
* `GET /api/tickets/{id}` — Get complete ticket details with message history and contact info.
* `POST /api/tickets` — Create new support ticket with desk location & contact.
* `POST /api/tickets/{id}/assign` — IT Technician accepts ticket (`IN_PROGRESS`).
* `POST /api/tickets/{id}/reject` — IT Technician declines & re-routes ticket (`OPEN`).
* `POST /api/tickets/{id}/resolve` — Resolve ticket with closing resolution notes.
* `POST /api/tickets/{id}/messages` — Send real-time encrypted support message.

### 4. Administrator Enquiry Mailbox
* `POST /api/enquiries` — Submit inquiry/escalation to Administrator with sender ID code.
* `GET /api/enquiries` — Administrator inbox feed.
* `PUT /api/enquiries/{id}/status` — Update enquiry status (`RESOLVED`).

---

## 🚀 Quick Local Setup

### 1. Start Backend (Spring Boot 3)
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/ai-it-helpdesk-system-1.0.0.jar
```
* Backend API: `http://localhost:8080`
* In-Memory H2 Console: `http://localhost:8080/h2-console` (`JDBC URL: jdbc:h2:mem:helpdeskdb`, `sa` / `[blank]`)

### 2. Start Frontend (HTML5 / Vanilla CSS & JS)
```bash
cd frontend
python3 -m http.server 3000
```
* Open: `http://localhost:3000`

### 3. 1-Click Docker Compose (Full Stack with MySQL 8)
```bash
docker compose up --build -d
```

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
│   ├── Dockerfile               # Backend Dockerfile for Render / Railway
│   └── pom.xml                  # Maven dependencies & build configuration
├── frontend/
│   ├── css/
│   │   └── style.css            # Apple Cupertino Dark Glass Design System
│   ├── js/
│   │   ├── api.js               # Centralized REST API client & dynamic endpoint switcher
│   │   ├── auth.js              # Session & Route Guard Authentication
│   │   ├── employee.js          # Employee portal & AI diagnostic studio controller
│   │   ├── staff.js             # IT Technician triage & acceptance controller
│   │   ├── admin.js             # Admin executive telemetry, user directory & mailbox
│   │   └── ticket-details.js    # Encrypted chat & ticket lifecycle inspector
│   ├── index.html               # Corporate Access Portal (Workforce / Admin Slider & Onboarding)
│   ├── employee-dashboard.html  # Employee Incident Center
│   ├── staff-dashboard.html     # IT Technician Triage Desk
│   ├── admin-dashboard.html     # Administrator Command Console & Mailbox
│   ├── ticket-details.html      # E2EE Support Room & Incident Workspace
│   └── vercel.json              # Direct frontend Vercel deployment config
├── database/
│   ├── schema.sql               # MySQL 8.0+ DDL Table Definitions
│   ├── seed_data.sql            # Seed dataset for all user roles
│   └── README.md                # Database setup instructions
├── .github/workflows/
│   └── deploy-pages.yml         # GitHub Actions automated Pages deployment
├── docker-compose.yml           # Full-Stack Compose (Frontend + Spring Boot + MySQL)
├── Dockerfile                   # Root Multi-Stage Dockerfile
├── render.yaml                  # Render Blueprint Specification
├── railway.json                 # Railway Deployment Specification
├── vercel.json                  # Vercel Deployment Specification
├── ARCHITECTURE.md              # Technical Architecture & Specifications
├── CONTRIBUTING.md              # Development Guidelines
├── DEPLOYMENT.md                # Complete Multi-Cloud Deployment Guide
├── PRD.md                       # Product Requirements Document
├── SECURITY.md                  # Security & Vulnerability Policy
└── README.md                    # Main Project Documentation
```

---

## 📜 License
This project is developed for enterprise IT incident support and academic evaluation under the **MIT License**.
