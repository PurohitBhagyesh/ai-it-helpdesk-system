# AI-Based IT Support & Helpdesk System

A web-based internal IT helpdesk system for organizations that
centralizes employee IT complaints and provides AI-assisted ticket
classification, priority recommendation and troubleshooting suggestions.

> **Academic Project:** Diploma Computer Engineering Minor Project\
> **Team Size:** 3 Members\
> **Primary Backend:** Java + Spring Boot\
> **Frontend:** HTML + CSS + JavaScript\
> **Database:** MySQL

------------------------------------------------------------------------

## 1. Project Overview

Organizations receive many IT complaints such as:

-   Wi-Fi not working
-   Internet connection problems
-   Laptop not starting
-   Keyboard/mouse/monitor problems
-   Printer issues
-   Software crashes
-   Browser errors
-   Password problems
-   Login/access problems

Instead of handling these issues through calls, messages or informal
communication, this project provides one centralized web application.

An employee submits a problem. The system analyzes the description and
recommends:

-   **Category**
-   **Priority**
-   **Suggested solution**

The application then creates a ticket. IT staff manages the ticket until
resolution, while the employee can track the progress.

------------------------------------------------------------------------

## 2. Main Flow

``` text
EMPLOYEE
   |
   | Submit Problem
   v
AI ANALYSIS
   |
   +---- Category
   +---- Priority
   +---- Suggested Solution
   |
   v
CREATE TICKET
   |
   v
OPEN
   |
   v
IT STAFF
   |
   v
IN_PROGRESS
   |
   v
TROUBLESHOOTING
   |
   v
RESOLUTION
   |
   v
RESOLVED
   |
   v
CLOSED
```

------------------------------------------------------------------------

## 3. Key Features

### Employee

-   Login
-   Dashboard
-   Submit IT problem
-   AI analysis
-   Create ticket
-   View own tickets
-   Track ticket status
-   View support messages
-   View resolution

### IT Staff

-   Login
-   Staff dashboard
-   View tickets
-   Accept/assign ticket
-   Update status
-   Add messages
-   Add resolution
-   Resolve tickets

### Admin

-   Login
-   Admin dashboard
-   Total ticket count
-   Open ticket count
-   In-progress count
-   Resolved count
-   Category statistics
-   Priority statistics

------------------------------------------------------------------------

## 4. AI-Assisted Feature

The MVP uses a lightweight rule-based classification engine written in
Java.

It analyzes words in the problem description.

### Network

Keywords:

``` text
wifi
internet
router
network
connection
vpn
```

Example:

> My Wi-Fi is connected but internet is not working.

Result:

``` text
Category: Network
Priority: Medium
```

### Hardware

Keywords:

``` text
laptop
keyboard
mouse
monitor
printer
screen
battery
charger
```

Example:

> My laptop screen is not turning on.

Result:

``` text
Category: Hardware
Priority: Medium
```

### Software

Keywords:

``` text
application
software
crash
error
install
update
browser
chrome
```

Example:

> Chrome application keeps crashing.

Result:

``` text
Category: Software
Priority: Medium
```

### Access

Keywords:

``` text
password
login
account
permission
access
username
```

Example:

> I forgot my company login password.

Result:

``` text
Category: Access
Priority: Low
```

------------------------------------------------------------------------

## 5. Technology Stack

  Layer             Technology
  ----------------- -------------------------
  Frontend          HTML5
  Styling           CSS3
  Frontend Logic    JavaScript
  Backend           Java
  Framework         Spring Boot
  API               REST
  ORM               Spring Data JPA
  Database          MySQL
  Build Tool        Maven
  API Testing       Postman
  IDE               VS Code / Eclipse / STS
  Version Control   Git + GitHub

------------------------------------------------------------------------

## 6. Project Architecture

``` text
Browser
   |
   | HTTP / REST
   v
HTML + CSS + JavaScript
   |
   v
Spring Boot REST API
   |
   +------------------+
   |                  |
   v                  v
AI Service         MySQL
   |
   +--> Category
   +--> Priority
   +--> Solution
```

------------------------------------------------------------------------

## 7. Project Structure

``` text
ai-it-helpdesk/
│
├── README.md
├── PRD.md
├── .gitignore
│
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/example/helpdesk/
│           │       ├── controller/
│           │       │   ├── AuthController.java
│           │       │   ├── TicketController.java
│           │       │   └── AIController.java
│           │       │
│           │       ├── service/
│           │       │   ├── AuthService.java
│           │       │   ├── TicketService.java
│           │       │   └── AIService.java
│           │       │
│           │       ├── repository/
│           │       │   ├── UserRepository.java
│           │       │   ├── TicketRepository.java
│           │       │   └── CategoryRepository.java
│           │       │
│           │       └── entity/
│           │           ├── User.java
│           │           ├── Ticket.java
│           │           ├── Category.java
│           │           └── TicketMessage.java
│           │
│           └── resources/
│               └── application.properties
│
└── frontend/
    ├── index.html
    ├── login.html
    ├── employee-dashboard.html
    ├── create-ticket.html
    ├── my-tickets.html
    ├── ticket-details.html
    ├── staff-dashboard.html
    ├── admin-dashboard.html
    │
    ├── css/
    │   └── style.css
    │
    └── js/
        ├── login.js
        ├── employee.js
        ├── ticket.js
        ├── staff.js
        └── admin.js
```

