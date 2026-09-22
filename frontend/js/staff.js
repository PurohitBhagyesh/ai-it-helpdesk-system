/**
 *  IT Technician Dashboard Controller
 */

// Modal Controls for Contacting Admin
function openContactAdminModal() {
  const modal = document.getElementById('contact-admin-modal');
  if (modal) modal.classList.add('active');
}

function closeContactAdminModal() {
  const modal = document.getElementById('contact-admin-modal');
  if (modal) modal.classList.remove('active');
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
      const select = document.getElementById('reject-modal-reason-select');
      const customInput = document.getElementById('reject-modal-custom-reason');
      const reason = select.value === 'custom' ? (customInput.value.trim() || 'Specialty re-routing') : select.value;
      const btn = document.getElementById('reject-modal-submit-btn');

      btn.disabled = true;
      btn.textContent = 'Re-routing...';

      await API.rejectTicket(ticketId, user.id, reason);
      btn.disabled = false;
      btn.textContent = 'Confirm Re-route';

      closeRejectModal();
      showStaffAlert(`Incident #${ticketId} declined and returned to triage pool for re-assignment.`, true);
      await loadStaffTickets();
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

      const res = await API.sendAdminEnquiry({
        senderId: user.id,
        senderName: user.name,
        senderEmail: user.email,
        senderRole: 'IT_TECHNICIAN',
        subject,
        message
      });

      btn.disabled = false;
      btn.textContent = 'Dispatch to Admin';

      closeContactAdminModal();
      contactAdminForm.reset();
      showStaffAlert('Your escalation enquiry has been dispatched directly to the Administrator.', true);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  await loadStaffTickets();
});
