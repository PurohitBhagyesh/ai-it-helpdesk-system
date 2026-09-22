# Database Module - AI IT Helpdesk System

## 📌 Role & Purpose
**Lead Role:** Database & Integration Lead  
**Technologies:** MySQL, SQL, MySQL Workbench / phpMyAdmin / CLI  
**Goal:** Design relational tables, write data definition (DDL) schemas, prepare seed/mock data, and assist in connecting the Spring Boot backend to MySQL.

---

## 📂 Recommended Directory Structure

```text
database/
├── README.md                  # Database documentation and setup guide
├── schema.sql                 # Complete table structure (DDL)
└── seed_data.sql              # Initial test data (sample users, tickets, messages)
```

---

## 🗄️ Relational Schema Design

### 1. `users` Table
Stores system users across all 3 roles.
* `id` (BIGINT, Primary Key, Auto Increment)
* `name` (VARCHAR(100), NOT NULL)
* `email` (VARCHAR(100), UNIQUE, NOT NULL)
* `password` (VARCHAR(255), NOT NULL)
* `role` (ENUM('EMPLOYEE', 'IT_STAFF', 'ADMIN'), NOT NULL)
* `department` (VARCHAR(100))
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 2. `tickets` Table
Stores IT complaints, AI classification outputs, and current status.
* `id` (BIGINT, Primary Key, Auto Increment)
* `title` (VARCHAR(200), NOT NULL)
* `description` (TEXT, NOT NULL)
* `category` (ENUM('NETWORK', 'HARDWARE', 'SOFTWARE', 'ACCESS', 'OTHER'), NOT NULL)
* `priority` (ENUM('LOW', 'MEDIUM', 'HIGH'), NOT NULL)
* `status` (ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'), DEFAULT 'OPEN')
* `suggested_solution` (TEXT)
* `employee_id` (BIGINT, Foreign Key $\rightarrow$ `users.id`)
* `assigned_to` (BIGINT NULL, Foreign Key $\rightarrow$ `users.id`)
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
* `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

### 3. `ticket_messages` Table
Stores conversation/troubleshooting thread between Employee and Staff.
* `id` (BIGINT, Primary Key, Auto Increment)
* `ticket_id` (BIGINT, Foreign Key $\rightarrow$ `tickets.id` ON DELETE CASCADE)
* `sender_id` (BIGINT, Foreign Key $\rightarrow$ `users.id`)
* `message` (TEXT, NOT NULL)
* `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### 4. `resolutions` Table
Stores final resolution notes when a ticket is closed/resolved.
* `id` (BIGINT, Primary Key, Auto Increment)
* `ticket_id` (BIGINT, UNIQUE, Foreign Key $\rightarrow$ `tickets.id` ON DELETE CASCADE)
* `resolved_by` (BIGINT, Foreign Key $\rightarrow$ `users.id`)
* `resolution_text` (TEXT, NOT NULL)
* `resolved_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

---

## 🛠️ How to Set Up the Database Locally

1. Open **MySQL Workbench** or your terminal:
   ```bash
   mysql -u root -p
   ```
2. Run the schema script:
   ```sql
   SOURCE database/schema.sql;
   ```
3. Run the seed data script:
   ```sql
   SOURCE database/seed_data.sql;
   ```
4. Verify the database:
   ```sql
   USE it_helpdesk_db;
   SHOW TABLES;
   SELECT * FROM users;
   ```

---

## ✅ Step-by-Step Task Checklist for Database Lead
- [ ] 1. Install and verify MySQL server locally (or via XAMPP).
- [ ] 2. Create the `it_helpdesk_db` database using `schema.sql`.
- [ ] 3. Verify Foreign Key constraints and indexing.
- [ ] 4. Populate sample data using `seed_data.sql` for testing all user roles.
- [ ] 5. Help backend developer verify database connection via `application.properties`.
- [ ] 6. Write custom SQL queries for admin analytics (e.g. count tickets by category, avg resolution time).
