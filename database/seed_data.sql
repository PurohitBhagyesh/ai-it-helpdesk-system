-- ==========================================================
-- Sample Seed Data for AI IT Helpdesk System
-- ==========================================================

USE it_helpdesk_db;

-- Insert Sample Users (Admin, IT Staff, Employees)
INSERT INTO users (name, email, password, role, department) VALUES
('System Administrator', 'admin@helpdesk.com', 'admin123', 'ADMIN', 'IT Operations'),
('Alex Support', 'alex.staff@helpdesk.com', 'staff123', 'IT_STAFF', 'IT Support Team'),
('Sarah Engineer', 'sarah.staff@helpdesk.com', 'staff123', 'IT_STAFF', 'Network Operations'),
('John Doe', 'john.doe@company.com', 'user123', 'EMPLOYEE', 'Finance'),
('Emily Davis', 'emily.davis@company.com', 'user123', 'EMPLOYEE', 'Marketing');

-- Insert Sample Tickets
INSERT INTO tickets (title, description, category, priority, status, suggested_solution, employee_id, assigned_to) VALUES
('Wi-Fi disconnects frequently in Conference Room B', 'My laptop keeps dropping the office Wi-Fi network connection whenever I move to meeting room 2B.', 'NETWORK', 'MEDIUM', 'OPEN', 'Restart Wi-Fi adapter, verify router signal in Room 2B, or check network connection.', 4, NULL),
('Laptop screen remains black on startup', 'Pressing power button turns on keyboard backlight but monitor screen stays completely dark.', 'HARDWARE', 'HIGH', 'IN_PROGRESS', 'Check power adapter cable, perform hard reset by holding power for 15s, or connect to external monitor.', 5, 2),
('Forgot company intranet password', 'I got locked out of my corporate portal account after 3 failed login attempts.', 'ACCESS', 'LOW', 'RESOLVED', 'Verify username, use self-service password reset, or contact domain administrator.', 4, 3);

-- Insert Sample Messages
INSERT INTO ticket_messages (ticket_id, sender_id, message) VALUES
(2, 5, 'I tried holding the power button for 15 seconds, but the display is still blank.'),
(2, 2, 'Thanks Emily. I will bring an external HDMI monitor to your desk to check the display card.');

-- Insert Sample Resolution
INSERT INTO resolutions (ticket_id, resolved_by, resolution_text) VALUES
(3, 3, 'User identity verified and account password reset link sent via corporate SMS.');
