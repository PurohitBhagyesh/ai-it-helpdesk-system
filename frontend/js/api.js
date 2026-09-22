/**
 * API Client & Intelligent Client-Side Fallback Engine
 * Communicates with Spring Boot backend (http://localhost:8080/api)
 * Includes client-side AI simulation if backend is offline.
 */

const API_BASE_URL = 'http://localhost:8080/api';

// Initial Mock Seed Data for offline/demo mode
const DEFAULT_MOCK_DATA = {
  users: [
    { id: 1, name: 'System Admin', email: 'admin@helpdesk.com', role: 'ADMIN', department: 'IT Ops' },
    { id: 2, name: 'Alex Support', email: 'alex.staff@helpdesk.com', role: 'IT_STAFF', department: 'IT Support' },
    { id: 3, name: 'Sarah Engineer', email: 'sarah.staff@helpdesk.com', role: 'IT_STAFF', department: 'Network' },
    { id: 4, name: 'John Doe', email: 'john.doe@company.com', role: 'EMPLOYEE', department: 'Finance' },
    { id: 5, name: 'Emily Davis', email: 'emily.davis@company.com', role: 'EMPLOYEE', department: 'Marketing' }
  ],
  tickets: [
    {
      id: 101,
      title: 'Wi-Fi disconnects frequently in Conference Room B',
      description: 'My laptop keeps dropping the office Wi-Fi network connection whenever I move to meeting room 2B.',
      category: 'NETWORK',
      priority: 'MEDIUM',
      status: 'OPEN',
      suggestedSolution: 'Restart Wi-Fi adapter, verify router signal in Room 2B, or check network connection.',
      employeeId: 4,
      employeeName: 'John Doe',
      assignedTo: null,
      assignedName: 'Unassigned',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      messages: []
    },
    {
      id: 102,
      title: 'Laptop screen remains black on startup',
      description: 'Pressing power button turns on keyboard backlight but monitor screen stays completely dark.',
      category: 'HARDWARE',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      suggestedSolution: 'Check power adapter cable, perform hard reset by holding power for 15s, or connect to external monitor.',
      employeeId: 5,
      employeeName: 'Emily Davis',
      assignedTo: 2,
      assignedName: 'Alex Support',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      messages: [
        { id: 1, senderId: 5, senderName: 'Emily Davis', message: 'I tried holding the power button for 15 seconds, but the display is still blank.', createdAt: new Date(Date.now() - 3600000 * 10).toISOString() },
        { id: 2, senderId: 2, senderName: 'Alex Support', message: 'Thanks Emily. I will bring an external HDMI monitor to your desk to check the display card.', createdAt: new Date(Date.now() - 3600000 * 8).toISOString() }
      ]
    },
    {
      id: 103,
      title: 'Forgot company intranet password',
      description: 'I got locked out of my corporate portal account after 3 failed login attempts.',
      category: 'ACCESS',
      priority: 'LOW',
      status: 'RESOLVED',
      suggestedSolution: 'Verify username, use self-service password reset, or contact domain administrator.',
      employeeId: 4,
      employeeName: 'John Doe',
      assignedTo: 3,
      assignedName: 'Sarah Engineer',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      resolution: 'User identity verified and account password reset link sent via corporate SMS.',
      messages: []
    }
  ]
};

// Initialize LocalStorage Mock DB if empty
if (!localStorage.getItem('helpdesk_mock_db')) {
  localStorage.setItem('helpdesk_mock_db', JSON.stringify(DEFAULT_MOCK_DATA));
}

function getMockDB() {
  return JSON.parse(localStorage.getItem('helpdesk_mock_db')) || DEFAULT_MOCK_DATA;
}

function saveMockDB(data) {
  localStorage.setItem('helpdesk_mock_db', JSON.stringify(data));
}

/**
 * Pure Rule-Based AI Classification Engine (PRD Compliant)
 */
