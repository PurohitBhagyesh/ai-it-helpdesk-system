# Backend & AI Module - AI IT Helpdesk System

## 📌 Role & Overview
**Lead Role:** Backend & AI Developer  
**Technologies:** Java (JDK 17 or 21), Spring Boot 3.2.x, Spring Data JPA, REST APIs, H2 Database / MySQL  
**Status:** ✅ Fully Implemented

---

## 🚀 How to Run the Backend

### Option A: Using VS Code / IntelliJ IDEA / Eclipse (Easiest)
1. Open the `backend/` folder in your IDE.
2. Ensure you have the **Extension Pack for Java** & **Spring Boot Tools** installed.
3. Open `src/main/java/com/helpdesk/HelpdeskApplication.java`.
4. Click **Run** or **Debug**.
5. The backend will start on: **`http://localhost:8080`**.

### Option B: Using Maven in Terminal
```bash
cd backend
mvn spring-boot:run
```

---

## 🗄️ Database Profiles

### 1. Embedded H2 Database (Default - Zero Setup Required!)
* Automatically enabled on startup.
* Seeds default test users (`admin@helpdesk.com`, `alex.staff@helpdesk.com`, `john.doe@company.com`) and test incidents immediately.
* **H2 Web Console:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)  
  * *JDBC URL:* `jdbc:h2:mem:helpdeskdb`  
  * *User Name:* `sa`  
  * *Password:* (leave empty)

### 2. MySQL Database
To switch to local MySQL:
1. Open `src/main/resources/application.properties`.
2. Uncomment the MySQL datasource lines and set your password:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/it_helpdesk_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

---

## 🧠 AI Rule-Based Classification Architecture

The AI module is located in `src/main/java/com/helpdesk/ai/`:

| Component | Responsibility |
| :--- | :--- |
| **`KeywordClassifier.java`** | Analyzes problem description text against domain dictionaries for **Network**, **Hardware**, **Software**, and **Access** incidents, and calculates severity priority (**High**, **Medium**, **Low**). |
| **`SolutionAdvisor.java`** | Maps detected categories to first-level automated troubleshooting instructions. |
| **`AIService.java`** | Orchestrates classification and advice generation for both live preview (`/api/tickets/analyze`) and ticket creation. |

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user with email and password |
| `POST` | `/api/tickets/analyze` | Real-time AI classification & troubleshooting preview |
| `GET` | `/api/tickets` | Get all tickets (supports optional `?employeeId={id}`) |
| `GET` | `/api/tickets/{id}` | Get single ticket details and conversation thread |
| `POST` | `/api/tickets` | Create a new ticket (auto-classified with AI) |
| `PUT` | `/api/tickets/{id}/status` | Update status (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`) |
| `POST` | `/api/tickets/{id}/messages` | Post a support/troubleshooting message |
| `POST` | `/api/tickets/{id}/resolve` | Submit final technical resolution and mark resolved |
| `GET` | `/api/admin/stats` | Retrieve aggregate KPI metrics, category & priority counts |
