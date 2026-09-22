# Product Requirements Document (PRD)

## AI-Based IT Support & Helpdesk System

**Project Type:** Diploma Computer Engineering Minor Project\
**Team Size:** 3 Members\
**Version:** 1.0\
**Status:** Proposed / Academic Prototype

------------------------------------------------------------------------

## 1. Product Overview

The AI-Based IT Support & Helpdesk System is a web-based internal IT
support platform for organizations. Employees can report technical
problems such as Wi-Fi issues, laptop problems, software errors, printer
issues, password/access problems, and similar IT incidents.

When an employee submits a problem, the system performs AI-assisted
analysis using a lightweight rule-based classification engine. It
identifies a suitable category, recommends a priority, and provides a
suggested troubleshooting solution. A support ticket is then created and
routed to IT staff.

IT staff can view assigned tickets, change status, communicate through
ticket messages, add a resolution, and close the issue. Administrators
can monitor ticket statistics and basic support activity.

The academic version intentionally keeps the scope small enough for a
3-member Diploma project while demonstrating frontend development, Java
backend development, database management, REST APIs, authentication,
intelligent classification, and reporting.

------------------------------------------------------------------------

## 2. Problem Statement

In many organizations, employees report IT problems through informal
channels such as phone calls, messaging applications, emails, or verbal
communication. This can cause:

-   Problems being missed or forgotten
-   No centralized ticket history
-   Difficult tracking of issue status
-   Manual classification of incidents
-   Delayed assignment to the correct support person
-   Repeated troubleshooting effort
-   Limited reporting about IT support performance

The proposed system centralizes the complete process from problem
submission to resolution.

------------------------------------------------------------------------

## 3. Goals

### Primary Goals

1.  Provide one web portal for submitting IT problems.
2.  Automatically classify submitted problems into IT categories.
3.  Recommend ticket priority.
4.  Suggest an initial troubleshooting solution.
5.  Create a unique support ticket.
6.  Allow IT staff to manage ticket status and resolution.
7.  Allow employees to track their own tickets.
8.  Provide administrators with basic statistics.
9.  Store ticket history in a relational database.

### Secondary Goals

-   Reduce repetitive manual classification.
-   Make the support process transparent.
-   Demonstrate practical use of AI-assisted logic.
-   Create a project that can be demonstrated end-to-end.

------------------------------------------------------------------------

## 4. Non-Goals / Out of Scope

The first version will NOT include:

-   Native Android/iOS application
-   Voice assistant
-   WhatsApp integration
-   Email automation
-   Real-time chatbot
-   Complex machine-learning model training
-   Enterprise-scale deployment
-   Microservices architecture
-   Advanced asset management
-   Real-time monitoring of company devices
-   Payment functionality
-   Complex SLA engine

These may be listed as future scope.

------------------------------------------------------------------------

## 5. Target Users

### 5.1 Employee

Employees use the system to:

-   Login
-   Submit IT problems
-   View AI analysis
-   Create tickets
-   View their tickets
-   Check status
-   Read support responses
-   View final resolution

### 5.2 IT Staff

IT staff use the system to:

-   Login
-   View assigned/open tickets
-   Accept tickets
-   Change ticket status
-   Add troubleshooting messages
-   Add final resolution
-   Resolve tickets

### 5.3 Admin

Admin users use the system to:

-   View overall ticket statistics
-   Monitor categories
-   Monitor priorities and statuses
-   View basic support activity
-   Manage/monitor users in the extended version

------------------------------------------------------------------------

## 6. User Roles and Permissions

  Feature                  Employee                     IT Staff          Admin
  ---------------------- ---------- ---------------------------- --------------
  Login                         Yes                          Yes            Yes
  Submit ticket                 Yes                     Optional       Optional
  View own tickets              Yes                          Yes            Yes
  View all tickets               No   Assigned/available tickets            Yes
  Update ticket status           No                          Yes            Yes
  Add ticket message            Yes                          Yes            Yes
  Add resolution                 No                          Yes            Yes
  View dashboard           Personal                        Staff          Admin
  View statistics                No                        Basic            Yes
  User management                No                           No   Yes/Extended

------------------------------------------------------------------------

## 7. Proposed Technology Stack

### Frontend

