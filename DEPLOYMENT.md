# 🚀 Full-Stack Cloud Deployment Guide

This guide provides exact step-by-step instructions to deploy the **AI-Based IT Support & Helpdesk System** to **Render**, **Railway**, and **Vercel**.

---

## 📋 Architecture Overview

The system consists of two primary components:
1. **Spring Boot 3 REST API Backend (Java 17 / Docker):** Deployed to **Render** or **Railway**.
2. **Apple Cupertino Dark Glass Frontend (HTML5 / Vanilla JS / CSS):** Deployed to **Vercel**, **Render Static Sites**, or **Railway**.

---

## ⚡ Quick Links & Deployment Matrix

| Platform | Recommended For | Deployment Type | Config File |
| :--- | :--- | :--- | :--- |
| **Render** | Backend & Frontend (Full Stack) | Docker Web Service + Static Site | [`render.yaml`](file:///Users/purohitbhagyesh/Documents/mini%20project/render.yaml) |
| **Railway** | Backend & MySQL Database | Docker Web Service + Addons | [`railway.json`](file:///Users/purohitbhagyesh/Documents/mini%20project/railway.json) |
| **Vercel** | High-Speed Global Frontend CDN | Static Site / Edge CDN | [`vercel.json`](file:///Users/purohitbhagyesh/Documents/mini%20project/vercel.json) |

---

## 🔷 Option 1: Deploy Backend to Render ([render.com](https://render.com))

Render provides free/low-cost Web Services with automated GitHub CI/CD and Docker support.

### Step 1: Push Your Code to GitHub
Ensure your repository is up to date:
```bash
git push origin main
```

### Step 2: Create a New Web Service on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** $\rightarrow$ **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub repository (`ai-it-helpdesk-system`).
4. Configure the service settings:
   - **Name:** `helpdesk-backend`
   - **Region:** Choose closest to your users (e.g., `Oregon (US West)` or `Frankfurt (EU)`)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank for root, or enter `backend`)*
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./Dockerfile` *(or `backend/Dockerfile` if Root Directory is `backend`)*
   - **Instance Type:** `Free` (or `Starter`)

### Step 3: Add Environment Variables
Under the **Environment Variables** section on Render, add:
| Key | Recommended Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | Port automatically assigned/mapped by Render |
| `ADMIN_NAME` | `System Administrator` | Default Admin Full Name |
| `ADMIN_EMAIL` | `admin@helpdesk.com` | Default Admin Email |
| `ADMIN_PASSWORD` | `YourSecurePassword123` | Default Admin Password |
| `ADMIN_DEPT` | `IT Operations` | Default Admin Department |

*(Optional: For persistent MySQL, add a free Render PostgreSQL or external MySQL DB_URL).*

### Step 4: Deploy & Copy Backend URL
1. Click **Create Web Service**.
2. Render will build the multi-stage Docker image and start the Spring Boot app.
3. Once deployed, note down your live URL, e.g.:
   `https://helpdesk-backend-xxxx.onrender.com`

---

## 🚂 Option 2: Deploy Backend to Railway ([railway.app](https://railway.app))

Railway automatically detects Dockerfiles and handles ports seamlessly.

### Step 1: Create a Railway Project
1. Log in to [Railway](https://railway.app).
2. Click **New Project** $\rightarrow$ **Deploy from GitHub repo**.
3. Select `ai-it-helpdesk-system`.

### Step 2: Configure Service Settings
1. Click on the newly created service tile $\rightarrow$ **Settings**.
2. Under **Build**:
   - **Builder:** `Dockerfile`
   - **Dockerfile Path:** `Dockerfile` (or `backend/Dockerfile`)
3. Under **Networking**:
   - Click **Generate Domain** (e.g. `ai-it-helpdesk-system-production.up.railway.app`).
   - Port `8080` is detected automatically.

### Step 3: Configure Environment Variables
In the **Variables** tab, add:
- `ADMIN_NAME` = `System Administrator`
- `ADMIN_EMAIL` = `admin@helpdesk.com`
- `ADMIN_PASSWORD` = `YourSecurePassword123`
- `ADMIN_DEPT` = `IT Operations`

*(Optional: Click **New +** in your Railway canvas $\rightarrow$ **Database** $\rightarrow$ **MySQL** to attach a production database).*

---

## ▲ Option 3: Deploy Frontend to Vercel ([vercel.com](https://vercel.com))

Vercel provides edge hosting and zero-latency CDN distribution for the Cupertino UI.

### Step 1: Import Project to Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository (`ai-it-helpdesk-system`).

### Step 2: Configure Build & Output Settings
1. **Framework Preset:** `Other`
2. **Root Directory:** Click **Edit** and choose `frontend` (or leave as `./` since `vercel.json` is configured).
3. **Build Command:** Leave empty.
4. **Output Directory:** Leave empty (serves HTML/CSS/JS statically).

### Step 3: Connect Frontend to Your Live Backend
There are two easy ways to link your Vercel frontend to your Render/Railway backend:

#### Method A (Interactive / Zero Code):
1. Open your deployed Vercel site in your browser (e.g., `https://helpdesk-frontend.vercel.app`).
2. Open the browser Developer Console (`F12` or `Cmd+Option+I`) and run:
   ```javascript
   API.setApiBaseUrl('https://helpdesk-backend-xxxx.onrender.com/api');
   ```
   *The page will reload and permanently store your live backend URL in localStorage.*

#### Method B (Direct Config in HTML or API Client):
Set `window.HELP_DESK_API_URL = 'https://helpdesk-backend-xxxx.onrender.com/api'` in `frontend/index.html` or configure your domain.

3. Click **Deploy**!

---

## 🐳 Option 4: Local Docker Compose (Full Stack)

To run everything locally with MySQL in one command:
```bash
docker compose up --build -d
```
* **Frontend:** `http://localhost:3000`
* **Backend:** `http://localhost:8080`
* **MySQL:** `localhost:3306`

---

## 🔍 Health Check & Troubleshooting

### 1. Verify Backend is Live
Run:
```bash
curl -s https://<YOUR-BACKEND-URL>/api/tickets
```
If working, it returns a JSON array `[]` or list of tickets with HTTP status `200 OK`.

### 2. Verify CORS
The backend is pre-configured with Spring Boot CORS to accept requests from any origin (`*`) including `*.vercel.app`, `*.onrender.com`, and `*.railway.app`.

### 3. Database Persistence Note
- By default, the backend runs in-memory H2 mode (ideal for zero-configuration deployments and demos).
- To connect a persistent MySQL or PostgreSQL database on Render or Railway, simply provide:
  - `DB_URL=jdbc:mysql://<host>:<port>/<dbname>`
  - `DB_USERNAME=<user>`
  - `DB_PASSWORD=<password>`
  - `DB_DRIVER=com.mysql.cj.jdbc.Driver`
  - `DB_DIALECT=org.hibernate.dialect.MySQLDialect`
