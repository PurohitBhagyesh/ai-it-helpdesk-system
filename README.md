# Frontend Module - AI IT Helpdesk System

## 📌 Role & Purpose
**Lead Role:** Frontend Developer  
**Technologies:** HTML5, CSS3, JavaScript (ES6+), Fetch API  
**Goal:** Build a responsive, clean, and modern user interface that communicates seamlessly with the Spring Boot backend via REST APIs.

---

## 📂 Recommended Directory Structure

```text
frontend/
├── index.html                 # Login & authentication page
├── employee-dashboard.html    # Employee portal: submit problem & track my tickets
├── staff-dashboard.html       # IT Staff portal: view & manage assigned/open tickets
├── admin-dashboard.html       # Admin portal: system statistics & ticket metrics
├── ticket-details.html        # Detailed view for a single ticket (chat & resolution)
├── css/
│   ├── style.css              # Global styles, variables, typography, reset
│   ├── dashboard.css          # Cards, grid layouts, tables, status badges
│   └── responsive.css         # Mobile & tablet responsiveness
├── js/
│   ├── api.js                 # Centralized Fetch API helper functions
│   ├── auth.js                # Login / session management (localStorage)
│   ├── employee.js            # Problem submission, AI preview, my tickets
│   ├── staff.js               # Status updates, taking tickets, adding resolution
│   └── admin.js               # Stats rendering & chart integration
└── assets/
    └── images/                # Icons and logos
```

---

## 🚀 Key Pages to Build

### 1. `index.html` (Authentication)
- Clean login form with **Email** and **Password**.
- Role selector / auto-redirection based on backend response (`EMPLOYEE`, `IT_STAFF`, `ADMIN`).
- Store authenticated user info in `localStorage` / `sessionStorage`.

### 2. `employee-dashboard.html` (Employee Portal)
- **Ticket Summary Cards:** Total tickets, Open, In Progress, Resolved.
- **Submit Problem Section:**
  - Problem Title & Problem Description inputs.
  - **Live AI Diagnostic Box:** Displays predicted Category, Priority, and Suggested Troubleshooting Solution before/after submission.
- **My Tickets Table:** Lists recent tickets with Status Badges (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).

### 3. `staff-dashboard.html` (IT Staff Portal)
- List of **Unassigned / Open Tickets** with a **"Take Ticket"** button.
- List of **My Assigned Tickets**.
- Quick Status Change dropdown (`IN_PROGRESS`, `RESOLVED`).

### 4. `ticket-details.html` (Ticket Conversation & Resolution)
- Full ticket details (ID, Title, Category, Priority, Employee name, Created time).
- AI Suggested Solution preview.
- **Message Thread (Chat):** Two-way messaging between Employee and Staff.
- **Resolution Box (Staff only):** Form to enter final resolution note and close/resolve ticket.

### 5. `admin-dashboard.html` (Analytics Portal)
- Metrics cards (Total Tickets, Open Count, Avg Resolution Time).
- Category distribution breakdown (Network, Hardware, Software, Access).
- Priority distribution breakdown (Low, Medium, High).

---

## 🔗 Backend REST APIs to Integrate (via `fetch()`)

| Action | HTTP Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Login** | `POST` | `/api/auth/login` | Send credentials, receive user role & token/ID |
| **Analyze Problem (AI)** | `POST` | `/api/tickets/analyze` | Send description, get predicted category & solution |
| **Create Ticket** | `POST` | `/api/tickets` | Submit new ticket |
| **Get My Tickets** | `GET` | `/api/tickets/my-tickets?userId={id}` | Fetch logged-in employee's tickets |
| **Get All Tickets** | `GET` | `/api/tickets` | Fetch tickets for staff/admin |
| **Get Ticket Details** | `GET` | `/api/tickets/{id}` | Fetch full ticket info with messages |
| **Update Status** | `PUT` | `/api/tickets/{id}/status` | Change status (`OPEN` -> `IN_PROGRESS` -> etc.) |
| **Send Message** | `POST` | `/api/tickets/{id}/messages` | Add a comment/message to a ticket |
| **Resolve Ticket** | `POST` | `/api/tickets/{id}/resolve` | Submit final resolution note |
| **Get Admin Stats** | `GET` | `/api/admin/stats` | Fetch counts by status, category, and priority |

---

## ✅ Step-by-Step Task Checklist for Frontend Developer
- [ ] 1. Create the shared CSS design system (colors, buttons, badges, typography, cards).
- [ ] 2. Build `index.html` and connect login logic with backend in `auth.js`.
- [ ] 3. Build `employee-dashboard.html` with ticket submission form and live AI preview.
- [ ] 4. Build `staff-dashboard.html` with ticket assignment and status update actions.
- [ ] 5. Build `ticket-details.html` with comment thread and resolution form.
- [ ] 6. Build `admin-dashboard.html` with summary metrics.
- [ ] 7. Test all pages across different screen sizes.
