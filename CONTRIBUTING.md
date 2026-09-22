# Contribution Guidelines & Team Workflow

Welcome to the **AI-Based IT Support & Helpdesk System** repository! This project is maintained by a 3-member engineering team. Please follow these guidelines to keep the codebase clean, tested, and secure.

---

## 👥 Team Roles & Responsibilities

* **Frontend Lead:** User interface, responsive styling in `frontend/css/style.css`, DOM manipulation, and Fetch API communication in `frontend/js/`.
* **Backend & AI Lead:** REST API controllers, Spring Data JPA services, DTOs, and the keyword classification engine in `backend/src/main/java/com/helpdesk/`.
* **Database & Integration Lead:** MySQL schema maintenance in `database/schema.sql`, mock test datasets in `database/seed_data.sql`, and database connection testing.

---

## 🌿 Git Branching Strategy

1. **`main` Branch:** Always kept stable and working.
2. **Feature Branches:** Create a feature branch before making major changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Pull & Merge:**
   ```bash
   git pull origin main
   git checkout main
   git merge feature/your-feature-name
   git push origin main
   ```

---

## 🛡️ Commit Standards & Code Quality

* **Meaningful Commit Messages:**
  * `feat: add ticket priority filter in staff dashboard`
  * `fix: correct keyword scoring for network category`
  * `docs: update API endpoints in backend README`
* **Never commit secrets:** Never commit passwords, `.env` files, or private keys. Always use `.env.example` as a reference.
* **Build Verification:** Always ensure the project compiles cleanly before pushing:
  ```bash
  cd backend
  ./mvnw clean compile
  ```

---

## 🚀 Running the Development Environment

### 1. Backend Server
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs on `http://localhost:8080`.

### 2. Frontend Development Server
```bash
cd frontend
python3 -m http.server 3000
```
Frontend runs on `http://localhost:3000`.
