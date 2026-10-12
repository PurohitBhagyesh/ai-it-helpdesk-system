// Modal Controls for Contacting Admin
function openContactAdminModal() {
  const user = Auth.getUser();
  if (user) {
    document.getElementById('enquiry-sender-name').value = `${user.name} (${user.email})`;
    document.getElementById('enquiry-employee-id').value = user.employeeIdCode || ('EMP-' + user.id);
  }
  const modal = document.getElementById('contact-admin-modal');
  if (modal) modal.classList.add('active');
}

function closeContactAdminModal() {
  const modal = document.getElementById('contact-admin-modal');
  if (modal) modal.classList.remove('active');
  const feedback = document.getElementById('enquiry-feedback');
  if (feedback) feedback.style.display = 'none';
}

function toggleEditEmployeeId() {
  const input = document.getElementById('enquiry-employee-id');
  input.focus();
  input.select();
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = Auth.requireAuth(['EMPLOYEE', 'ADMIN']);
  if (!user) return;

  const companyName = user.companyName || 'Acme Global Technologies';
  const companyNav = document.getElementById('nav-company-name');
  const companyTag = document.getElementById('employee-company-tag');
  const welcomeTitle = document.getElementById('employee-welcome-title');
  const userCodeBadge = document.getElementById('navbar-user-code');

  if (companyNav) companyNav.textContent = `${companyName} Helpdesk`;
  if (companyTag) companyTag.textContent = `Organization: ${companyName}`;
  if (welcomeTitle) welcomeTitle.textContent = `Welcome to ${companyName} Helpdesk`;
  if (userCodeBadge) userCodeBadge.textContent = `(${user.employeeIdCode || 'EMP-' + user.id})`;

  const problemTitleInput = document.getElementById('problem-title');
  const problemDescInput = document.getElementById('problem-desc');
  const problemContactInput = document.getElementById('problem-contact');
  const submitTicketForm = document.getElementById('create-ticket-form');
  const ticketsTableBody = document.getElementById('my-tickets-tbody');
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
      ticketsTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
            No tickets submitted yet. Use the form above to report your first incident.
          </td>
        </tr>
      `;
      return;
    }

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
          ${ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Today'}
        </td>
        <td style="text-align: right;">
          <a href="ticket-details.html?id=${ticket.id}" class="btn btn-outline btn-sm">
            Inspect 🔒
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
    const contactInfo = problemContactInput ? problemContactInput.value.trim() : '';

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
      contactInfo,
      employeeId: user.id,
      employeeName: user.name
    });

    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Support Ticket';

    // Clear Form & Reset AI box
    submitTicketForm.reset();
    aiCategoryEl.textContent = 'Ready';
    aiPriorityEl.textContent = 'Auto';
    aiPriorityEl.className = 'ai-chip priority-low';
    aiSolutionEl.textContent = 'Type a description of your issue on the left to see live AI problem categorization and immediate troubleshooting instructions.';

    showEmployeeAlert(`Incident Ticket #${newTicket.id} submitted successfully! Awaiting IT Technician triage.`, true);
    await loadMyTickets();
  });

  // Handle Contact Admin Enquiry Form Submission
  const contactAdminForm = document.getElementById('contact-admin-form');
  if (contactAdminForm) {
    contactAdminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const subject = document.getElementById('enquiry-subject').value.trim();
      const message = document.getElementById('enquiry-message').value.trim();
      const employeeIdCode = document.getElementById('enquiry-employee-id').value.trim();
      const submitBtn = document.getElementById('enquiry-submit-btn');
      const feedback = document.getElementById('enquiry-feedback');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const res = await API.sendAdminEnquiry({
        senderId: user.id,
        senderName: user.name,
        senderEmail: user.email,
        senderRole: 'EMPLOYEE',
        employeeIdCode: employeeIdCode,
        subject,
        message
      });

      submitBtn.disabled = false;
      submitBtn.textContent = 'Send to Admin Mailbox';

      feedback.style.display = 'block';
      feedback.style.background = 'rgba(48, 209, 88, 0.15)';
      feedback.style.border = '1px solid rgba(48, 209, 88, 0.35)';
      feedback.style.color = '#30d158';
      feedback.innerHTML = '✅ <strong>Message sent to Admin.</strong> Please wait for an administrator response.';

      setTimeout(() => {
        contactAdminForm.reset();
        closeContactAdminModal();
        showEmployeeAlert('Your enquiry was successfully delivered to the IT Administrator mailbox.', true);
      }, 1800);
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  await loadMyTickets();
});
