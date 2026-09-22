# System Architecture & Technical Design

## 🏛️ 1. High-Level Architecture Overview

The **AI-Based IT Support & Helpdesk System** follows a clean, decoupled 3-tier client-server architecture:

```
+-----------------------------------------------------------------------------------+
|                                PRESENTATION TIER                                  |
|  +---------------------+  +----------------------+  +--------------------------+  |
|  |  Employee Portal    |  |   IT Staff Portal    |  |     Admin Analytics      |  |
|  | (HTML/CSS/VanillaJS)|  | (Queue & Resolution) |  |   (KPI & Distribution)   |  |
|  +----------+----------+  +----------+-----------+  +------------+-------------+  |
+-------------|------------------------|---------------------------|----------------+
              |                        |                           |
              |                 REST API (HTTP/JSON)               |
              +------------------------+---------------------------+
                                       |
+--------------------------------------v--------------------------------------------+
|                                APPLICATION TIER                                   |
|                           [Java 17 / Spring Boot 3]                               |
|                                                                                   |
|  +-------------------+   +--------------------+   +----------------------------+  |
|  |  REST Controllers |-->|  Service Layer     |-->|    JPA Repositories        |  |
|  |  - AuthController |   |  - UserService     |   |    - UserRepository        |  |
|  |  - TicketControl. |   |  - TicketService   |   |    - TicketRepository      |  |
|  |  - AdminControl.  |   |  - AdminService    |   |    - MessageRepository     |  |
|  +-------------------+   +---------+----------+   |    - ResolutionRepository  |  |
|                                    |              +--------------+-------------+  |
|                                    v                             |                |
|                          +-------------------+                   |                |
|                          | AI Rule Engine    |                   |                |
|                          | - KeywordMatcher  |                   |                |
|                          | - SolutionAdvisor |                   |                |
|                          +-------------------+                   |                |
+------------------------------------------------------------------|----------------+
                                                                   |
+------------------------------------------------------------------v----------------+
|                                  DATA TIER                                        |
|        +----------------------------------+   +-------------------------------+   |
|        | In-Memory H2 DB (Default Dev)    |   | MySQL Relational DB (Prod)    |   |
|        +----------------------------------+   +-------------------------------+   |
+-----------------------------------------------------------------------------------+
```

---

## 🧠 2. AI Classification Engine Architecture

The AI module operates via real-time lexical analysis and heuristic rule mapping:

```
Problem Description Input
        │
        ▼
[ Token Normalization & Preprocessing ]
        │
        ├──▶ Match Network Keywords    ──▶ Weight Score (NETWORK)
        ├──▶ Match Hardware Keywords   ──▶ Weight Score (HARDWARE)
        ├──▶ Match Software Keywords   ──▶ Weight Score (SOFTWARE)
        └──▶ Match Access Keywords     ──▶ Weight Score (ACCESS)
        │
        ▼
[ Max-Weight Category Selector ]
        │
        ├──▶ Severity / Urgency Scanner ──▶ Recommended Priority (LOW / MEDIUM / HIGH)
        │
        ▼
[ Diagnostic Solution Advisor ]
        │
        ▼
Output: { Category, Priority, SuggestedSolution }
```

---

## 🗄️ 3. Database Entity-Relationship (ER) Model

```
+--------------------+        1:N         +--------------------+
|       USERS        | ------------------< |      TICKETS       |
+--------------------+                     +--------------------+
| PK  id             |                     | PK  id             |
|     name           |                     |     title          |
|     email (UNIQUE) |                     |     description    |
|     password       |                     |     category       |
|     role           |                     |     priority       |
|     department     |                     |     status         |
|     created_at     |                     |     suggested_sol. |
+--------------------+                     | FK  employee_id    |
         |                                 | FK  assigned_to    |
         |                                 |     created_at     |
         |                                 +--------------------+
         |                                           |
         |                                    +------+------+
         |                                    |             |
         | 1:N                                | 1:N         | 1:1
         v                                    v             v
+--------------------+             +--------------------+ +--------------------+
|  TICKET_MESSAGES   |             |  TICKET_MESSAGES   | |    RESOLUTIONS     |
+--------------------+             +--------------------+ +--------------------+
| PK  id             |             | PK  id             | | PK  id             |
| FK  ticket_id      |             | FK  ticket_id      | | FK  ticket_id (UQ) |
| FK  sender_id      |             | FK  sender_id      | | FK  resolved_by    |
|     message        |             |     message        | |     resolution_txt |
|     created_at     |             |     created_at     | |     resolved_at    |
+--------------------+             +--------------------+ +--------------------+
```

---

## 🔄 4. End-to-End Incident Lifecycle

1. **Submission & Diagnostic:** Employee inputs technical fault $\rightarrow$ AI generates instant Category, Priority & Self-Troubleshooting steps $\rightarrow$ Ticket created with status `OPEN`.
2. **Assignment:** IT Engineer views incoming queue $\rightarrow$ Claims ticket $\rightarrow$ Status moves to `IN_PROGRESS` with assigned engineer ID recorded.
3. **Collaboration:** Employee and IT staff exchange messages through the threaded conversation log.
4. **Resolution:** IT Engineer documents technical fix report $\rightarrow$ Ticket moves to `RESOLVED` $\rightarrow$ Employee reviews resolution notes and confirms closure (`CLOSED`).
5. **Analytics:** Admin dashboard aggregates resolution rates, category frequency, and response times in real time.
