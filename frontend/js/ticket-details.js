/**
 * Ticket Details & Messaging Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  const user = Auth.requireAuth();
  if (!user) return;

  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get('id');

  if (!ticketId) {
    alert('No Ticket ID specified.');
    window.history.back();
    return;
  }

  // DOM Elements
  const ticketIdEl = document.getElementById('ticket-id-display');
  const ticketTitleEl = document.getElementById('ticket-title');
  const ticketDescEl = document.getElementById('ticket-description');
  const ticketCategoryEl = document.getElementById('ticket-category');
  const ticketPriorityEl = document.getElementById('ticket-priority');
  const ticketStatusEl = document.getElementById('ticket-status');
  const ticketEmployeeEl = document.getElementById('ticket-employee');
  const ticketAssigneeEl = document.getElementById('ticket-assignee');
  const ticketDateEl = document.getElementById('ticket-date');
  const ticketSolutionEl = document.getElementById('ticket-solution');

  const chatContainer = document.getElementById('chat-messages');
  const messageForm = document.getElementById('send-message-form');
  const messageInput = document.getElementById('message-input');

  const resolutionSection = document.getElementById('resolution-section');
  const resolutionForm = document.getElementById('resolution-form');
  const resolutionText = document.getElementById('resolution-text');
  const resolutionDisplay = document.getElementById('resolution-display');
  const resolutionContent = document.getElementById('resolution-content');

  // Status Action Controls for Staff
  const staffActionControls = document.getElementById('staff-action-controls');
  const statusSelect = document.getElementById('status-select');
  const updateStatusBtn = document.getElementById('update-status-btn');

  async function loadTicketData() {
    const ticket = await API.getTicketById(ticketId);
    if (!ticket) {
      alert(`Ticket #${ticketId} not found.`);
      window.history.back();
      return;
    }

    ticketIdEl.textContent = `#${ticket.id}`;
    ticketTitleEl.textContent = ticket.title;
    ticketDescEl.textContent = ticket.description;
    ticketCategoryEl.textContent = ticket.category;
    
    ticketPriorityEl.textContent = ticket.priority;
    ticketPriorityEl.className = 'badge priority-' + ticket.priority.toLowerCase();

    ticketStatusEl.textContent = ticket.status.replace('_', ' ');
    ticketStatusEl.className = 'badge badge-' + ticket.status.toLowerCase().replace('_', '');

    ticketEmployeeEl.textContent = ticket.employeeName || `Employee #${ticket.employeeId}`;
    ticketAssigneeEl.textContent = ticket.assignedName || 'Unassigned';
    ticketDateEl.textContent = new Date(ticket.createdAt).toLocaleString();
    ticketSolutionEl.textContent = ticket.suggestedSolution || 'No automated solution available.';

    // Staff actions display
    if (user.role === 'IT_STAFF' || user.role === 'ADMIN') {
      if (staffActionControls) {
        staffActionControls.style.display = 'block';
        if (statusSelect) statusSelect.value = ticket.status;
      }
      if (resolutionSection && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED') {
        resolutionSection.style.display = 'block';
      }
    }

    // Show final resolution if resolved
    if (ticket.resolution) {
      resolutionDisplay.style.display = 'block';
      resolutionContent.textContent = ticket.resolution;
      if (resolutionSection) resolutionSection.style.display = 'none';
    } else {
      resolutionDisplay.style.display = 'none';
    }

    // Render Messages
    renderMessages(ticket.messages || []);
  }

  function renderMessages(messages) {
    if (messages.length === 0) {
      chatContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 1rem;">No messages exchanged yet. Send a message below to communicate.</p>`;
      return;
    }

    chatContainer.innerHTML = messages.map(msg => {
      const isMe = msg.senderId === user.id;
      return `
        <div class="chat-bubble ${isMe ? 'sent' : 'received'}">
          <div class="chat-meta">
            <strong>${escapeHtml(msg.senderName || 'User')}</strong>
            <span>${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div>${escapeHtml(msg.message)}</div>
        </div>
      `;
    }).join('');

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Send Message Event
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    messageInput.value = '';
    await API.addMessage(ticketId, user.id, user.name, text);
    await loadTicketData();
  });

  // Submit Resolution Event
  if (resolutionForm) {
    resolutionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = resolutionText.value.trim();
      if (!text) {
        alert('Please enter a resolution note before resolving.');
        return;
      }

      await API.resolveTicket(ticketId, user.id, text);
      alert('Ticket has been marked as RESOLVED and resolution report added.');
      await loadTicketData();
    });
  }

  // Update Status Event
  if (updateStatusBtn) {
    updateStatusBtn.addEventListener('click', async () => {
      const newStatus = statusSelect.value;
      await API.updateTicketStatus(ticketId, newStatus, user.id, user.name);
      alert(`Ticket status updated to ${newStatus}.`);
      await loadTicketData();
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  await loadTicketData();
});
