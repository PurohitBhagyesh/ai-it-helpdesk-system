# Security Policy & Credential Management Guide

## 🔒 Security Overview
The **AI-Based IT Support & Helpdesk System** is designed with multi-layered security principles covering role-based access control (RBAC), environment-driven credential injection, input sanitization, and database isolation.

---

## 🔑 Default Academic & Demo Credentials

> [!WARNING]
> The following credentials are provided strictly for **local development, academic testing, and evaluator demonstration**. For production deployment, you MUST override these credentials using environment variables.

| Role | Username / Email | Default Demo Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@helpdesk.com` | `admin123` | Full system analytics, all tickets, system oversight |
| **🛠️ IT Staff** | `alex.staff@helpdesk.com` | `staff123` | Ticket queue claim, status management, resolutions |
| **🛠️ IT Staff** | `sarah.staff@helpdesk.com` | `staff123` | Network & hardware ticket management |
| **👤 Employee** | `john.doe@company.com` | `user123` | Problem submission, AI preview, personal ticket tracking |
| **👤 Employee** | `emily.davis@company.com` | `user123` | Problem submission, personal ticket tracking |

---

## 🛡️ Production Credential Configuration

To override the default admin account and database credentials without modifying source code:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set secure production values:
   ```bash
   # Production Database
   DB_URL=jdbc:mysql://your-prod-db-host:3306/it_helpdesk_db
   DB_USERNAME=prod_db_user
   DB_PASSWORD=SuperSecretStrongPassword123!

   # Production Initial Administrator
   ADMIN_NAME="Enterprise IT Admin"
   ADMIN_EMAIL="security.admin@enterprise.org"
   ADMIN_PASSWORD="StrongEnterprisePassword#2026"
   ADMIN_DEPT="Information Security Operations"
   ```
3. Run the application passing the environment variables:
   ```bash
   ADMIN_EMAIL="myadmin@corp.com" ADMIN_PASSWORD="SafePassword#1" ./mvnw spring-boot:run
   ```

---

## 🛡️ Key Security Features Implemented

### 1. Role-Based Access Control (RBAC)
* Endpoints and UI views strictly check user roles: `EMPLOYEE`, `IT_STAFF`, and `ADMIN`.
* Employees can only view and query their own submitted tickets (`/api/tickets?employeeId={id}`).
* Staff and Admin users have permission to view unassigned queues, claim tickets, and submit resolution reports.

### 2. Secret Protection & `.gitignore`
* All `.env`, `*.key`, `*.pem`, `*.jks`, `credentials.json`, and database credential backups are strictly ignored by `.gitignore`.
* No production secrets or API keys are committed to the public Git tree.

### 3. XSS and SQL Injection Mitigation
* **Backend:** Spring Data JPA / Hibernate utilizes parameterized PreparedStatements for all database queries, preventing SQL injection vulnerabilities.
* **Frontend:** All dynamically rendered text elements (titles, descriptions, user names, chat messages) use HTML character escaping (`escapeHtml()`) before DOM insertion.

### 4. CORS Configuration
* Cross-Origin Resource Sharing is centrally managed in `CorsConfig.java` to restrict allowed origins and HTTP verbs.

---

## 🚨 Reporting a Vulnerability
If you discover a security vulnerability within this project, please open a private GitHub security advisory or contact the project maintainer directly at: `purohitunofficialbhagyesh@gmail.com`.
