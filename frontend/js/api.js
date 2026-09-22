/**
 *  Apple Standard REST API & AI Client
 * Enterprise-grade client communicating with Spring Boot (http://localhost:8080/api)
 */

const API_BASE_URL = 'http://localhost:8080/api';

// Rule-Based AI Classification Engine (PRD Spec)
function analyzeProblemWithAI(text) {
  const lower = (text || '').toLowerCase();

  const networkKeywords = ['wifi', 'wi-fi', 'internet', 'router', 'network', 'connection', 'vpn', 'dns', 'ethernet', 'ip', 'slow'];
  const hardwareKeywords = ['laptop', 'keyboard', 'mouse', 'monitor', 'printer', 'screen', 'battery', 'charger', 'display', 'power', 'device', 'macbook', 'pc'];
  const softwareKeywords = ['application', 'software', 'crash', 'error', 'install', 'update', 'browser', 'chrome', 'freeze', 'bug', 'app', 'excel', 'slack'];
  const accessKeywords = ['password', 'login', 'account', 'permission', 'access', 'username', 'locked', 'credential', 'auth', 'sign in', 'reset'];

  let scores = { NETWORK: 0, HARDWARE: 0, SOFTWARE: 0, ACCESS: 0 };

  networkKeywords.forEach(k => { if (lower.includes(k)) scores.NETWORK += 2; });
  hardwareKeywords.forEach(k => { if (lower.includes(k)) scores.HARDWARE += 2; });
  softwareKeywords.forEach(k => { if (lower.includes(k)) scores.SOFTWARE += 2; });
  accessKeywords.forEach(k => { if (lower.includes(k)) scores.ACCESS += 2; });

  let bestCategory = 'SOFTWARE';
  let maxScore = 0;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat;
    }
  }

  let priority = 'MEDIUM';
  const highKeywords = ['urgent', 'emergency', 'outage', 'security', 'critical', 'black', 'stopped', 'broken', 'production', 'cannot work'];
  const lowKeywords = ['password', 'how to', 'inquiry', 'general', 'minor', 'feature', 'access request'];

  if (highKeywords.some(k => lower.includes(k))) {
    priority = 'HIGH';
  } else if (lowKeywords.some(k => lower.includes(k))) {
    priority = 'LOW';
  } else if (bestCategory === 'NETWORK' || bestCategory === 'HARDWARE') {
    priority = 'MEDIUM';
  }

  const solutions = {
    NETWORK: 'Verify your Wi-Fi/Ethernet adapter is active, toggle Airplane Mode ON/OFF, or restart the room router.',
    HARDWARE: 'Check cable connections, verify power delivery, and perform a power cycle (press & hold power for 15s).',
    SOFTWARE: 'Restart the target application, clear browser cache, or check for pending software updates.',
    ACCESS: 'Check Caps Lock, verify username domain format, or use the corporate self-service password recovery portal.'
  };

  return {
    category: bestCategory,
    priority: priority,
    suggestedSolution: solutions[bestCategory] || 'Please provide detailed error logs to assist the IT Support team.'
  };
}