------------------------------------------------------------------------

## 8. Database

Database name:

``` sql
ai_helpdesk
```

Main tables:

``` text
users
categories
tickets
ticket_messages
```

### users

``` text
id
name
email
password
role
```

Roles:

``` text
EMPLOYEE
STAFF
ADMIN
```

### categories

``` text
id
name
```

Categories:

``` text
Network
Hardware
Software
Access
```

### tickets

``` text
id
ticket_id
user_id
title
description
category
priority
status
assigned_to
solution
created_at
updated_at
```

### ticket_messages

``` text
id
ticket_id
sender_id
message
created_at
```

------------------------------------------------------------------------

## 9. Ticket Status

The project uses four main statuses:

``` text
OPEN
IN_PROGRESS
RESOLVED
CLOSED
```

Normal workflow:

``` text
OPEN
  ↓
IN_PROGRESS
  ↓
RESOLVED
  ↓
CLOSED
```

------------------------------------------------------------------------

## 10. Priority

The MVP uses three priorities:

``` text
HIGH
MEDIUM
LOW
```

### High

Examples:

-   Major outage
-   Security-related incident
-   Critical service unavailable

### Medium

Examples:

-   Wi-Fi problem
-   Laptop issue
-   Printer problem
-   Important application problem

### Low

Examples:

-   Password request
-   Minor software request
-   General access request

------------------------------------------------------------------------

## 11. API Documentation

### Login

``` http
POST /api/login
```

Example:

``` json
{
  "email": "employee@company.com",
  "password": "password"
}
```

------------------------------------------------------------------------

### Analyze Problem

``` http
POST /api/analyze
```

Request:

``` json
{
  "description": "My wifi is connected but internet is not working"
}
```

Response:

``` json
{
  "category": "Network",
  "priority": "Medium",
  "solution": "Restart Wi-Fi adapter and check network connection"
}
```

------------------------------------------------------------------------

### Create Ticket

``` http
POST /api/tickets
```

Example:

``` json
{
  "title": "Wi-Fi not working",
  "description": "My laptop is connected to Wi-Fi but internet is not working."
}
```

------------------------------------------------------------------------

### Get Tickets

``` http
GET /api/tickets
```

------------------------------------------------------------------------

### Get Ticket

``` http
GET /api/tickets/{id}
```

------------------------------------------------------------------------

### Update Ticket

``` http
PUT /api/tickets/{id}
```

Example:

``` json
{
  "status": "IN_PROGRESS"
}
```

------------------------------------------------------------------------

### Add Message

``` http
POST /api/tickets/{id}/messages
```

Example:

``` json
{
  "message": "Please restart the Wi-Fi adapter and test again."
}
```

------------------------------------------------------------------------

### Get Messages

``` http
GET /api/tickets/{id}/messages
```

------------------------------------------------------------------------

## 12. Example End-to-End Request

Employee enters:

``` text
My laptop is connected to Wi-Fi but internet is not working.
```

AI service processes the description.

Expected result:

``` text
Category: Network
Priority: Medium

Suggested Solution:
Restart Wi-Fi adapter and check network connection.
```

Ticket:

``` text
Ticket ID: IT-001
Status: OPEN
Category: Network
Priority: Medium
```

IT staff accepts:

``` text
Status: IN_PROGRESS
```

IT staff solves the problem:

``` text
Resolution:
Wi-Fi adapter was restarted and the network connection was restored.
```

Final:

``` text
Status: RESOLVED
```

------------------------------------------------------------------------

## 13. Installation Requirements

Install:

1.  Java JDK
2.  Maven
3.  MySQL Server
4.  MySQL Workbench
5.  VS Code / Eclipse / STS
6.  Postman
7.  Git

Check Java:

``` bash
java -version
```

Check Maven:

``` bash
mvn -version
```

Check Git:

``` bash
git --version
```

------------------------------------------------------------------------

## 14. Database Setup

Create the database:

``` sql
CREATE DATABASE ai_helpdesk;
```

Then configure Spring Boot:

