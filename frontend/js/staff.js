/**
 * IT Staff Dashboard Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  const user = Auth.requireAuth(['IT_STAFF', 'ADMIN']);
  if (!user) return;

  const unassignedTbody = document.getElementById('unassigned-tickets-tbody');
  const assignedTbody = document.getElementById('assigned-tickets-tbody');
  
  const countOpenEl = document.getElementById('staff-open-count');
  const countAssignedEl = document.getElementById('staff-assigned-count');
  const countResolvedEl = document.getElementById('staff-resolved-count');

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
      unassignedTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No unassigned open tickets right now. Great job! 🎉</td></tr>`;
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
          <td>
            <button class="btn btn-primary btn-sm" onclick="claimTicket(${ticket.id})">
              Claim Ticket
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Render My Assigned Queue
    if (myAssigned.length === 0) {
      assignedTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">You currently have no active assigned tickets.</td></tr>`;
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
          <td>
            <a href="ticket-details.html?id=${ticket.id}" class="btn btn-outline btn-sm">
              Manage & Resolve
            </a>
          </td>
        </tr>
      `).join('');
    }
  }

  // Global handler to claim ticket
  window.claimTicket = async function(ticketId) {
    await API.updateTicketStatus(ticketId, 'IN_PROGRESS', user.id, user.name);
    alert(`You have claimed Ticket #${ticketId}! It is now marked IN PROGRESS.`);
    await loadStaffTickets();
  };

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  await loadStaffTickets();
});