-   HTML5
-   CSS3
-   JavaScript
-   Fetch API for backend communication

### Backend

-   Java
-   Spring Boot
-   Spring Web / REST
-   Spring Data JPA

### Database

-   MySQL
-   SQL

### AI / Intelligent Module

-   Java-based rule/keyword classification
-   Category detection
-   Priority recommendation
-   Suggested solution generation

### Tools

-   VS Code / Eclipse / Spring Tool Suite
-   MySQL Workbench
-   Postman
-   Git
-   GitHub
-   Maven

------------------------------------------------------------------------

## 8. System Architecture

``` text
+----------------------+
|      Employee        |
+----------+-----------+
           |
           v
+----------------------+
| HTML/CSS/JavaScript  |
|      Frontend        |
+----------+-----------+
           |
        REST API
           |
           v
+----------------------+
|   Java Spring Boot   |
|      Backend         |
+----+------------+----+
     |            |
     v            v
+---------+   +----------------+
| MySQL   |   | AI Analysis    |
|Database |   | Classification |
+---------+   +----------------+
                    |
                    v
             Category + Priority
             + Suggested Solution
                    |
                    v
             +-------------+
             | IT Staff    |
             +-------------+
                    |
                    v
               Resolution
```

------------------------------------------------------------------------

## 9. Core Workflow

``` text
Employee Login
      |
      v
Employee Dashboard
      |
      v
Submit Problem
      |
      v
AI Analysis
      |
      +--> Category
      +--> Priority
      +--> Suggested Solution
      |
      v
Create Ticket
      |
      v
Ticket Status = OPEN
      |
      v
IT Staff Views Ticket
      |
      v
IN_PROGRESS
      |
      v
IT Staff Troubleshoots
      |
      v
Add Resolution
      |
      v
RESOLVED
      |
      v
Employee Views Resolution
      |
      v
CLOSED
```

------------------------------------------------------------------------

## 10. Functional Requirements

### FR-01 Authentication

The system shall allow users to login using email and password.

**Input:** - Email - Password

**Output:** - Successful login - User role - Redirect to role-specific
dashboard

Invalid credentials must produce an error message.

------------------------------------------------------------------------

### FR-02 Employee Dashboard

The employee dashboard shall display:

-   Total tickets
-   Open tickets
-   In-progress tickets
-   Resolved tickets
-   Recent tickets
-   Create Ticket button

------------------------------------------------------------------------

### FR-03 Create Ticket

The employee shall be able to enter:

-   Problem title
-   Problem description

The description must not be empty.

After submission, the system sends the description to the AI analysis
module.

------------------------------------------------------------------------

### FR-04 AI-Assisted Analysis

The system shall analyze the problem description and generate:

-   Category
-   Priority
-   Suggested solution

Example:

**Input:** \> My Wi-Fi is connected but internet is not working.

**Output:** - Category: Network - Priority: Medium - Suggested Solution:
Restart Wi-Fi adapter and check network connection.

------------------------------------------------------------------------

### FR-05 Ticket Creation

After analysis, the system shall create a ticket containing:

-   Ticket ID
-   Employee
-   Title
-   Description
-   Category
-   Priority
-   Status
-   Suggested solution
-   Creation time

Initial status:

`OPEN`

------------------------------------------------------------------------

### FR-06 Ticket List

Employees shall be able to view their own tickets.

Each ticket should show:

-   Ticket ID
-   Title
-   Category
-   Priority
-   Status
-   Created date

------------------------------------------------------------------------

### FR-07 Ticket Details

A ticket detail page shall display:

-   Ticket information
-   Problem description
-   AI category
-   Priority
-   Suggested solution
-   Current status
-   Assigned IT staff
-   Messages
-   Final resolution

------------------------------------------------------------------------

### FR-08 IT Staff Dashboard

The staff dashboard shall display:

-   Open tickets
-   In-progress tickets
-   Resolved tickets
-   Assigned tickets
-   Ticket list

------------------------------------------------------------------------

### FR-09 Ticket Assignment

An IT staff member shall be able to take/accept an available ticket.

The system shall record the staff member as the assignee.

------------------------------------------------------------------------

### FR-10 Status Management

Supported statuses:

``` text
OPEN
IN_PROGRESS
RESOLVED
CLOSED
```

Typical transition:

`OPEN → IN_PROGRESS → RESOLVED → CLOSED`

------------------------------------------------------------------------

### FR-11 Ticket Messages

Employees and IT staff shall be able to add messages to a ticket.

Example:

Employee: \> I already restarted the laptop but the problem continues.

IT Staff: \> Please check whether other devices can access the same
Wi-Fi network.

------------------------------------------------------------------------

### FR-12 Resolution

IT staff shall be able to add a final resolution.

Example:

> Network adapter was reset and the Wi-Fi connection was restored.

The ticket status can then be changed to `RESOLVED`.

------------------------------------------------------------------------

### FR-13 Admin Dashboard

The admin dashboard shall display basic statistics:

-   Total tickets
-   Open tickets
-   In-progress tickets
-   Resolved tickets
-   Closed tickets
-   Tickets by category
-   Tickets by priority

------------------------------------------------------------------------

## 11. AI-Assisted Classification Requirements

The academic MVP uses a lightweight rule-based intelligent engine rather
than a trained ML model.

### Categories

1.  Network
2.  Hardware
3.  Software
4.  Access

### Network Keywords

``` text
wifi
internet
router
network
connection
vpn
```

### Hardware Keywords

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

### Software Keywords

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

### Access Keywords

``` text
password
login
account
permission
access
username
```

------------------------------------------------------------------------

## 12. Priority Logic

The MVP uses simple business rules.

### High

Examples: - Security-related incident - Major company-wide outage -
Critical service unavailable

### Medium

Examples: - Wi-Fi not working - Laptop not starting - Printer not
working - Important application problem

### Low

Examples: - Minor software request - Password/access request - General
information request

Priority rules should be clearly documented in the implementation so
that they can be replaced by an impact/urgency model later.

------------------------------------------------------------------------

## 13. Suggested Solution Engine

The system may provide a basic first-level troubleshooting suggestion.

### Network

Possible suggestions:

-   Check Wi-Fi connection
-   Restart Wi-Fi adapter
-   Restart router if appropriate
-   Test another device
-   Contact Network Support

### Hardware

Possible suggestions:

-   Check power/charger connection
-   Restart the device
-   Check external cables
-   Test with another compatible peripheral
-   Contact Hardware Support

### Software

Possible suggestions:

-   Restart application
-   Check for updates
-   Reinstall application if appropriate
-   Restart computer
-   Contact Software Support

### Access

Possible suggestions:

-   Verify username
-   Use password reset
-   Check account permissions
-   Contact administrator

The suggested solution is advisory; IT staff remains responsible for the
actual resolution.

------------------------------------------------------------------------

## 14. Database Requirements

The MVP uses four main tables.

### 14.1 users

  Field      Type      Description
  ---------- --------- ----------------------
  id         BIGINT    Primary key
  name       VARCHAR   User name
  email      VARCHAR   Login email
  password   VARCHAR   Password value
  role       VARCHAR   EMPLOYEE/STAFF/ADMIN

### 14.2 categories

  Field   Type      Description
  ------- --------- ---------------
  id      BIGINT    Primary key
  name    VARCHAR   Category name

### 14.3 tickets

  Field         Type       Description
  ------------- ---------- --------------------------
  id            BIGINT     Primary key
  ticket_id     VARCHAR    Public ticket number
  user_id       BIGINT     Employee reference
  title         VARCHAR    Problem title
  description   TEXT       Problem description
  category      VARCHAR    Ticket category
  priority      VARCHAR    Ticket priority
  status        VARCHAR    Ticket status
  assigned_to   BIGINT     Staff reference
  solution      TEXT       Suggested/final solution
  created_at    DATETIME   Creation time
  updated_at    DATETIME   Last update

### 14.4 ticket_messages

  Field        Type       Description
  ------------ ---------- ------------------
  id           BIGINT     Primary key
  ticket_id    BIGINT     Ticket reference
  sender_id    BIGINT     Message sender
  message      TEXT       Message
  created_at   DATETIME   Message time

------------------------------------------------------------------------

## 15. REST API Requirements

### Authentication

``` http
POST /api/login
```

### Tickets

``` http
POST /api/tickets
GET /api/tickets
GET /api/tickets/{id}
PUT /api/tickets/{id}
```

### AI

``` http
POST /api/analyze
```