``` properties
spring.datasource.url=jdbc:mysql://localhost:3306/ai_helpdesk
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Do not commit real database passwords to GitHub.

------------------------------------------------------------------------

## 15. Running the Backend

Go to backend:

``` bash
cd backend
```

Run:

``` bash
mvn spring-boot:run
```

The backend should start on the configured Spring Boot port, commonly:

``` text
http://localhost:8080
```

------------------------------------------------------------------------

## 16. Running the Frontend

The frontend can initially be opened using VS Code Live Server or
another local static web server.

Example:

``` text
frontend/login.html
```

The JavaScript files should call the Spring Boot REST APIs.

Example:

``` javascript
fetch("http://localhost:8080/api/tickets")
```

------------------------------------------------------------------------

## 17. API Testing With Postman

Recommended testing order:

### 1. Login

``` http
POST /api/login
```

### 2. AI Analysis

``` http
POST /api/analyze
```

### 3. Create Ticket

``` http
POST /api/tickets
```

### 4. Get Tickets

``` http
GET /api/tickets
```

### 5. Get Ticket Details

``` http
GET /api/tickets/1
```

### 6. Update Status

``` http
PUT /api/tickets/1
```

### 7. Add Message

``` http
POST /api/tickets/1/messages
```

------------------------------------------------------------------------

## 18. Development Plan

### Step 1 --- Create Project

Create:

``` text
ai-it-helpdesk
```

Create:

``` text
backend
frontend
```

### Step 2 --- Configure Spring Boot

Add dependencies:

-   Spring Web
-   Spring Data JPA
-   MySQL Driver
-   Validation

### Step 3 --- Create Database

Create:

``` text
ai_helpdesk
```

### Step 4 --- Create Entities

Create:

``` text
User
Category
Ticket
TicketMessage
```

### Step 5 --- Create Repositories

Create JPA repositories.

### Step 6 --- Create Services

Create:

``` text
AuthService
TicketService
AIService
```

### Step 7 --- Create Controllers

Create:

``` text
AuthController
TicketController
AIController
```

### Step 8 --- Build Login

Connect frontend login form to:

``` text
POST /api/login
```

### Step 9 --- Build Employee Module

Implement:

-   Dashboard
-   Create ticket
-   My tickets
-   Ticket details

### Step 10 --- Build AI Module

Implement:

-   Keyword detection
-   Category
-   Priority
-   Suggested solution

### Step 11 --- Build Staff Module

Implement:

-   Ticket list
-   Assignment
-   Status
-   Messages
-   Resolution

### Step 12 --- Build Admin Module

Implement:

-   Statistics
-   Category counts
-   Priority counts
-   Status counts

### Step 13 --- Integration

Connect all frontend pages to backend APIs.

### Step 14 --- Testing

Test complete workflows.

### Step 15 --- Documentation

Prepare:

-   Report
-   PPT
-   Screenshots
-   README
-   Demo script

------------------------------------------------------------------------

## 19. Team Division

### Member 1 --- Frontend Developer

Responsibilities:

``` text
Login
Employee Dashboard
Create Ticket
My Tickets
Ticket Details
CSS
JavaScript
API Integration
```

### Member 2 --- Backend + Database Developer

Responsibilities:

``` text
Spring Boot
MySQL
Entities
Repositories
Services
REST APIs
Authentication
Ticket lifecycle
```

### Member 3 --- AI + Staff/Admin Developer

Responsibilities:

``` text
AI classification
Priority logic
Solution engine
Staff Dashboard
Admin Dashboard
Statistics
Testing
```

------------------------------------------------------------------------

## 20. Testing Checklist

### Authentication

-   [ ] Correct login works
-   [ ] Wrong password is rejected
-   [ ] Empty email is rejected
-   [ ] Empty password is rejected

### Employee

-   [ ] Dashboard opens
-   [ ] Ticket can be created
-   [ ] Empty description is rejected
-   [ ] AI analysis works
-   [ ] Ticket appears in My Tickets
-   [ ] Ticket details open
-   [ ] Messages are visible
-   [ ] Resolution is visible

### AI

-   [ ] Wi-Fi → Network
-   [ ] Laptop → Hardware
-   [ ] Chrome crash → Software
-   [ ] Password → Access
-   [ ] Major outage → High priority where rule applies

### Staff

-   [ ] Staff dashboard works
-   [ ] Ticket can be accepted
-   [ ] Status changes
-   [ ] Message can be added
-   [ ] Resolution can be added

### Admin

-   [ ] Statistics load
-   [ ] Ticket counts are correct
-   [ ] Category statistics work
-   [ ] Priority statistics work

------------------------------------------------------------------------

## 21. Git Workflow

Initialize:

``` bash
git init
```

Add files:

``` bash
git add .
```

Commit:

``` bash
git commit -m "Initial project setup"
```

Connect GitHub repository:

``` bash
git remote add origin YOUR_REPOSITORY_URL
```

Push:

``` bash
git push -u origin main
```

Recommended branches:

``` text
main
frontend
backend
ai-admin
```

------------------------------------------------------------------------

## 22. Suggested Commit Messages

``` text
Initial project setup
Create MySQL database entities
Implement login API
Create employee dashboard
Implement ticket API
Add AI classification
Add priority logic
Add solution recommendation
Create staff dashboard
Create admin dashboard
Integrate frontend and backend
Add validation
Fix ticket status workflow
Add testing
Update documentation
```

------------------------------------------------------------------------

## 23. Security Notes

For a real production application:

-   Use Spring Security
-   Hash passwords
-   Implement proper authentication tokens/session management
-   Validate authorization on every protected API
-   Do not expose database credentials
-   Validate all user input
-   Configure CORS appropriately
-   Use HTTPS
-   Log security events
-   Protect sensitive information

For the academic MVP, implement only the security level that can be
correctly demonstrated and explained.

------------------------------------------------------------------------

## 24. What Makes This Project Different From Simple CRUD?

A simple CRUD application generally performs:

``` text
Create
Read
Update
Delete
```

This project adds an intelligent processing step:

``` text
Problem Description
        ↓