function analyzeProblemWithAI(text) {
  const lower = (text || '').toLowerCase();

  // Category Keywords
  const networkKeywords = ['wifi', 'wi-fi', 'internet', 'router', 'network', 'connection', 'vpn', 'dns', 'ethernet', 'ip'];
  const hardwareKeywords = ['laptop', 'keyboard', 'mouse', 'monitor', 'printer', 'screen', 'battery', 'charger', 'display', 'power', 'device'];
  const softwareKeywords = ['application', 'software', 'crash', 'error', 'install', 'update', 'browser', 'chrome', 'freeze', 'bug', 'app', 'windows', 'excel'];
  const accessKeywords = ['password', 'login', 'account', 'permission', 'access', 'username', 'locked', 'credential', 'auth', 'sign in'];

  let scores = {
    NETWORK: 0,
    HARDWARE: 0,
    SOFTWARE: 0,
    ACCESS: 0
  };

  networkKeywords.forEach(k => { if (lower.includes(k)) scores.NETWORK += 2; });
  hardwareKeywords.forEach(k => { if (lower.includes(k)) scores.HARDWARE += 2; });
  softwareKeywords.forEach(k => { if (lower.includes(k)) scores.SOFTWARE += 2; });
  accessKeywords.forEach(k => { if (lower.includes(k)) scores.ACCESS += 2; });

  let bestCategory = 'SOFTWARE'; // default
  let maxScore = 0;
  for (const [cat, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat;
    }
  }

  // Priority Prediction
  let priority = 'MEDIUM';
  const highPriorityKeywords = ['urgent', 'emergency', 'outage', 'security', 'critical', 'black', 'stopped', 'broken', 'danger', 'cannot work', 'production'];
  const lowPriorityKeywords = ['password', 'how to', 'inquiry', 'general', 'minor', 'feature', 'access request'];

  if (highPriorityKeywords.some(k => lower.includes(k))) {
    priority = 'HIGH';
  } else if (lowPriorityKeywords.some(k => lower.includes(k))) {
    priority = 'LOW';
  } else if (bestCategory === 'NETWORK' || bestCategory === 'HARDWARE') {
    priority = 'MEDIUM';
  }

  // Solution Advisor
  const solutions = {
    NETWORK: 'Verify your Wi-Fi/Ethernet adapter is active, try turning airplane mode ON and OFF, or restart your local router.',
    HARDWARE: 'Check physical cable connections, ensure the charger/power supply is working, and try power-cycling the device (press & hold power for 15s).',
    SOFTWARE: 'Close and restart the affected application, verify if pending OS/software updates are available, or try clearing browser cache.',
    ACCESS: 'Check Caps Lock, verify your employee ID/domain, or use the self-service IT password recovery portal.'
  };

  return {
    category: bestCategory,
    priority: priority,
    suggestedSolution: solutions[bestCategory] || 'Please provide detailed error messages to assist IT Support.'
  };
}

// Unified API Client Object
const API = {
  // Auth API
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, using mock authentication.');
    }

    // Fallback Mock Login
    const db = getMockDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      return { success: true, user: user, token: 'mock-jwt-token' };
    }
    // Generic fallback for any email
    return {
      success: true,
      user: { id: 99, name: email.split('@')[0], email, role: 'EMPLOYEE', department: 'General' },
      token: 'mock-jwt-token'
    };
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
    } catch (e) {
      // Offline AI engine
    }
    return analyzeProblemWithAI(description);
  },

  // Get Tickets
  async getTickets(filter = {}) {
    try {
      let url = `${API_BASE_URL}/tickets`;
      if (filter.employeeId) url += `?employeeId=${filter.employeeId}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, reading from mock database.');
    }

    const db = getMockDB();
    let tickets = db.tickets;
    if (filter.employeeId) {
      tickets = tickets.filter(t => t.employeeId === Number(filter.employeeId));
    }
    return tickets;
  },

  // Get Single Ticket Details
  async getTicketById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend offline, reading ticket from mock DB.');
    }

    const db = getMockDB();
    return db.tickets.find(t => t.id === Number(id)) || null;
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
    } catch (e) {
      console.warn('Backend offline, saving to mock database.');
    }

    const db = getMockDB();
    const newTicket = {
      id: Math.floor(100 + Math.random() * 900),
      title: payload.title,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
      status: 'OPEN',
      suggestedSolution: payload.suggestedSolution,
      employeeId: Number(payload.employeeId) || 4,
      employeeName: payload.employeeName || 'John Doe',
      assignedTo: null,
      assignedName: 'Unassigned',
      createdAt: new Date().toISOString(),
      messages: []
    };

    db.tickets.unshift(newTicket);
    saveMockDB(db);
    return newTicket;
  },

  // Update Status / Assign Ticket
  async updateTicketStatus(ticketId, status, staffId = null, staffName = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, staffId })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getMockDB();
    const ticket = db.tickets.find(t => t.id === Number(ticketId));
    if (ticket) {
      ticket.status = status;
      if (staffId) {
        ticket.assignedTo = staffId;
        ticket.assignedName = staffName || 'IT Support';
      }
      saveMockDB(db);
      return ticket;
    }
    return null;
  },

  // Add Message to Ticket
  async addMessage(ticketId, senderId, senderName, messageText) {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, message: messageText })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getMockDB();
    const ticket = db.tickets.find(t => t.id === Number(ticketId));
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
      saveMockDB(db);
      return msg;
    }
    return null;
  },

  // Add Resolution & Mark Resolved
  async resolveTicket(ticketId, staffId, resolutionText) {
    try {
      const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, resolution: resolutionText })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getMockDB();
    const ticket = db.tickets.find(t => t.id === Number(ticketId));
    if (ticket) {
      ticket.status = 'RESOLVED';
      ticket.resolution = resolutionText;
      saveMockDB(db);
      return ticket;
    }
    return null;
  },

  // Get Admin Statistics
  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getMockDB();
    const total = db.tickets.length;
    const open = db.tickets.filter(t => t.status === 'OPEN').length;
    const inProgress = db.tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolved = db.tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

    const categories = { NETWORK: 0, HARDWARE: 0, SOFTWARE: 0, ACCESS: 0 };
    const priorities = { LOW: 0, MEDIUM: 0, HIGH: 0 };

    db.tickets.forEach(t => {
      if (categories[t.category] !== undefined) categories[t.category]++;
      if (priorities[t.priority] !== undefined) priorities[t.priority]++;
    });

    return {
      total,
      open,
      inProgress,
      resolved,
      categories,
      priorities
    };
  }
};