### Messages

``` http
POST /api/tickets/{id}/messages
GET /api/tickets/{id}/messages
```

------------------------------------------------------------------------

## 16. Example AI API

### Request

``` json
{
  "description": "My wifi is connected but internet is not working"
}
```

### Response

``` json
{
  "category": "Network",
  "priority": "Medium",
  "solution": "Restart Wi-Fi adapter and check network connection"
}
```

------------------------------------------------------------------------

## 17. Frontend Pages

### 1. Login

User authentication.

### 2. Employee Dashboard

Ticket summary and recent tickets.

### 3. Create Ticket

Problem submission form.

### 4. My Tickets

Employee ticket list.

### 5. Ticket Details

Full ticket and message history.

### 6. Staff Dashboard

IT staff ticket management.

### 7. Staff Ticket Details

Assignment, status, messages and resolution.

### 8. Admin Dashboard

Statistics and reports.

------------------------------------------------------------------------

## 18. Frontend Folder Structure

``` text
frontend/
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

## 19. Backend Folder Structure

``` text
backend/
└── src/main/java/com/example/helpdesk/
    ├── controller/
    │   ├── AuthController.java
    │   ├── TicketController.java
    │   └── AIController.java
    │
    ├── service/
    │   ├── AuthService.java
    │   ├── TicketService.java
    │   └── AIService.java
    │
    ├── repository/
    │   ├── UserRepository.java
    │   ├── TicketRepository.java
    │   └── CategoryRepository.java
    │
    └── entity/
        ├── User.java
        ├── Ticket.java
        ├── Category.java
        └── TicketMessage.java
