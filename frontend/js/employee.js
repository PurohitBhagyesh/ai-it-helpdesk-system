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
  const user = Auth.requireAuth(['EMPLOYEE', 'ADMIN']);
  if (!user) return;

  const problemTitleInput = document.getElementById('problem-title');
  const problemDescInput = document.getElementById('problem-desc');
  const submitTicketForm = document.getElementById('create-ticket-form');
  const ticketsTableBody = document.getElementById('my-tickets-tbody');
  const emptyState = document.getElementById('empty-state');
  const employeeAlert = document.getElementById('employee-alert');

  // AI Diagnostic Preview Elements
  const aiCategoryEl = document.getElementById('ai-category');
  const aiPriorityEl = document.getElementById('ai-priority');
  const aiSolutionEl = document.getElementById('ai-solution');

  // Stat Counters
  const totalCountEl = document.getElementById('stat-total');
  const openCountEl = document.getElementById('stat-open');
  const progressCountEl = document.getElementById('stat-progress');
  const resolvedCountEl = document.getElementById('stat-resolved');

  function showEmployeeAlert(msg, isSuccess = true) {
    if (!employeeAlert) return;
    employeeAlert.style.display = 'block';
    employeeAlert.textContent = msg;
    employeeAlert.style.background = isSuccess ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 69, 58, 0.15)';
    employeeAlert.style.border = isSuccess ? '1px solid rgba(48, 209, 88, 0.35)' : '1px solid rgba(255, 69, 58, 0.35)';
    employeeAlert.style.color = isSuccess ? '#30d158' : '#ff453a';

    setTimeout(() => {
      employeeAlert.style.display = 'none';
    }, 4500);
  }

  // Real-time AI preview as employee types description
  let typingTimer;
  problemDescInput.addEventListener('input', () => {
    clearTimeout(typingTimer);
    const text = problemDescInput.value.trim();

    if (text.length < 5) {
      aiCategoryEl.textContent = 'Ready';
      aiPriorityEl.textContent = 'Auto';
      aiSolutionEl.textContent = 'Type a description of your issue on the left to see live AI problem categorization and immediate troubleshooting instructions.';
      return;
    }

    typingTimer = setTimeout(async () => {
      const analysis = await API.analyzeProblem(text);
      aiCategoryEl.textContent = analysis.category;
      aiPriorityEl.textContent = analysis.priority;
      aiSolutionEl.textContent = analysis.suggestedSolution;

      // Update badge styling
      aiPriorityEl.className = 'ai-chip ' + (analysis.priority === 'HIGH' ? 'priority-high' : analysis.priority === 'MEDIUM' ? 'priority-medium' : 'priority-low');
    }, 250);
  });

  // Load and render user tickets
  async function loadMyTickets() {
    const tickets = await API.getTickets({ employeeId: user.id });

    // Update Counters
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'OPEN').length;
    const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolved = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

    totalCountEl.textContent = total;
    openCountEl.textContent = open;
    progressCountEl.textContent = inProgress;
    resolvedCountEl.textContent = resolved;

    if (tickets.length === 0) {
      ticketsTableBody.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    ticketsTableBody.innerHTML = tickets.map(ticket => `
      <tr>
        <td><strong>#${ticket.id}</strong></td>
        <td>
          <a href="ticket-details.html?id=${ticket.id}" style="font-weight: 600; color: #fff;">
            ${escapeHtml(ticket.title)}
          </a>
        </td>
        <td><span class="ai-tag">${ticket.category}</span></td>
        <td>
          <span class="badge priority-${ticket.priority.toLowerCase()}">
            ${ticket.priority}
          </span>
        </td>
        <td>
          <span class="badge badge-${ticket.status.toLowerCase().replace('_', '')}">
            ${ticket.status.replace('_', ' ')}
          </span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="user-avatar-circle" style="width: 26px; height: 26px; font-size: 0.75rem; background: ${ticket.assignedTo ? 'var(--apple-blue)' : 'rgba(255,255,255,0.1)'};">
              ${ticket.assignedTo ? ticket.assignedName.charAt(0).toUpperCase() : '—'}
            </div>
            <span style="font-size: 0.85rem; color: ${ticket.assignedTo ? '#fff' : 'var(--text-muted)'};">
              ${escapeHtml(ticket.assignedName || 'Awaiting IT Technician')}
            </span>
          </div>
        </td>
        <td style="color: var(--text-muted); font-size: 0.825rem;">
          ${new Date(ticket.createdAt).toLocaleDateString()}
        </td>
        <td>
          <a href="ticket-details.html?id=${ticket.id}" class="btn btn-outline btn-sm">
            View & Chat 🔒
          </a>
        </td>
      </tr>
    `).join('');
  }

  // Handle Form Submission
  submitTicketForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = problemTitleInput.value.trim();
    const description = problemDescInput.value.trim();

    if (!title || !description) {
      alert('Please provide both a problem title and detailed description.');
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting & Analyzing...';

    const newTicket = await API.createTicket({
      title,
      description,
      employeeId: user.id,
      employeeName: user.name
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Support Ticket';

    // Clear Form & Reset AI box
    submitTicketForm.reset();
    aiCategoryEl.textContent = 'Ready';
    aiPriorityEl.textContent = 'Auto Priority';
    aiSolutionEl.textContent = 'Type a description of your issue on the left to see live AI problem categorization and immediate troubleshooting instructions.';

    showEmployeeAlert(`Incident #${newTicket.id} created successfully! IT Technicians have been notified.`);
    await loadMyTickets();
  });

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

      const res = await API.sendAdminEnquiry({
        senderId: user.id,
        senderName: user.name,
        senderEmail: user.email,
        senderRole: 'EMPLOYEE',
        subject,
        message
      });

      btn.disabled = false;
      btn.textContent = 'Dispatch to Admin';

      closeContactAdminModal();
      contactAdminForm.reset();
      showEmployeeAlert('Your enquiry has been dispatched directly to the Administrator mailbox.', true);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  await loadMyTickets();
});
