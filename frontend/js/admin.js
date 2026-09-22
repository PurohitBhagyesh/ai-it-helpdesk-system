/**
 *  Enterprise Admin Dashboard Controller
 * Handles Incident Telemetry and Corporate User Provisioning & Credential Assignment
 */

let currentView = 'analytics';

function switchAdminView(view) {
  currentView = view;
  const btnAnalytics = document.getElementById('view-analytics-btn');
  const btnUsers = document.getElementById('view-users-btn');
  const secAnalytics = document.getElementById('section-analytics');
  const secUsers = document.getElementById('section-users');

  if (view === 'users') {
    btnAnalytics.classList.remove('active');
    btnUsers.classList.add('active');
    secAnalytics.style.display = 'none';
    secUsers.style.display = 'block';
    if (window.loadUsersData) window.loadUsersData();
  } else {
    btnUsers.classList.remove('active');
    btnAnalytics.classList.add('active');
    secUsers.style.display = 'none';
    secAnalytics.style.display = 'block';
    if (window.loadAdminAnalytics) window.loadAdminAnalytics();
  }
}

// Reset Password Modal Controls
function openResetModal(userId, userName, userEmail) {
  const modal = document.getElementById('reset-password-modal');
  const userLabel = document.getElementById('reset-modal-user-label');
  const userIdInput = document.getElementById('reset-modal-user-id');
  const newPasswordInput = document.getElementById('reset-modal-new-password');

  userIdInput.value = userId;
  userLabel.textContent = `Assigning new password for ${userName} (${userEmail})`;
  newPasswordInput.value = '';
  modal.classList.add('active');
}

