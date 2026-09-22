# Backend & AI Module - AI IT Helpdesk System

## 📌 Role & Purpose
**Lead Role:** Backend & AI Developer  
**Technologies:** Java (JDK 17+), Spring Boot 3.x, Spring Data JPA, Maven, MySQL Connector  
**Goal:** Implement RESTful APIs, core business logic, user authentication, and the rule-based AI problem classification and troubleshooting recommendation engine.

---

## 📂 Recommended Directory Structure

```text
backend/
├── pom.xml                                  # Maven dependencies & build configuration
└── src/
    └── main/
        ├── java/com/helpdesk/
        │   ├── HelpdeskApplication.java     # Spring Boot main entry point
        │   ├── config/
        │   │   └── CorsConfig.java          # CORS setup to allow Frontend Fetch calls
        │   ├── controller/
        │   │   ├── AuthController.java      # /api/auth endpoints
        │   │   ├── TicketController.java    # /api/tickets endpoints & actions
        │   │   └── AdminController.java     # /api/admin metrics & reports
        │   ├── service/
        │   │   ├── AuthService.java         # User authentication & validation logic
        │   │   ├── TicketService.java       # Ticket lifecycle management & routing
        │   │   ├── AIService.java           # Intelligent classification & suggestion logic
        │   │   └── AdminService.java        # Metric aggregation logic
        │   ├── ai/
        │   │   ├── KeywordClassifier.java   # Keyword matching algorithm
        │   │   └── SolutionAdvisor.java     # Diagnostic solution mapping rules
        │   ├── model/ (or entity/)
        │   │   ├── User.java                # JPA Entity for users table
        │   │   ├── Ticket.java              # JPA Entity for tickets table
        │   │   ├── TicketMessage.java       # JPA Entity for ticket_messages table
        │   │   └── Resolution.java          # JPA Entity for resolutions table
        │   ├── repository/
        │   │   ├── UserRepository.java      # Spring Data JPA Repository
        │   │   ├── TicketRepository.java    # Spring Data JPA Repository
        │   │   ├── MessageRepository.java   # Spring Data JPA Repository
        │   │   └── ResolutionRepository.java
        │   └── dto/
        │       ├── LoginRequest.java
        │       ├── LoginResponse.java
        │       ├── TicketCreateRequest.java
        │       ├── AIAnalysisResult.java
        │       ├── StatusUpdateRequest.java
        │       └── AdminStatsDTO.java
        └── resources/
            └── application.properties       # DB connection string, port (8080)
```

---

## 🧠 AI Classification Engine Specifications

The AI module is implemented in pure Java using a modular rule and keyword matching engine:

### 1. Categories & Keywords
* **Network:** `wifi`, `internet`, `router`, `network`, `connection`, `vpn`, `dns`, `ethernet`, `ip`
* **Hardware:** `laptop`, `keyboard`, `mouse`, `monitor`, `printer`, `screen`, `battery`, `charger`, `display`, `power`
* **Software:** `application`, `software`, `crash`, `error`, `install`, `update`, `browser`, `chrome`, `freeze`, `bug`
* **Access:** `password`, `login`, `account`, `permission`, `access`, `username`, `locked`, `credential`, `auth`

### 2. Priority Rules
* **High:** Outage, security risk, system-wide failure, or critical work stoppage.
* **Medium:** Hardware malfunction, primary application crash, network disconnect.
* **Low:** Password resets, access requests, general software inquiries.

### 3. Suggested Diagnostic Solution Engine
* **Network Match:** *"Verify Wi-Fi adapter is enabled, restart router/adapter, or verify if other devices can connect to the same network."*
* **Hardware Match:** *"Inspect physical cables, verify power/charger connection, power cycle the device, or test with an alternative peripheral."*
* **Software Match:** *"Restart the target application, clear browser cache, check for software updates, or restart the workstation."*
* **Access Match:** *"Verify correct username/domain, use the self-service password reset portal, or confirm role permissions with your administrator."*

---

## ⚙️ Core Configuration (`application.properties`)

```properties
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/it_helpdesk_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate Properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

---

## 📦 Required Maven Dependencies (`pom.xml`)
* `spring-boot-starter-web` (REST APIs)
* `spring-boot-starter-data-jpa` (Database persistence)
* `mysql-connector-j` (MySQL JDBC Driver)
* `lombok` (optional, for getters/setters)
* `spring-boot-starter-validation` (Request validation)

---

## ✅ Step-by-Step Task Checklist for Backend Developer
- [ ] 1. Initialize the Spring Boot project using Spring Initializr / Maven.
- [ ] 2. Configure `application.properties` with MySQL credentials and configure CORS for frontend.
- [ ] 3. Create JPA Entities (`User`, `Ticket`, `TicketMessage`, `Resolution`).
- [ ] 4. Build Spring Data Repositories for CRUD operations.
- [ ] 5. Implement the Java AI Classification and Suggestion service in `ai/`.
- [ ] 6. Implement `AuthController`, `TicketController`, and `AdminController`.
- [ ] 7. Test all REST endpoints with Postman or cURL.