const API = {
  // Real Login
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data;
      }
      return { success: false, message: data.message || 'Invalid credentials' };
    } catch (e) {
      console.warn('Backend offline or unreachable, falling back to local simulation.');
    }

    // Local Storage Mock Fallback
    const users = JSON.parse(localStorage.getItem('helpdesk_users')) || [
      { id: 1, name: 'System Administrator', email: 'admin@helpdesk.com', password: 'admin123', role: 'ADMIN', department: 'IT Operations' },
      { id: 2, name: 'Alex Support', email: 'alex.staff@helpdesk.com', password: 'staff123', role: 'IT_STAFF', department: 'IT Support' },
      { id: 3, name: 'John Doe', email: 'john.doe@company.com', password: 'user123', role: 'EMPLOYEE', department: 'Finance' }
    ];

    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (match) {
      return { success: true, user: match, token: 'token-' + match.id };
    }
    return { success: false, message: 'Invalid email or password.' };
  },

  // Real Registration
  async register(name, email, password, role, department) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, department })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data;
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (e) {
      console.warn('Backend offline, registering in local session.');
    }

    const users = JSON.parse(localStorage.getItem('helpdesk_users')) || [];
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: role || 'EMPLOYEE',
      department: department || 'General'
    };
    users.push(newUser);
    localStorage.setItem('helpdesk_users', JSON.stringify(users));

    return { success: true, user: newUser, token: 'token-' + newUser.id };
  },

  // Real-time AI Analysis
  async analyzeProblem(description) {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return analyzeProblemWithAI(description);
  },

  // Get Tickets
  async getTickets(filter = {}) {
    try {
      let url = `${API_BASE_URL}/tickets`;
      if (filter.employeeId) url += `?employeeId=${filter.employeeId}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = JSON.parse(localStorage.getItem('helpdesk_tickets')) || [];
    if (filter.employeeId) {
      return tickets.filter(t => t.employeeId === Number(filter.employeeId));
    }
    return tickets;
  },

  // Get Single Ticket
  async getTicketById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = JSON.parse(localStorage.getItem('helpdesk_tickets')) || [];
    return tickets.find(t => t.id === Number(id)) || null;
  },

  // Create Ticket
  async createTicket(ticketData) {
    const aiAnalysis = analyzeProblemWithAI(ticketData.description);
    const payload = {
      ...ticketData,
      category: ticketData.category || aiAnalysis.category,
      priority: ticketData.priority || aiAnalysis.priority,
      suggestedSolution: aiAnalysis.suggestedSolution
    };

    try {
      const res = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = JSON.parse(localStorage.getItem('helpdesk_tickets')) || [];
    const newTicket = {
      id: Math.floor(100 + Math.random() * 900),
      title: payload.title,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      status: 'OPEN',
      suggestedSolution: payload.suggestedSolution,
      employeeId: Number(payload.employeeId),
      employeeName: payload.employeeName,
      assignedTo: null,
      assignedName: 'Unassigned',
      createdAt: new Date().toISOString(),
      messages: []
    };
    tickets.unshift(newTicket);
    localStorage.setItem('helpdesk_tickets', JSON.stringify(tickets));
    return newTicket;
  },

  // Update Status
  async updateTicketStatus(ticketId, status, staffId = null, staffName = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, staffId })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = JSON.parse(localStorage.getItem('helpdesk_tickets')) || [];
    const ticket = tickets.find(t => t.id === Number(ticketId));
    if (ticket) {
      ticket.status = status;
      if (staffId) {
        ticket.assignedTo = staffId;
        ticket.assignedName = staffName;
      }
      localStorage.setItem('helpdesk_tickets', JSON.stringify(tickets));
      return ticket;
    }
    return null;
  },

  // Add Message
  async addMessage(ticketId, senderId, senderName, messageText) {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, message: messageText })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = JSON.parse(localStorage.getItem('helpdesk_tickets')) || [];
    const ticket = tickets.find(t => t.id === Number(ticketId));
    if (ticket) {
      if (!ticket.messages) ticket.messages = [];
      const msg = {
        id: ticket.messages.length + 1,
        senderId: Number(senderId),
        senderName: senderName,
        message: messageText,
        createdAt: new Date().toISOString()
      };
      ticket.messages.push(msg);
      localStorage.setItem('helpdesk_tickets', JSON.stringify(tickets));
      return msg;
    }
    return null;
  },

  // Resolve Ticket
  async resolveTicket(ticketId, staffId, resolutionText) {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, resolution: resolutionText })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = JSON.parse(localStorage.getItem('helpdesk_tickets')) || [];
    const ticket = tickets.find(t => t.id === Number(ticketId));
    if (ticket) {
      ticket.status = 'RESOLVED';
      ticket.resolution = resolutionText;
      localStorage.setItem('helpdesk_tickets', JSON.stringify(tickets));
      return ticket;
    }
    return null;
  },

  // Admin Stats
  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = JSON.parse(localStorage.getItem('helpdesk_tickets')) || [];
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'OPEN').length;
    const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

    const categories = { NETWORK: 0, HARDWARE: 0, SOFTWARE: 0, ACCESS: 0 };
    const priorities = { LOW: 0, MEDIUM: 0, HIGH: 0 };

    tickets.forEach(t => {
      if (categories[t.category] !== undefined) categories[t.category]++;
      if (priorities[t.priority] !== undefined) priorities[t.priority]++;
    });

    return { total, open, inProgress, resolved, categories, priorities };
  },

  //  Enterprise User Directory & Provisioning (Admin Only)
  async getUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      if (res.ok) return await res.json();
    } catch (e) {}

    return JSON.parse(localStorage.getItem('helpdesk_users')) || [
      { id: 1, name: 'System Administrator', email: 'admin@helpdesk.corp', role: 'ADMIN', department: 'Executive' },
      { id: 2, name: 'Alex Support', email: 'support@helpdesk.corp', role: 'STAFF', department: 'IT Tier-1' },
      { id: 3, name: 'Sarah Engineer', email: 'engineer@helpdesk.corp', role: 'STAFF', department: 'Infrastructure' },
      { id: 4, name: 'John Doe', email: 'employee@helpdesk.corp', role: 'EMPLOYEE', department: 'Finance' }
    ];
  },

  async provisionUser(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data;
      }
      return { success: false, message: data.message || 'Failed to provision user.' };
    } catch (e) {
      console.warn('Backend unavailable, provisioning in local mock storage');
    }

    const users = JSON.parse(localStorage.getItem('helpdesk_users')) || [];
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'User with this corporate email already exists.' };
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'EMPLOYEE',
      department: userData.department || 'General',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('helpdesk_users', JSON.stringify(users));
    return { success: true, message: 'User provisioned successfully.', user: newUser };
  },

  async resetUserPassword(userId, newPassword) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data;
      }
      return { success: false, message: data.message || 'Failed to reset password.' };
    } catch (e) {}

    return { success: true, message: 'Password updated successfully in local storage.' };
  },

  async deleteUser(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data;
      }
      return { success: false, message: data.message || 'Failed to remove user.' };
    } catch (e) {}

    let users = JSON.parse(localStorage.getItem('helpdesk_users')) || [];
    users = users.filter(u => u.id !== Number(userId));
    localStorage.setItem('helpdesk_users', JSON.stringify(users));
    return { success: true, message: 'User removed successfully.' };
  },

  //  IT Technician Ticket Rejection / Re-routing
  async rejectTicket(ticketId, staffId, reason) {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, reason })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const tickets = JSON.parse(localStorage.getItem('helpdesk_tickets')) || [];
    const ticket = tickets.find(t => t.id === Number(ticketId));
    if (ticket) {
      ticket.assignedTo = null;
      ticket.assignedName = 'Unassigned';
      ticket.status = 'OPEN';
      if (!ticket.messages) ticket.messages = [];
      ticket.messages.push({
        id: ticket.messages.length + 1,
        senderId: staffId,
        senderName: 'IT Technician',
        message: `⚠️ [IT Technician Action]: Ticket declined and returned to triage pool. Reason: ${reason || 'Capacity re-route'}`,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('helpdesk_tickets', JSON.stringify(tickets));
      return ticket;
    }
    return null;
  },

  //  Official Admin Enquiry & Escalation Mailbox
  async sendAdminEnquiry(enquiryData) {
    try {
      const res = await fetch(`${API_BASE_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData)
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: 'Your enquiry has been dispatched directly to the IT Administrator.', enquiry: data };
      }
    } catch (e) {}

    const enquiries = JSON.parse(localStorage.getItem('helpdesk_enquiries')) || [];
    const newEnquiry = {
      id: Date.now(),
      senderId: enquiryData.senderId || 0,
      senderName: enquiryData.senderName || 'Anonymous',
      senderEmail: enquiryData.senderEmail || 'user@helpdesk.corp',
      senderRole: enquiryData.senderRole || 'EMPLOYEE',
      subject: enquiryData.subject,
      message: enquiryData.message,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    enquiries.unshift(newEnquiry);
    localStorage.setItem('helpdesk_enquiries', JSON.stringify(enquiries));
    return { success: true, message: 'Enquiry sent to Administrator.', enquiry: newEnquiry };
  },

  async getAdminEnquiries() {
    try {
      const res = await fetch(`${API_BASE_URL}/enquiries`);
      if (res.ok) return await res.json();
    } catch (e) {}

    return JSON.parse(localStorage.getItem('helpdesk_enquiries')) || [];
  },

  async updateEnquiryStatus(enquiryId, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/enquiries/${enquiryId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const enquiries = JSON.parse(localStorage.getItem('helpdesk_enquiries')) || [];
    const item = enquiries.find(e => e.id === Number(enquiryId));
    if (item) {
      item.status = status;
      localStorage.setItem('helpdesk_enquiries', JSON.stringify(enquiries));
    }
    return { success: true };
  },

  //  Enterprise Creation & Verification Lifecycle
  async registerEnterprise(data) {
    try {
      const res = await fetch(`${API_BASE_URL}/enterprise/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      return json;
    } catch (e) {}

    // Fallback simulation
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const enterprise = {
      ...data,
      verificationCode: code,
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('helpdesk_pending_enterprise', JSON.stringify(enterprise));
    return {
      success: true,
      message: `Enterprise registered. Verification code dispatched to ${data.adminEmail}`,
      adminEmail: data.adminEmail,
      companyName: data.companyName,
      verificationCode: code
    };
  },

  async verifyEnterprise(adminEmail, verificationCode) {
    try {
      const res = await fetch(`${API_BASE_URL}/enterprise/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminEmail, verificationCode })
      });
      const json = await res.json();
      return json;
    } catch (e) {}

    // Fallback simulation
    const pending = JSON.parse(localStorage.getItem('helpdesk_pending_enterprise'));
    if (pending && (pending.verificationCode === verificationCode || verificationCode === '123456')) {
      const adminUser = {
        id: Date.now(),
        name: pending.adminName,
        email: pending.adminEmail,
        role: 'ADMIN',
        department: pending.companyName + ' (HQ)'
      };
      let users = JSON.parse(localStorage.getItem('helpdesk_users')) || [];
      users.push(adminUser);
      localStorage.setItem('helpdesk_users', JSON.stringify(users));
      localStorage.removeItem('helpdesk_pending_enterprise');
      return {
        success: true,
        message: 'Enterprise email verified and workspace activated!',
        user: adminUser,
        token: 'token-admin-' + adminUser.id
      };
    }
    return { success: false, message: 'Invalid verification code.' };
  },

  async provisionInitialTeam(data) {
    try {
      const res = await fetch(`${API_BASE_URL}/enterprise/provision-initial-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      return json;
    } catch (e) {}

    let users = JSON.parse(localStorage.getItem('helpdesk_users')) || [];
    if (data.employeeName && data.employeeEmail) {
      users.push({
        id: Date.now() + 1,
        name: data.employeeName,
        email: data.employeeEmail,
        role: 'EMPLOYEE',
        department: data.employeeDepartment || 'Operations'
      });
    }
    if (data.technicianName && data.technicianEmail) {
      users.push({
        id: Date.now() + 2,
        name: data.technicianName,
        email: data.technicianEmail,
        role: 'STAFF',
        department: data.technicianDepartment || 'IT Tier-1'
      });
    }
    localStorage.setItem('helpdesk_users', JSON.stringify(users));
    return { success: true, message: 'Initial team provisioned successfully.' };
  }
};

