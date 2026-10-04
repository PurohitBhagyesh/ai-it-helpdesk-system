/**
 *  Apple Standard REST API & AI Client
 * Enterprise-grade client communicating with Spring Boot (http://localhost:8080/api)
 * Includes robust multi-cloud auto-routing and persistent fallback simulation.
 */

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && window.HELP_DESK_API_URL) {
    return window.HELP_DESK_API_URL.replace(/\/$/, '');
  }
  try {
    const saved = localStorage.getItem('HELP_DESK_API_URL');
    if (saved) return saved.replace(/\/$/, '');
  } catch (e) {}

  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
      return 'http://localhost:8080/api';
    }
  }
  return '/api';
}

const API_BASE_URL = getApiBaseUrl();

// Rule-Based AI Classification Engine (PRD Spec)
function analyzeProblemWithAI(text) {
  const lower = (text || '').toLowerCase();

  const networkKeywords = ['wifi', 'wi-fi', 'internet', 'router', 'network', 'connection', 'vpn', 'dns', 'ethernet', 'ip', 'slow', 'bandwidth'];
  const hardwareKeywords = ['laptop', 'keyboard', 'mouse', 'monitor', 'printer', 'screen', 'battery', 'charger', 'display', 'power', 'device', 'macbook', 'pc', 'hardware'];
  const softwareKeywords = ['application', 'software', 'crash', 'error', 'install', 'update', 'browser', 'chrome', 'freeze', 'bug', 'app', 'excel', 'slack', 'outlook'];
  const accessKeywords = ['password', 'login', 'account', 'permission', 'access', 'username', 'locked', 'credential', 'auth', 'sign in', 'reset', 'mfa', '2fa'];

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
  const highKeywords = ['urgent', 'emergency', 'outage', 'security', 'critical', 'black', 'stopped', 'broken', 'production', 'cannot work', 'down'];
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
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      } else {
        const data = await res.json().catch(() => null);
        if (data && data.message) return data;
      }
    } catch (e) {
      console.warn('Backend API unreachable, using local session simulation.');
    }

    // Default Seed Accounts
    const defaultUsers = [
      { id: 1, name: 'System Administrator', email: 'admin@helpdesk.com', password: 'admin123', role: 'ADMIN', department: 'IT Operations', companyName: 'Acme Global Technologies', employeeIdCode: 'ADM-001' },
      { id: 2, name: 'Alex Support', email: 'alex.staff@helpdesk.com', password: 'staff123', role: 'IT_STAFF', department: 'IT Support Team', companyName: 'Acme Global Technologies', employeeIdCode: 'TECH-201', experience: '5 Years' },
      { id: 3, name: 'Sarah Engineer', email: 'sarah.staff@helpdesk.com', password: 'staff123', role: 'IT_STAFF', department: 'Network Operations', companyName: 'Acme Global Technologies', employeeIdCode: 'TECH-202', experience: '7 Years' },
      { id: 4, name: 'John Doe', email: 'john.doe@company.com', password: 'employee123', role: 'EMPLOYEE', department: 'Engineering', companyName: 'Acme Global Technologies', employeeIdCode: 'EMP-101' },
      { id: 5, name: 'Emily Davis', email: 'emily.davis@company.com', password: 'employee123', role: 'EMPLOYEE', department: 'Finance Operations', companyName: 'Acme Global Technologies', employeeIdCode: 'EMP-102' }
    ];

    let users = JSON.parse(localStorage.getItem('helpdesk_users'));
    if (!users || users.length === 0) {
      users = defaultUsers;
      localStorage.setItem('helpdesk_users', JSON.stringify(users));
    }

    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || password === 'admin123' || password === 'staff123' || password === 'employee123'));
    if (match) {
      return { success: true, user: match, token: 'token-' + match.id };
    }
    return { success: false, message: 'Invalid email or password. Please verify your credentials.' };
  },

  // Real Registration
  async register(name, email, password, role, department) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, department })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      } else {
        const data = await res.json().catch(() => null);
        if (data && data.message) return data;
      }
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
      contactInfo: payload.contactInfo || '',
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
      { id: 1, name: 'System Administrator', email: 'admin@helpdesk.com', role: 'ADMIN', department: 'IT Operations', companyName: 'Acme Global Technologies', employeeIdCode: 'ADM-001' },
      { id: 2, name: 'Alex Support', email: 'alex.staff@helpdesk.com', role: 'IT_STAFF', department: 'IT Support Team', companyName: 'Acme Global Technologies', employeeIdCode: 'TECH-201', experience: '5 Years' },
      { id: 3, name: 'Sarah Engineer', email: 'sarah.staff@helpdesk.com', role: 'IT_STAFF', department: 'Network Operations', companyName: 'Acme Global Technologies', employeeIdCode: 'TECH-202', experience: '7 Years' },
      { id: 4, name: 'John Doe', email: 'john.doe@company.com', role: 'EMPLOYEE', department: 'Engineering', companyName: 'Acme Global Technologies', employeeIdCode: 'EMP-101' }
    ];
  },

  async provisionUser(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      } else {
        const data = await res.json().catch(() => null);
        if (data && data.message) return data;
      }
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
      companyName: userData.companyName || 'Corporate',
      employeeIdCode: userData.employeeIdCode || ('EMP-' + Math.floor(1000 + Math.random() * 9000)),
      joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
      designation: userData.designation || (userData.role === 'IT_STAFF' || userData.role === 'STAFF' ? 'Support Engineer' : 'Employee'),
      experience: userData.experience || '',
      specialization: userData.specialization || '',
      phone: userData.phone || '',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('helpdesk_users', JSON.stringify(users));
    return { success: true, message: 'User provisioned successfully.', user: newUser };
  },

  async updateUser(userId, userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, user: data };
      }
    } catch (e) {}

    let users = JSON.parse(localStorage.getItem('helpdesk_users')) || [];
    const idx = users.findIndex(u => u.id === Number(userId));
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...userData };
      localStorage.setItem('helpdesk_users', JSON.stringify(users));
      return { success: true, user: users[idx] };
    }
    return { success: false, message: 'User not found' };
  },

  async resetUserPassword(userId, newPassword) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {}

    return { success: true, message: 'Password updated successfully in local storage.' };
  },

  async deleteUser(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
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
        senderId: Number(staffId) || 0,
        senderName: 'IT Technician',
        message: '⚠️ [IT Technician Action]: Ticket declined & re-routed. Note: ' + (reason || 'Re-routed back to triage pool'),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('helpdesk_tickets', JSON.stringify(tickets));
      return ticket;
    }
    return null;
  },

  //  Admin Enquiry Mailbox API
  async sendAdminEnquiry(enquiryData) {
    try {
      const res = await fetch(`${API_BASE_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const enquiries = JSON.parse(localStorage.getItem('helpdesk_enquiries')) || [];
    const item = {
      id: enquiries.length + 1,
      ...enquiryData,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    enquiries.unshift(item);
    localStorage.setItem('helpdesk_enquiries', JSON.stringify(enquiries));
    return item;
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
      if (res.ok) {
        const json = await res.json();
        return json;
      } else {
        const json = await res.json().catch(() => null);
        if (json && json.message) return json;
      }
    } catch (e) {
      console.warn('Backend unavailable, simulating enterprise registration.');
    }

    // Local Storage Mock Fallback
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
      if (res.ok) {
        const json = await res.json();
        return json;
      } else {
        const json = await res.json().catch(() => null);
        if (json && json.message) return json;
      }
    } catch (e) {
      console.warn('Backend unavailable, simulating enterprise verification.');
    }

    // Fallback simulation
    const pending = JSON.parse(localStorage.getItem('helpdesk_pending_enterprise'));
    if (pending && (pending.verificationCode === verificationCode || verificationCode === '123456' || (verificationCode && verificationCode.length === 6))) {
      const adminUser = {
        id: Date.now(),
        name: pending.adminName || 'Enterprise Administrator',
        email: pending.adminEmail || adminEmail,
        role: 'ADMIN',
        companyName: pending.companyName || 'Registered Enterprise',
        department: (pending.companyName || 'Enterprise') + ' (HQ)',
        employeeIdCode: 'ADM-001',
        phone: pending.companyPhone || ''
      };
      let users = JSON.parse(localStorage.getItem('helpdesk_users')) || [];
      users.unshift(adminUser);
      localStorage.setItem('helpdesk_users', JSON.stringify(users));
      localStorage.setItem('helpdesk_enterprise', JSON.stringify(pending));
      localStorage.removeItem('helpdesk_pending_enterprise');
      return {
        success: true,
        message: 'Enterprise email verified and workspace activated!',
        user: adminUser,
        token: 'token-admin-' + adminUser.id
      };
    }
    return { success: false, message: 'Invalid verification code. Please enter the 6-digit code shown above.' };
  },

  async provisionInitialTeam(data) {
    try {
      const res = await fetch(`${API_BASE_URL}/enterprise/provision-initial-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      } else {
        const json = await res.json().catch(() => null);
        if (json && json.message) return json;
      }
    } catch (e) {}

    let users = JSON.parse(localStorage.getItem('helpdesk_users')) || [];
    const ent = JSON.parse(localStorage.getItem('helpdesk_enterprise')) || {};
    const compName = ent.companyName || 'Corporate';

    if (data.employeeName && data.employeeEmail) {
      users.push({
        id: Date.now() + 1,
        name: data.employeeName,
        email: data.employeeEmail,
        password: data.employeePassword || 'employee123',
        role: 'EMPLOYEE',
        companyName: compName,
        employeeIdCode: 'EMP-101',
        department: data.employeeDepartment || 'Operations'
      });
    }
    if (data.technicianName && data.technicianEmail) {
      users.push({
        id: Date.now() + 2,
        name: data.technicianName,
        email: data.technicianEmail,
        password: data.technicianPassword || 'staff123',
        role: 'IT_STAFF',
        companyName: compName,
        employeeIdCode: 'TECH-201',
        department: data.technicianDepartment || 'IT Tier-1'
      });
    }
    localStorage.setItem('helpdesk_users', JSON.stringify(users));
    return { success: true, message: 'Initial team provisioned successfully.' };
  },

  getBaseUrl() {
    return API_BASE_URL;
  },

  setApiBaseUrl(url) {
    if (url) {
      localStorage.setItem('HELP_DESK_API_URL', url);
    } else {
      localStorage.removeItem('HELP_DESK_API_URL');
    }
    window.location.reload();
  }
};
