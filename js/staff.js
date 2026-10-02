/**
 *  IT Technician Dashboard Controller
 */

// Modal Controls for Contacting Admin
function openContactAdminModal() {
  const user = Auth.getUser();
  if (user) {
    const senderInput = document.getElementById('enquiry-sender-name');
    const techIdInput = document.getElementById('enquiry-tech-id');
    if (senderInput) senderInput.value = `${user.name} (${user.email})`;
    if (techIdInput) techIdInput.value = user.employeeIdCode || ('TECH-' + user.id);
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

function toggleEditTechId() {
  const input = document.getElementById('enquiry-tech-id');
  if (input) {
    input.focus();
    input.select();
  }
}

// Modal Controls for Declining / Re-routing
function openRejectModal(ticketId, ticketTitle) {
  const modal = document.getElementById('reject-ticket-modal');
  const idInput = document.getElementById('reject-modal-ticket-id');
  const label = document.getElementById('reject-modal-ticket-label');
  const customGroup = document.getElementById('reject-custom-group');
  const customInput = document.getElementById('reject-modal-custom-reason');

  if (idInput) idInput.value = ticketId;
  if (label) label.textContent = `Re-routing Incident #${ticketId} (${ticketTitle})`;
  if (customGroup) customGroup.style.display = 'none';
  if (customInput) customInput.value = '';
  if (modal) modal.classList.add('active');
}

function closeRejectModal() {
  const modal = document.getElementById('reject-ticket-modal');
  if (modal) modal.classList.remove('active');
}

function handleRejectReasonChange() {
  const select = document.getElementById('reject-modal-reason-select');
  const customGroup = document.getElementById('reject-custom-group');
  if (select && customGroup) {
    customGroup.style.display = select.value === 'custom' ? 'block' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = Auth.requireAuth(['STAFF', 'IT_STAFF', 'ADMIN']);
  if (!user) return;

  const companyName = user.companyName || 'Acme Global Technologies';
  const companyNav = document.getElementById('nav-company-name');
  const companyTag = document.getElementById('staff-company-tag');
  const welcomeTitle = document.getElementById('staff-welcome-title');
  const userCodeBadge = document.getElementById('navbar-user-code');

  if (companyNav) companyNav.textContent = `${companyName} Support`;
  if (companyTag) companyTag.textContent = `Organization: ${companyName}`;
  if (welcomeTitle) welcomeTitle.textContent = `Welcome to ${companyName} Support Console`;
  if (userCodeBadge) userCodeBadge.textContent = `(${user.employeeIdCode || 'TECH-' + user.id})`;

  const unassignedTbody = document.getElementById('unassigned-tickets-tbody');
  const assignedTbody = document.getElementById('assigned-tickets-tbody');
  const staffAlert = document.getElementById('staff-alert');
  
  const countOpenEl = document.getElementById('staff-open-count');
  const countAssignedEl = document.getElementById('staff-assigned-count');
  const countResolvedEl = document.getElementById('staff-resolved-count');

  function showStaffAlert(msg, isSuccess = true) {
    if (!staffAlert) return;
    staffAlert.style.display = 'block';
    staffAlert.textContent = msg;
    staffAlert.style.background = isSuccess ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 69, 58, 0.15)';
    staffAlert.style.border = isSuccess ? '1px solid rgba(48, 209, 88, 0.35)' : '1px solid rgba(255, 69, 58, 0.35)';
    staffAlert.style.color = isSuccess ? '#30d158' : '#ff453a';

    setTimeout(() => {
      staffAlert.style.display = 'none';
    }, 4500);
  }

  async function loadStaffTickets() {
    const allTickets = await API.getTickets();

    const unassigned = allTickets.filter(t => !t.assignedTo && t.status === 'OPEN');
    const myAssigned = allTickets.filter(t => t.assignedTo === user.id);
    const resolvedCount = allTickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

    countOpenEl.textContent = unassigned.length;
    countAssignedEl.textContent = myAssigned.length;
    countResolvedEl.textContent = resolvedCount;

    // Render Unassigned Queue
    if (unassigned.length === 0) {
      unassignedTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">No unassigned open tickets in triage. All systems operating normally! 🎉</td></tr>`;
    } else {
      unassignedTbody.innerHTML = unassigned.map(ticket => `
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
          <td>${escapeHtml(ticket.employeeName || 'Employee')}</td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.5rem; justify-content: flex-end;">
              <button class="btn btn-primary btn-sm" onclick="claimTicket(${ticket.id})">
                ⚡ Accept Incident
              </button>
              <button class="btn btn-secondary btn-sm" style="color: var(--apple-danger); border-color: rgba(255, 69, 58, 0.3);" onclick="openRejectModal(${ticket.id}, '${escapeHtml(ticket.title).replace(/'/g, "\\'")}')">
                Decline
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }

    // Render My Assigned Queue
    if (myAssigned.length === 0) {
      assignedTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2.5rem;">You currently have no active assigned incidents. Accept a ticket above to begin troubleshooting.</td></tr>`;
    } else {
      assignedTbody.innerHTML = myAssigned.map(ticket => `
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
          <td>${escapeHtml(ticket.employeeName || 'Employee')}</td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.5rem; justify-content: flex-end;">
              <a href="ticket-details.html?id=${ticket.id}" class="btn btn-outline btn-sm">
                Inspect & Chat 🔒
              </a>
              <button class="btn btn-secondary btn-sm" style="color: #fbbf24; border-color: rgba(251, 191, 36, 0.3);" onclick="openRejectModal(${ticket.id}, '${escapeHtml(ticket.title).replace(/'/g, "\\'")}')">
                Re-route
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  // Global handler to claim ticket
  window.claimTicket = async function(ticketId) {
    await API.updateTicketStatus(ticketId, 'IN_PROGRESS', user.id, user.name);
    showStaffAlert(`Incident #${ticketId} accepted! You are now assigned as the primary IT Technician.`);
    await loadStaffTickets();
  };

  // Handle Reject / Re-route Form
  const rejectForm = document.getElementById('reject-ticket-form');
  if (rejectForm) {
    rejectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const ticketId = document.getElementById('reject-modal-ticket-id').value;
      const reasonSelect = document.getElementById('reject-modal-reason-select').value;
      const customReason = document.getElementById('reject-modal-custom-reason').value.trim();
      const reason = reasonSelect === 'custom' ? customReason : reasonSelect;

      const submitBtn = document.getElementById('reject-modal-submit-btn');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Re-routing...';

      const res = await API.rejectTicket(ticketId, user.id, reason);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Re-route';

      if (res) {
        closeRejectModal();
        showStaffAlert(`Ticket #${ticketId} declined and returned to open triage pool. Reason logged.`, true);
        await loadStaffTickets();
      } else {
        showStaffAlert('Failed to decline ticket. Please retry.', false);
      }
    });
  }

  // Handle Contact Admin Enquiry Form Submission
  const contactAdminForm = document.getElementById('contact-admin-form');
  if (contactAdminForm) {
    contactAdminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const subject = document.getElementById('enquiry-subject').value.trim();
      const message = document.getElementById('enquiry-message').value.trim();
      const techId = document.getElementById('enquiry-tech-id') ? document.getElementById('enquiry-tech-id').value.trim() : (user.employeeIdCode || 'TECH-' + user.id);
      const submitBtn = document.getElementById('enquiry-submit-btn');
      const feedback = document.getElementById('enquiry-feedback');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const res = await API.sendAdminEnquiry({
        senderId: user.id,
        senderName: user.name,
        senderEmail: user.email,
        senderRole: 'STAFF',
        employeeIdCode: techId,
        subject,
        message
      });

      submitBtn.disabled = false;
      submitBtn.textContent = 'Dispatch to Admin';

      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.background = 'rgba(48, 209, 88, 0.15)';
        feedback.style.border = '1px solid rgba(48, 209, 88, 0.35)';
        feedback.style.color = '#30d158';
        feedback.innerHTML = '✅ <strong>Message sent to Admin.</strong> Please wait for an administrator response.';
      }

      setTimeout(() => {
        contactAdminForm.reset();
        closeContactAdminModal();
        showStaffAlert('Your escalation enquiry has been delivered directly to the Administrator mailbox.', true);
      }, 1800);
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  window.openRejectModal = openRejectModal;
  window.closeRejectModal = closeRejectModal;
  window.handleRejectReasonChange = handleRejectReasonChange;

  await loadStaffTickets();
});
