# Database Setup Guide

This directory provides the relational database schema and seed data for the **AI IT Helpdesk System**.

## 🗄️ Database Files
- `schema.sql`: Contains MySQL 8.0+ DDL statements for all platform tables (`enterprises`, `users`, `tickets`, `ticket_messages`, `enquiries`, `resolutions`).
- `seed_data.sql`: Seed dataset provisioning default administrative, IT technician, and employee accounts alongside demo tickets.

## 🚀 Loading into Local MySQL Instance
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p it_helpdesk_db < database/seed_data.sql
```

When using Docker Compose, these files are loaded automatically via `/docker-entrypoint-initdb.d/`.
