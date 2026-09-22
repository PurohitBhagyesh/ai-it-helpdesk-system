-- ==========================================================
-- AI-Based IT Support & Helpdesk System - Database Schema (MySQL 8.0+)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS it_helpdesk_db;
USE it_helpdesk_db;

-- 1. Users Table (Identity & Directory)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'EMPLOYEE', 'IT_STAFF', 'ADMIN'
    department VARCHAR(100),
    company_name VARCHAR(150),
    employee_id_code VARCHAR(50),
    join_date VARCHAR(50),
    designation VARCHAR(100),
    experience VARCHAR(255),
    specialization VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tickets Table (Incidents & AI Triage)
CREATE TABLE IF NOT EXISTS tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'NETWORK', 'HARDWARE', 'SOFTWARE', 'ACCESS', 'OTHER'
    priority VARCHAR(50) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH'
    status VARCHAR(50) DEFAULT 'OPEN', -- 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
    suggested_solution TEXT,
    contact_info VARCHAR(255),
    employee_id BIGINT NOT NULL,
    assigned_to BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Ticket Messages Table (Encrypted Support Chat)
CREATE TABLE IF NOT EXISTS ticket_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Resolutions Table (Incident Closure Reports)
CREATE TABLE IF NOT EXISTS resolutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL UNIQUE,
    resolved_by BIGINT NOT NULL,
    resolution_text TEXT NOT NULL,
    resolved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Enquiries Table (Official Administrator Mailbox)
CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT,
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(100) NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    employee_id_code VARCHAR(50),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'IN_REVIEW', 'RESOLVED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Enterprises Table (Multi-Tenant Organization Registration)
CREATE TABLE IF NOT EXISTS enterprises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    admin_email VARCHAR(100) NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    company_location VARCHAR(150),
    company_phone VARCHAR(50),
    company_details TEXT,
    verification_code VARCHAR(10),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