AI-Assisted Analysis
        ↓
Category
Priority
Suggested Solution
        ↓
Ticket
        ↓
IT Workflow
        ↓
Resolution
```

Therefore, the project demonstrates more than basic database operations.

------------------------------------------------------------------------

## 25. Important Note About the AI

The MVP uses a **rule-based intelligent classification system**.

It should be presented honestly as:

> AI-assisted / intelligent rule-based ticket classification.

It should NOT be described as a trained machine-learning model unless
the team actually trains, evaluates and integrates an ML model.

A future version can replace the rule engine with:

-   NLP
-   Machine Learning
-   Transformer models
-   LLM-based troubleshooting
-   Knowledge-base retrieval

------------------------------------------------------------------------

## 26. Future Scope

Possible future versions can include:

-   Machine-learning classification
-   LLM support assistant
-   Knowledge-base recommendations
-   Automatic duplicate detection
-   Automatic escalation
-   SLA tracking
-   Email notification
-   Microsoft Teams/Slack integration
-   WhatsApp integration
-   Mobile application
-   Voice-based support
-   Asset management
-   Device monitoring
-   Advanced analytics
-   Multi-language support

------------------------------------------------------------------------

## 27. Final Demo Script

Use the following sequence during project evaluation.

### Step 1

Open the application.

### Step 2

Login as Employee.

### Step 3

Open:

``` text
Create Ticket
```

### Step 4

Enter:

``` text
My laptop is connected to Wi-Fi but internet is not working.
```

### Step 5

Click:

``` text
Analyze Problem
```

Show:

``` text
Category: Network
Priority: Medium
Suggested Solution: Restart Wi-Fi adapter and check network connection
```

### Step 6

Click:

``` text
Create Ticket
```

Show:

``` text
IT-001
OPEN
```

### Step 7

Logout and login as IT Staff.

### Step 8

Open the ticket.

### Step 9

Accept the ticket.

Show:

``` text
IN_PROGRESS
```

### Step 10

Add troubleshooting message.

### Step 11

Add final resolution.

### Step 12

Change status:

``` text
RESOLVED
```

### Step 13

Login as Employee.

Show:

``` text
Ticket Status: RESOLVED
Resolution: ...
```

### Step 14

Login as Admin.

Show updated statistics.

------------------------------------------------------------------------

## 28. Project Deliverables

The final submission should contain:

``` text
Source Code
Database
README.md
PRD.md
Project Report
PPT
Screenshots
Test Cases
API Documentation
Demo Video (if required)
```

------------------------------------------------------------------------

## 29. Recommended Report Chapters

``` text
1. Title Page
2. Certificate
3. Declaration
4. Acknowledgement
5. Abstract
6. Introduction
7. Problem Statement
8. Existing System
9. Limitations of Existing System
10. Proposed System
11. Objectives
12. Requirements
13. Hardware/Software Requirements
14. System Architecture
15. DFD
16. ER Diagram
17. Database Design
18. Module Description
19. AI Classification Method
20. Implementation
21. Testing
22. Results/Screenshots
23. Advantages
24. Limitations
25. Future Scope
26. Conclusion
27. References
```

------------------------------------------------------------------------

## 30. Final Project Definition

The complete project can be summarized as:

> **Employee → Problem Submission → AI-Assisted Analysis → Category +
> Priority + Suggested Solution → Ticket Creation → IT Staff Assignment
> → Troubleshooting → Resolution → Employee Tracking → Admin Reporting**

The goal is to create a practical, understandable and demonstrable
Diploma-level system rather than an oversized enterprise product.
