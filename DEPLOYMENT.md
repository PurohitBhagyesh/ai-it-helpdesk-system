# Full-Stack Deployment Guide

This guide provides step-by-step instructions to deploy the **AI-Based IT Support & Helpdesk System** across various environments.

---

## 🚀 Option 1: 1-Click Docker Compose Deployment (Recommended)

Run the entire full-stack system (Frontend + Spring Boot Backend + MySQL 8.0 Database) with a single command:

```bash
docker compose up --build -d
```

### Access URLs:
* **Frontend Web Application:** [http://localhost:3000](http://localhost:3000)
* **Backend REST API:** [http://localhost:8080/api/tickets](http://localhost:8080/api/tickets)
* **MySQL Database:** `localhost:3306` (`root` / `rootpassword123`)

To stop all containers:
```bash
docker compose down
```

---

## 💻 Option 2: Local Development Execution

### 1. Run the Backend
```bash
cd backend
./mvnw spring-boot:run
```
*Runs on `http://localhost:8080` (uses embedded H2 database with auto-seeded demo data).*

### 2. Run the Frontend
```bash
cd frontend
python3 -m http.server 3000
```
*Opens on `http://localhost:3000`.*

---

## ☁️ Option 3: Free Cloud Deployment (Render / Railway)

### 1. Deploy Backend on [Render.com](https://render.com)
1. Connect your GitHub repository: `https://github.com/PurohitBhagyesh/ai-it-helpdesk-system`.
2. Select **Web Service** $\rightarrow$ Runtime: **Docker** (or Java).
3. Set Root Directory: `backend`.
4. Environment Variables:
   * `SERVER_PORT=8080`
   * `ADMIN_EMAIL=your_admin@company.com`
   * `ADMIN_PASSWORD=YourStrongPassword#1`

### 2. Deploy Frontend on [Vercel](https://vercel.com) / [Netlify](https://netlify.com) / [GitHub Pages](https://pages.github.com)
1. Import repository and set Root Directory to `frontend`.
2. Update `frontend/js/api.js` `API_BASE_URL` to point to your live Render backend URL.
3. Deploy!

---

## 🐧 Option 4: Linux Server (Ubuntu / Debian Systemd Service)

1. Build the standalone JAR:
   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   ```
2. Copy `backend/target/ai-it-helpdesk-system-1.0.0.jar` to `/var/www/helpdesk/app.jar`.
3. Create Systemd Service `/etc/systemd/system/helpdesk.service`:
   ```ini
   [Unit]
   Description=AI IT Helpdesk Spring Boot Backend
   After=syslog.target network.target

   [Service]
   User=www-data
   ExecStart=/usr/bin/java -jar /var/www/helpdesk/app.jar
   SuccessExitStatus=143
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```
4. Start and enable service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now helpdesk.service
   ```