function closeResetModal() {
  const modal = document.getElementById('reset-password-modal');
  modal.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = Auth.requireAuth(['ADMIN']);
  if (!user) return;

  // Stat Counters
  const totalCountEl = document.getElementById('admin-total-tickets');
  const openCountEl = document.getElementById('admin-open-tickets');
  const progressCountEl = document.getElementById('admin-progress-tickets');
  const resolvedCountEl = document.getElementById('admin-resolved-tickets');
  const rateEl = document.getElementById('admin-resolution-rate');

  // Containers
  const categoryBarsContainer = document.getElementById('category-bars');
  const priorityBarsContainer = document.getElementById('priority-bars');
  const allTicketsTbody = document.getElementById('all-tickets-tbody');
  const userDirectoryTbody = document.getElementById('user-directory-tbody');
  const userCountBadge = document.getElementById('user-count-badge');
  const adminAlert = document.getElementById('admin-alert');

  function showAdminAlert(msg, isSuccess = true) {
    adminAlert.style.display = 'block';
    adminAlert.textContent = msg;
    adminAlert.style.background = isSuccess ? 'rgba(48, 209, 88, 0.15)' : 'rgba(255, 69, 58, 0.15)';
    adminAlert.style.border = isSuccess ? '1px solid rgba(48, 209, 88, 0.35)' : '1px solid rgba(255, 69, 58, 0.35)';
    adminAlert.style.color = isSuccess ? '#30d158' : '#ff453a';

    setTimeout(() => {
      adminAlert.style.display = 'none';
    }, 4500);
  }

  // 1. Load Telemetry Data
  async function loadAdminAnalytics() {
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
            Inspect
          </a>
        </td>
      </tr>
    `).join('');
  }

  // 2. Load User Directory & Provisioning
  async function loadUsersData() {
    const users = await API.getUsers();
    userCountBadge.textContent = `${users.length} Active Accounts`;

    const roleBadges = {
      ADMIN: '<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.35);">ADMIN</span>',
      STAFF: '<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.35);">IT SUPPORT</span>',
      EMPLOYEE: '<span class="badge badge-resolved">EMPLOYEE</span>'
    };

    const avatarGradients = {
      ADMIN: 'linear-gradient(135deg, #ef4444, #f43f5e)',
      STAFF: 'linear-gradient(135deg, #0071e3, #5ac8fa)',
      EMPLOYEE: 'linear-gradient(135deg, #30d158, #10b981)'
    };

    userDirectoryTbody.innerHTML = users.map(u => {
      const initial = (u.name || 'U').charAt(0).toUpperCase();
      const gradient = avatarGradients[u.role] || avatarGradients.EMPLOYEE;
      const roleBadge = roleBadges[u.role] || roleBadges.EMPLOYEE;

      return `
        <tr>
          <td><strong>#${u.id}</strong></td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="user-dir-avatar" style="background: ${gradient};">${initial}</div>
              <div>
                <div style="font-weight: 600; color: #fff;">${escapeHtml(u.name)}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${u.role}</div>
              </div>
            </div>
          </td>
          <td>
            <span style="color: #60a5fa; font-family: monospace; font-size: 0.875rem;">${escapeHtml(u.email)}</span>
          </td>
          <td>
            <span class="ai-tag">${escapeHtml(u.department || 'General')}</span>
          </td>
          <td>${roleBadge}</td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.5rem; justify-content: flex-end;">
              <button class="btn btn-outline btn-sm" onclick="openResetModal(${u.id}, '${escapeHtml(u.name).replace(/'/g, "\\'")}', '${escapeHtml(u.email).replace(/'/g, "\\'")}')">
                🔑 Assign Password
              </button>
              ${u.id !== user.id ? `
                <button class="btn btn-secondary btn-sm" style="color: var(--apple-danger); border-color: rgba(255, 69, 58, 0.3);" onclick="handleDeleteUser(${u.id}, '${escapeHtml(u.name).replace(/'/g, "\\'")}')">
                  Revoke
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 3. User Provisioning Form Handler
  const provisionForm = document.getElementById('provision-user-form');
  provisionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('prov-name').value.trim();
    const email = document.getElementById('prov-email').value.trim();
    const password = document.getElementById('prov-password').value;
    const role = document.getElementById('prov-role').value;
    const department = document.getElementById('prov-dept').value.trim();
    const btn = document.getElementById('prov-submit-btn');

    btn.disabled = true;
    btn.textContent = 'Provisioning Account...';

    const res = await API.provisionUser({ name, email, password, role, department });
    btn.disabled = false;
    btn.textContent = 'Provision Corporate Account';

    if (res && res.success) {
      showAdminAlert(`Corporate account for ${name} (${email}) provisioned successfully!`, true);
      provisionForm.reset();
      await loadUsersData();
    } else {
      showAdminAlert(res.message || 'Failed to provision user. Ensure email is unique.', false);
    }
  });

  // 4. Password Reset Form Handler
  const resetForm = document.getElementById('reset-password-form');
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('reset-modal-user-id').value;
    const newPassword = document.getElementById('reset-modal-new-password').value;
    const submitBtn = document.getElementById('reset-modal-submit-btn');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';

    const res = await API.resetUserPassword(userId, newPassword);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Update Password';

    if (res && res.success) {
      closeResetModal();
      showAdminAlert('User password updated successfully. The new credentials are now active.', true);
    } else {
      showAdminAlert(res.message || 'Failed to update user password.', false);
    }
  });

  // 5. Account Revocation / Deletion
  window.handleDeleteUser = async function(userId, userName) {
    if (!confirm(`Are you sure you want to revoke enterprise access for ${userName}? This will disable their login credentials.`)) {
      return;
    }
    const res = await API.deleteUser(userId);
    if (res && res.success) {
      showAdminAlert(`Access revoked for ${userName}.`, true);
      await loadUsersData();
    } else {
      showAdminAlert(res.message || 'Failed to remove user account.', false);
    }
  };

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  window.loadAdminAnalytics = loadAdminAnalytics;
  window.loadUsersData = loadUsersData;

  await loadAdminAnalytics();
});