```

------------------------------------------------------------------------

## 20. Security Requirements

For the academic MVP:

-   Login is required for protected pages.
-   Users have roles.
-   Employees should only access their own tickets.
-   Staff access should be restricted according to role.
-   Admin functions should be restricted to admins.
-   Passwords should not be stored as plain text in a production-quality
    implementation.
-   Input validation should be performed on both frontend and backend.

For a stronger version, use Spring Security and password hashing.

------------------------------------------------------------------------

## 21. Non-Functional Requirements

### Performance

Normal dashboard and ticket operations should respond quickly in a local
development environment.

### Usability

The interface should be simple enough for an employee with basic
computer knowledge.

### Reliability

Ticket information should persist in MySQL.

### Maintainability

Backend code should be separated into:

-   Controller
-   Service
-   Repository
-   Entity

### Scalability

The design should allow additional categories, staff users and AI rules
to be added later.

### Compatibility

The web interface should work on modern browsers.

------------------------------------------------------------------------

## 22. Validation Requirements

Examples:

-   Empty email → validation error
-   Empty password → validation error
-   Empty ticket title → validation error
-   Empty description → validation error
-   Invalid login → error message
-   Unauthorized role → access denied
-   Invalid ticket ID → not found response

------------------------------------------------------------------------

## 23. Testing Requirements

### Functional Tests

  Test                    Expected Result
  ----------------------- ----------------------------
  Valid login             Dashboard opens
  Invalid login           Error shown
  Submit Wi-Fi problem    Network category
  Submit laptop issue     Hardware category
  Submit Chrome crash     Software category
  Submit password issue   Access category
  Create ticket           Ticket created
  Accept ticket           Status becomes IN_PROGRESS
  Resolve ticket          Status becomes RESOLVED
  Employee opens ticket   Resolution visible
  Admin opens dashboard   Statistics displayed

### AI Test Examples

  Input                                Expected Category   Expected Priority
  ------------------------------------ ------------------- -------------------
  Wi-Fi is not working                 Network             Medium
  Laptop screen is blank               Hardware            Medium
  Chrome keeps crashing                Software            Medium
  I forgot my password                 Access              Low
  Company network is completely down   Network             High

------------------------------------------------------------------------

## 24. Error Handling

The system should handle:

-   Database failure
-   Invalid request
-   Missing ticket
-   Invalid login
-   Unauthorized access
-   Empty input
-   Unexpected server error

The backend should return suitable HTTP status codes.

------------------------------------------------------------------------

## 25. Success Criteria

The project is considered successfully implemented when:

1.  All three roles can login.
2.  Employee can submit a problem.
3.  AI module returns category, priority and suggested solution.
4.  Ticket is created in MySQL.
5.  IT staff can view and update tickets.
6.  IT staff can add resolution.
7.  Employee can see ticket status and resolution.
8.  Admin can view basic statistics.
9.  Main API endpoints work through Postman.
10. End-to-end demo works without manual database modification.

------------------------------------------------------------------------

## 26. Team Responsibilities

### Member 1 --- Frontend

-   Login UI
-   Employee dashboard
-   Create ticket page
-   AI result screen
-   My tickets
-   Ticket details
-   CSS/responsive design
-   Frontend API integration

### Member 2 --- Backend + Database

-   Spring Boot project
-   MySQL database
-   Entities
-   Repositories
-   Services
-   REST APIs
-   Authentication
-   Ticket lifecycle

### Member 3 --- AI + Staff/Admin

-   AI classification
-   Priority logic
-   Solution recommendation
-   Staff dashboard
-   Admin dashboard
-   Statistics
-   Testing support

------------------------------------------------------------------------

## 27. Development Plan

### Phase 1 --- Planning

Define requirements, pages, database and roles.

### Phase 2 --- Database

Create MySQL database and tables.

### Phase 3 --- Backend

Create Spring Boot project and REST APIs.

### Phase 4 --- Authentication

Implement login and role-based navigation.

### Phase 5 --- Employee Module

Create ticket submission and ticket listing.

### Phase 6 --- AI Module

Implement classification, priority and solution logic.

### Phase 7 --- Staff Module

Implement ticket assignment, status and resolution.

### Phase 8 --- Admin Module

Implement statistics and reports.

### Phase 9 --- Integration

Connect frontend to backend.

### Phase 10 --- Testing

Test all workflows and edge cases.

### Phase 11 --- Documentation

Prepare report, screenshots, PPT and README.

------------------------------------------------------------------------

## 28. 15-Day Schedule

  Day   Work
  ----- ------------------------------
  1     Planning + UI design
  2     Database design
  3     Spring Boot setup
  4     Login
  5     Employee dashboard
  6     Create ticket
  7     Ticket APIs
  8     AI classification
  9     Priority + solution
  10    Staff dashboard
  11    Admin dashboard
  12    Frontend/backend integration
  13    Testing
  14    Bug fixing + UI
  15    Report + PPT + Demo

------------------------------------------------------------------------

## 29. Demo Scenario

Use this scenario for the final project demonstration:

1.  Employee logs in.
2.  Employee opens Create Ticket.
3.  Employee enters: "My laptop is connected to Wi-Fi but internet is
    not working."
4.  System analyzes the problem.
5.  System shows:
    -   Category: Network
    -   Priority: Medium
    -   Suggested Solution
6.  Employee creates ticket.
7.  Ticket number is generated, e.g. IT-001.
8.  Status is OPEN.
9.  IT staff logs in.
10. Staff accepts ticket.
11. Status changes to IN_PROGRESS.
12. Staff adds troubleshooting message.
13. Staff adds final resolution.
14. Status changes to RESOLVED.
15. Employee logs in and sees the resolution.
16. Admin opens dashboard and sees updated statistics.

------------------------------------------------------------------------

## 30. Future Scope

Possible future improvements:

-   Machine-learning based ticket classification
-   NLP/LLM troubleshooting assistant
-   Knowledge-base search
-   Automatic escalation
-   SLA monitoring
-   Email notifications
-   WhatsApp/Teams integration
-   Mobile application
-   Asset management
-   Device monitoring
-   Automatic duplicate-ticket detection
-   Multi-language support
-   Advanced analytics

------------------------------------------------------------------------

## 31. Important Academic Positioning

The first version should be described as:

> "An AI-assisted IT support system using intelligent rule-based ticket
> classification, priority recommendation and troubleshooting
> suggestions."

Do not claim that the MVP is a trained machine-learning model unless a
real ML model is actually trained, evaluated and integrated.

------------------------------------------------------------------------

## 32. Final Product Definition

The final product is a compact web-based IT helpdesk application that
demonstrates:

**Employee Problem → Intelligent Analysis → Ticket → IT Staff →
Resolution → Reporting**

It is intentionally designed as a manageable Diploma-level project while
still representing a realistic organizational problem and a complete
software development workflow.
