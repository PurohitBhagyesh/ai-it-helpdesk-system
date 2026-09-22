// Modal Controls for Contacting Admin
function openContactAdminModal() {
  const modal = document.getElementById('contact-admin-modal');
  if (modal) modal.classList.add('active');
}

function closeContactAdminModal() {
  const modal = document.getElementById('contact-admin-modal');
  if (modal) modal.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = Auth.requireAuth();
  if (!user) return;

  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = urlParams.get('id');

  if (!ticketId) {
    alert('No Incident ID specified.');
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
  const ticketContactEl = document.getElementById('ticket-contact');
  const ticketAssigneeEl = document.getElementById('ticket-assignee');
  const ticketDateEl = document.getElementById('ticket-date');
  const ticketSolutionEl = document.getElementById('ticket-solution');
  const ticketAlert = document.getElementById('ticket-alert');

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

  function showTicketAlert(msg, isSuccess = true) {
    if (!ticketAlert) return;
    ticketAlert.style.display = 'block';
    ticketAlert.textContent = msg;
    ticketAlert.style.background = isSuccess ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 69, 58, 0.15)';
    ticketAlert.style.border = isSuccess ? '1px solid rgba(48, 209, 88, 0.35)' : '1px solid rgba(255, 69, 58, 0.35)';
    ticketAlert.style.color = isSuccess ? '#30d158' : '#ff453a';

    setTimeout(() => {
      ticketAlert.style.display = 'none';
    }, 4500);
  }

  async function loadTicketData() {
    const ticket = await API.getTicketById(ticketId);
    if (!ticket) {
      alert(`Incident #${ticketId} not found.`);
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
    if (ticketContactEl) {
      ticketContactEl.textContent = ticket.contactInfo || 'Not specified';
    }
    ticketAssigneeEl.textContent = ticket.assignedName || 'Unassigned (In Triage Queue)';
    ticketDateEl.textContent = new Date(ticket.createdAt).toLocaleString();
    ticketSolutionEl.textContent = ticket.suggestedSolution || 'No automated solution available.';

    // Staff actions display
    if (user.role === 'STAFF' || user.role === 'IT_STAFF' || user.role === 'ADMIN') {
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
      chatContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 1.5rem;">
          <div style="font-size: 1.2rem; margin-bottom: 0.35rem;">🔒</div>
          <strong style="color: #fff; font-size: 0.875rem;">End-to-End Encrypted Communication</strong>
          <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">Direct cryptographic channel established between Employee and IT Technician. No messages yet.</p>
        </div>
      `;
      return;
    }

    chatContainer.innerHTML = messages.map(msg => {
      const isMe = msg.senderId === user.id;
      const isSystem = msg.message && msg.message.startsWith('⚠️ [IT Technician');

      if (isSystem) {
        return `
          <div style="padding: 0.65rem 1rem; background: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: var(--radius-sm); font-size: 0.825rem; color: #fbbf24; margin: 0.5rem 0;">
            ${escapeHtml(msg.message)}
          </div>
        `;
      }

      return `
        <div class="chat-bubble ${isMe ? 'sent' : 'received'}">
          <div class="chat-meta">
            <strong>${escapeHtml(msg.senderName || 'User')}</strong>
            <span style="display: inline-flex; align-items: center; gap: 0.25rem;">
              <span>🔒</span>
              ${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
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
      showTicketAlert('Incident marked as RESOLVED and technical report archived.');
      await loadTicketData();
    });
  }

  // Update Status Event
  if (updateStatusBtn) {
    updateStatusBtn.addEventListener('click', async () => {
      const newStatus = statusSelect.value;
      await API.updateTicketStatus(ticketId, newStatus, user.id, user.name);
      showTicketAlert(`Incident status updated to ${newStatus}.`);
      await loadTicketData();
    });
  }

  // Handle Contact Admin Form Submission
  const contactAdminForm = document.getElementById('contact-admin-form');
  if (contactAdminForm) {
    contactAdminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const subject = document.getElementById('enquiry-subject').value.trim();
      const message = document.getElementById('enquiry-message').value.trim();
      const btn = document.getElementById('enquiry-submit-btn');

      btn.disabled = true;
      btn.textContent = 'Dispatching...';

      await API.sendAdminEnquiry({
        senderId: user.id,
        senderName: user.name,
        senderEmail: user.email,
        senderRole: user.role,
        employeeIdCode: user.employeeIdCode || '',
        subject: `[Incident #${ticketId}] ${subject}`,
        message
      });

      btn.disabled = false;
      btn.textContent = 'Dispatch to Admin';

      closeContactAdminModal();
      contactAdminForm.reset();
      showTicketAlert('Message sent to Admin. Please wait for an administrator response.', true);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  await loadTicketData();
});
