/**
 * Admin Dashboard Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  const user = Auth.requireAuth(['ADMIN']);
  if (!user) return;

  // Stat Counters
  const totalCountEl = document.getElementById('admin-total-tickets');
  const openCountEl = document.getElementById('admin-open-tickets');
  const progressCountEl = document.getElementById('admin-progress-tickets');
  const resolvedCountEl = document.getElementById('admin-resolved-tickets');
  const rateEl = document.getElementById('admin-resolution-rate');

  // Distribution Bars Container
  const categoryBarsContainer = document.getElementById('category-bars');
  const priorityBarsContainer = document.getElementById('priority-bars');
  const allTicketsTbody = document.getElementById('all-tickets-tbody');

  async function loadAdminData() {
    const stats = await API.getAdminStats();
    const allTickets = await API.getTickets();

    totalCountEl.textContent = stats.total;
    openCountEl.textContent = stats.open;
    progressCountEl.textContent = stats.inProgress;
    resolvedCountEl.textContent = stats.resolved;

    const rate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
    rateEl.textContent = `${rate}%`;

    // Render Category Distribution Bars
    const catColors = {
      NETWORK: '#3b82f6',
      HARDWARE: '#f59e0b',
      SOFTWARE: '#8b5cf6',
      ACCESS: '#10b981'
    };

    categoryBarsContainer.innerHTML = Object.entries(stats.categories).map(([cat, count]) => {
      const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
      return `
        <div class="bar-group">
          <div class="bar-header">
            <span><strong>${cat}</strong></span>
            <span style="color: var(--text-muted);">${count} tickets (${pct}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%; background: ${catColors[cat] || '#3b82f6'};"></div>
          </div>
        </div>
      `;
    }).join('');

    // Render Priority Distribution Bars
    const prioColors = {
      HIGH: '#ef4444',
      MEDIUM: '#f59e0b',
      LOW: '#10b981'
    };

    priorityBarsContainer.innerHTML = Object.entries(stats.priorities).map(([prio, count]) => {
      const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
      return `
        <div class="bar-group">
          <div class="bar-header">
            <span><strong>${prio}</strong></span>
            <span style="color: var(--text-muted);">${count} tickets (${pct}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${pct}%; background: ${prioColors[prio] || '#3b82f6'};"></div>
          </div>
        </div>
      `;
    }).join('');

    // Render All Tickets Master Table
    allTicketsTbody.innerHTML = allTickets.map(ticket => `
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
        <td>${escapeHtml(ticket.assignedName || 'Unassigned')}</td>
        <td>
          <a href="ticket-details.html?id=${ticket.id}" class="btn btn-outline btn-sm">
            View
          </a>
        </td>
      </tr>
    `).join('');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  await loadAdminData();
});
