-- ==========================================================
-- Enterprise IT Helpdesk Seed Dataset
-- Target: MySQL 8.0+
-- ==========================================================

USE it_helpdesk_db;

-- 1. Seed Enterprise
INSERT INTO enterprises (id, company_name, domain, verification_code, is_verified, created_at)
VALUES (1, 'Acme Global Corp', 'acme.com', '789123', TRUE, NOW())
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name);

-- 2. Seed Default User Accounts
-- Password 'admin123' / 'staff123' / 'employee123'
INSERT INTO users (id, enterprise_id, name, email, password, role, department, designation, employee_id_code, technician_id_code, years_of_experience, specializations, phone, desk_location)
VALUES
(1, 1, 'System Administrator', 'admin@helpdesk.com', 'admin123', 'ADMIN', 'IT Operations', 'Head of IT', 'ADMIN-001', NULL, 10, 'Infrastructure, Cybersecurity', '+1 (555) 010-0001', 'HQ Executive Suite 4B'),
(2, 1, 'Alex Staff', 'alex.staff@helpdesk.com', 'staff123', 'IT_TECHNICIAN', 'Technical Support', 'Senior Tier-1 Support Engineer', NULL, 'TECH-2050', 5, 'Hardware, Linux, Active Directory', '+1 (555) 010-0002', 'Desk Tech Lab 1'),
(3, 1, 'Sarah Staff', 'sarah.staff@helpdesk.com', 'staff123', 'IT_TECHNICIAN', 'Network Operations', 'Network Security Specialist', NULL, 'TECH-2051', 6, 'Cisco, Fortinet, VPN, Subnets', '+1 (555) 010-0003', 'NOC Station 2'),
(4, 1, 'John Doe', 'john.doe@company.com', 'employee123', 'EMPLOYEE', 'Software Engineering', 'Senior Full Stack Engineer', 'EMP-1050', NULL, 4, NULL, '+1 (555) 010-0004', 'Floor 3, Desk 304'),
(5, 1, 'Emily Davis', 'emily.davis@company.com', 'employee123', 'EMPLOYEE', 'Finance', 'Financial Analyst', 'EMP-1051', NULL, 3, NULL, '+1 (555) 010-0005', 'Floor 2, Desk 210')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 3. Seed Sample Incidents
INSERT INTO tickets (id, title, description, category, priority, status, desk_location, contact_phone, suggested_solution, employee_id, assigned_to, created_at)
VALUES
(1, 'VPN connection drops intermittently', 'Unable to stay connected to corporate global VPN when routing via Singapore gateway.', 'NETWORK', 'HIGH', 'IN_PROGRESS', 'Floor 3, Desk 304', '+1 (555) 010-0004', 'Flush local DNS cache and re-authenticate via WireGuard/AnyConnect client.', 4, 3, NOW() - INTERVAL 2 HOUR),
(2, 'Dual monitor HDMI adapter non-responsive', 'Secondary 4K monitor does not receive display output from Dell docking station.', 'HARDWARE', 'MEDIUM', 'OPEN', 'Floor 2, Desk 210', '+1 (555) 010-0005', 'Power cycle docking station and verify DisplayPort alt-mode cable.', 5, NULL, NOW() - INTERVAL 1 HOUR)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 4. Seed Chat Message
INSERT INTO ticket_messages (id, ticket_id, sender_id, message, is_encrypted, created_at)
VALUES
(1, 1, 3, 'Hello John, I am reviewing your VPN gateway logs now. Please confirm if you are on WiFi or Ethernet.', TRUE, NOW() - INTERVAL 1 HOUR)
ON DUPLICATE KEY UPDATE message=VALUES(message);

-- 5. Seed Administrator Enquiry
INSERT INTO enquiries (id, sender_name, sender_email, sender_id_code, sender_role, subject, message, status, created_at)
VALUES
(1, 'John Doe', 'john.doe@company.com', 'EMP-1050', 'EMPLOYEE', 'Requesting Cloud Sandbox Access', 'Need temporary developer sandbox provisioned for Q3 telemetry project.', 'OPEN', NOW() - INTERVAL 3 HOUR)
ON DUPLICATE KEY UPDATE subject=VALUES(subject);
