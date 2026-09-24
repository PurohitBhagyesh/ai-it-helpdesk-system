/**
 *  Enterprise Admin Dashboard Controller
 * Handles Incident Telemetry, Corporate User Provisioning with Employee/Tech profiles,
 * and Official Administrator Enquiry Mailbox
 */

let currentView = 'analytics';
let cachedUsers = [];

function switchAdminView(view) {
  currentView = view;
  const btnAnalytics = document.getElementById('view-analytics-btn');
  const btnUsers = document.getElementById('view-users-btn');
  const btnEnquiries = document.getElementById('view-enquiries-btn');
  const secAnalytics = document.getElementById('section-analytics');
  const secUsers = document.getElementById('section-users');
  const secEnquiries = document.getElementById('section-enquiries');

  // Reset active classes
  btnAnalytics.classList.remove('active');
  btnUsers.classList.remove('active');
  btnEnquiries.classList.remove('active');

  secAnalytics.style.display = 'none';
  secUsers.style.display = 'none';
  secEnquiries.style.display = 'none';

  if (view === 'users') {
    btnUsers.classList.add('active');
    secUsers.style.display = 'block';
    if (window.loadUsersData) window.loadUsersData();
  } else if (view === 'enquiries') {
    btnEnquiries.classList.add('active');
    secEnquiries.style.display = 'block';
    if (window.loadEnquiriesData) window.loadEnquiriesData();
  } else {
    btnAnalytics.classList.add('active');
    secAnalytics.style.display = 'block';
    if (window.loadAdminAnalytics) window.loadAdminAnalytics();
  }
}

// Role toggle in Provisioning Form
function setProvisionRole(role) {
  document.getElementById('prov-role').value = role;
  const btnEmp = document.getElementById('role-toggle-emp');
  const btnTech = document.getElementById('role-toggle-tech');
  const techFields = document.getElementById('tech-fields-container');
  const roleBadge = document.getElementById('prov-role-badge');
  const labelName = document.getElementById('label-prov-name');
  const labelIdCode = document.getElementById('label-prov-idcode');
  const inputIdCode = document.getElementById('prov-idcode');
  const inputName = document.getElementById('prov-name');

  if (role === 'STAFF') {
    btnEmp.className = 'btn btn-secondary btn-sm';
    btnTech.className = 'btn btn-primary btn-sm';
    techFields.style.display = 'block';
    roleBadge.textContent = '🛠️ IT Technician Tier';
    roleBadge.className = 'badge badge-open';
    labelName.textContent = 'IT Technician Full Name (Username)';
    labelIdCode.textContent = 'Technician ID Code';
    inputIdCode.placeholder = 'TECH-' + Math.floor(1000 + Math.random() * 9000);
    if (!inputIdCode.value || inputIdCode.value.startsWith('EMP-')) {
      inputIdCode.value = 'TECH-' + Math.floor(1000 + Math.random() * 9000);
    }
  } else {
    btnTech.className = 'btn btn-secondary btn-sm';
    btnEmp.className = 'btn btn-primary btn-sm';
    techFields.style.display = 'none';
    roleBadge.textContent = '👤 Employee Tier';
    roleBadge.className = 'badge badge-resolved';
    labelName.textContent = 'Employee Full Name (Username)';
    labelIdCode.textContent = 'Employee ID Code';
    inputIdCode.placeholder = 'EMP-' + Math.floor(1000 + Math.random() * 9000);
    if (!inputIdCode.value || inputIdCode.value.startsWith('TECH-')) {
      inputIdCode.value = 'EMP-' + Math.floor(1000 + Math.random() * 9000);
    }
  }
}

// User Profile & Management Modal Controls
function openUserProfileModal(userId) {
  const user = cachedUsers.find(u => u.id === Number(userId));
  if (!user) return;

  const currentAdmin = Auth.getUser();

  document.getElementById('edit-user-id').value = user.id;
  document.getElementById('edit-user-name').value = user.name || '';
  document.getElementById('edit-user-idcode').value = user.employeeIdCode || ('ID-' + user.id);
  document.getElementById('edit-user-email').value = user.email || '';
  document.getElementById('edit-user-role').value = user.role || 'EMPLOYEE';
  document.getElementById('edit-user-dept').value = user.department || '';
  document.getElementById('edit-user-joindate').value = user.joinDate || '';
  document.getElementById('edit-user-designation').value = user.designation || '';
  document.getElementById('edit-user-phone').value = user.phone || '';
  document.getElementById('edit-user-experience').value = user.experience || '';
  document.getElementById('edit-user-specialization').value = user.specialization || '';
  document.getElementById('edit-user-password').value = '';

  document.getElementById('profile-modal-title').textContent = `${user.name} - Profile Details`;
  document.getElementById('profile-modal-subtitle').textContent = `Role: ${user.role} • ID: ${user.employeeIdCode || user.id}`;

  const deleteBtn = document.getElementById('delete-user-btn');
  if (currentAdmin && currentAdmin.id === user.id) {
    deleteBtn.style.display = 'none';
  } else {
    deleteBtn.style.display = 'inline-block';
  }

  const modal = document.getElementById('user-profile-modal');
  modal.classList.add('active');
}

function closeProfileModal() {
  const modal = document.getElementById('user-profile-modal');
  modal.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', async () => {
  const user = Auth.requireAuth(['ADMIN']);
  if (!user) return;

  // Set default Join Date to today
  document.getElementById('prov-joindate').value = new Date().toISOString().split('T')[0];
  document.getElementById('prov-idcode').value = 'EMP-' + Math.floor(1000 + Math.random() * 9000);

  // Set Company Name dynamically
  const companyName = user.companyName || 'Acme Global Technologies';
  document.getElementById('nav-company-name').textContent = `${companyName} Intelligence`;
  document.getElementById('admin-org-tag').textContent = `Organization: ${companyName}`;
  document.getElementById('prov-company-label').textContent = companyName;
  document.getElementById('info-company-name').textContent = companyName;
  document.getElementById('admin-welcome-heading').textContent = `Welcome to ${companyName} Console`;

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
  const enquiriesTbody = document.getElementById('enquiries-tbody');
  const enquiryCountBadge = document.getElementById('enquiry-count-badge');
  const enquiryNavBadge = document.getElementById('enquiry-nav-badge');
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

    await refreshEnquiryBadge();
  }

  // 2. Load User Directory & Provisioning
  async function loadUsersData() {
    const users = await API.getUsers();
    cachedUsers = users;
    userCountBadge.textContent = `${users.length} Active Accounts`;

    const roleBadges = {
      ADMIN: '<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.35);">ADMIN</span>',
      STAFF: '<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.35);">IT TECHNICIAN</span>',
      IT_STAFF: '<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.35);">IT TECHNICIAN</span>',
      EMPLOYEE: '<span class="badge badge-resolved">EMPLOYEE</span>'
    };

    const avatarGradients = {
      ADMIN: 'linear-gradient(135deg, #ef4444, #f43f5e)',
      STAFF: 'linear-gradient(135deg, #0071e3, #5ac8fa)',
      IT_STAFF: 'linear-gradient(135deg, #0071e3, #5ac8fa)',
      EMPLOYEE: 'linear-gradient(135deg, #30d158, #10b981)'
    };

    userDirectoryTbody.innerHTML = users.map(u => {
      const initial = (u.name || 'U').charAt(0).toUpperCase();
      const gradient = avatarGradients[u.role] || avatarGradients.EMPLOYEE;
      const roleBadge = roleBadges[u.role] || roleBadges.EMPLOYEE;
      const idCode = u.employeeIdCode || (u.role === 'ADMIN' ? 'ADM-001' : (u.role === 'STAFF' || u.role === 'IT_STAFF' ? `TECH-${u.id}` : `EMP-${u.id}`));
      const expOrDesig = u.experience || u.designation || (u.role === 'ADMIN' ? 'Security Officer' : 'Corporate Member');

      return `
        <tr style="cursor: pointer;" onclick="openUserProfileModal(${u.id})">
          <td>
            <span style="font-family: monospace; font-weight: 700; color: #60a5fa; background: rgba(0, 113, 227, 0.15); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">
              ${escapeHtml(idCode)}
            </span>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="user-dir-avatar" style="background: ${gradient};">${initial}</div>
              <div>
                <div style="font-weight: 600; color: #fff;">${escapeHtml(u.name)}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(u.phone || 'No phone set')}</div>
              </div>
            </div>
          </td>
          <td>
            <span style="color: #60a5fa; font-family: monospace; font-size: 0.85rem;">${escapeHtml(u.email)}</span>
          </td>
          <td>
            <span class="ai-tag">${escapeHtml(u.department || 'General')}</span>
          </td>
          <td>${roleBadge}</td>
          <td>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">${escapeHtml(expOrDesig)}</span>
          </td>
          <td style="text-align: right;" onclick="event.stopPropagation();">
            <button class="btn btn-outline btn-sm" onclick="openUserProfileModal(${u.id})">
              👁️ Profile & Edit
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 3. Load Administrator Enquiry Mailbox Data
  async function loadEnquiriesData() {
    const enquiries = await API.getAdminEnquiries();
    enquiryCountBadge.textContent = `${enquiries.length} Enquiries`;

    const pendingCount = enquiries.filter(e => e.status === 'PENDING').length;
    if (pendingCount > 0) {
      enquiryNavBadge.style.display = 'inline-block';
      enquiryNavBadge.textContent = pendingCount;
    } else {
      enquiryNavBadge.style.display = 'none';
    }

    if (enquiries.length === 0) {
      enquiriesTbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
            📬 No incoming enquiries. The administrator inbox is completely clear.
          </td>
        </tr>
      `;
      return;
    }

    const roleBadges = {
      STAFF: '<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.35);">IT TECHNICIAN</span>',
      IT_STAFF: '<span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.35);">IT TECHNICIAN</span>',
      EMPLOYEE: '<span class="badge badge-resolved">EMPLOYEE</span>'
    };

    enquiriesTbody.innerHTML = enquiries.map(e => {
      const isPending = e.status === 'PENDING';
      const statusBadge = isPending
        ? '<span class="badge badge-inprogress">PENDING REVIEW</span>'
        : '<span class="badge badge-resolved">RESOLVED</span>';

      const roleBadge = roleBadges[e.senderRole] || `<span class="badge">${e.senderRole}</span>`;
      const dateStr = e.createdAt ? new Date(e.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recently';
      const senderCode = e.employeeIdCode || 'EMP-101';

      return `
        <tr>
          <td><strong>#${e.id}</strong></td>
          <td>
            <span style="font-family: monospace; font-size: 0.8rem; font-weight: 700; color: #60a5fa; background: rgba(0, 113, 227, 0.15); padding: 0.15rem 0.4rem; border-radius: 4px;">
              ${escapeHtml(senderCode)}
            </span>
          </td>
          <td>
            <div style="font-weight: 600; color: #fff;">${escapeHtml(e.senderName)}</div>
            <div style="font-size: 0.75rem; color: #60a5fa; font-family: monospace;">${escapeHtml(e.senderEmail)}</div>
          </td>
          <td>${roleBadge}</td>
          <td><strong style="color: #fff;">${escapeHtml(e.subject)}</strong></td>
          <td style="max-width: 320px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">
            ${escapeHtml(e.message)}
          </td>
          <td style="font-size: 0.8rem; color: var(--text-muted); white-space: nowrap;">${dateStr}</td>
          <td>${statusBadge}</td>
          <td style="text-align: right; white-space: nowrap;">
            ${isPending ? `
              <button class="btn btn-primary btn-sm" onclick="handleResolveEnquiry(${e.id})">
                ✓ Resolve
              </button>
            ` : `
              <span style="color: #30d158; font-size: 0.825rem; font-weight: 600;">✓ Completed</span>
            `}
          </td>
        </tr>
      `;
    }).join('');
  }

  async function refreshEnquiryBadge() {
    try {
      const enquiries = await API.getAdminEnquiries();
      const pendingCount = enquiries.filter(e => e.status === 'PENDING').length;
      if (pendingCount > 0) {
        enquiryNavBadge.style.display = 'inline-block';
        enquiryNavBadge.textContent = pendingCount;
      } else {
        enquiryNavBadge.style.display = 'none';
      }
    } catch (e) {}
  }

  // 4. Resolve Enquiry Handler
  window.handleResolveEnquiry = async function(enquiryId) {
    const res = await API.updateEnquiryStatus(enquiryId, 'RESOLVED');
    if (res && res.success !== false) {
      showAdminAlert(`Enquiry #${enquiryId} marked as Resolved.`, true);
      await loadEnquiriesData();
    } else {
      showAdminAlert('Failed to update enquiry status.', false);
    }
  };

  // 5. User Provisioning Form Handler
  const provisionForm = document.getElementById('provision-user-form');
  provisionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('prov-name').value.trim();
    const email = document.getElementById('prov-email').value.trim();
    const password = document.getElementById('prov-password').value;
    const role = document.getElementById('prov-role').value;
    const department = document.getElementById('prov-dept').value.trim();
    const employeeIdCode = document.getElementById('prov-idcode').value.trim();
    const joinDate = document.getElementById('prov-joindate').value;
    const designation = document.getElementById('prov-designation').value.trim();
    const phone = document.getElementById('prov-phone').value.trim();
    const experience = document.getElementById('prov-experience').value.trim();
    const specialization = document.getElementById('prov-specialization').value.trim();
    const btn = document.getElementById('prov-submit-btn');

    btn.disabled = true;
    btn.textContent = 'Provisioning Account...';

    const res = await API.provisionUser({
      name,
      email,
      password,
      role,
      department,
      companyName,
      employeeIdCode,
      joinDate,
      designation,
      phone,
      experience,
      specialization
    });

    btn.disabled = false;
    btn.textContent = 'Create Corporate Account';

    if (res && res.success) {
      showAdminAlert(`Corporate account for ${name} (${employeeIdCode}) provisioned successfully!`, true);
      provisionForm.reset();
      document.getElementById('prov-joindate').value = new Date().toISOString().split('T')[0];
      setProvisionRole('EMPLOYEE');
      await loadUsersData();
    } else {
      showAdminAlert(res.message || 'Failed to provision user. Ensure email is unique.', false);
    }
  });

  // 6. Edit User Modal Form Handler
  const editUserForm = document.getElementById('edit-user-form');
  editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('edit-user-id').value;
    const name = document.getElementById('edit-user-name').value.trim();
    const employeeIdCode = document.getElementById('edit-user-idcode').value.trim();
    const email = document.getElementById('edit-user-email').value.trim();
    const role = document.getElementById('edit-user-role').value;
    const department = document.getElementById('edit-user-dept').value.trim();
    const joinDate = document.getElementById('edit-user-joindate').value;
    const designation = document.getElementById('edit-user-designation').value.trim();
    const phone = document.getElementById('edit-user-phone').value.trim();
    const experience = document.getElementById('edit-user-experience').value.trim();
    const specialization = document.getElementById('edit-user-specialization').value.trim();
    const password = document.getElementById('edit-user-password').value;

    const submitBtn = document.getElementById('edit-user-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    const payload = {
      name,
      employeeIdCode,
      email,
      role,
      department,
      joinDate,
      designation,
      phone,
      experience,
      specialization
    };
    if (password && password.trim().length >= 6) {
      payload.password = password.trim();
    }

    const res = await API.updateUser(userId, payload);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Changes';

    if (res && res.success) {
      closeProfileModal();
      showAdminAlert(`Profile for ${name} updated successfully!`, true);
      await loadUsersData();
    } else {
      showAdminAlert(res.message || 'Failed to update user profile.', false);
    }
  });

  // 7. Delete User Handler
  window.handleDeleteCurrentModalUser = async function() {
    const userId = document.getElementById('edit-user-id').value;
    const name = document.getElementById('edit-user-name').value;

    if (!confirm(`Are you sure you want to permanently delete ${name}? This will revoke their access completely.`)) {
      return;
    }

    const res = await API.deleteUser(userId);
    if (res && res.success) {
      closeProfileModal();
      showAdminAlert(`Account for ${name} deleted successfully.`, true);
      await loadUsersData();
    } else {
      showAdminAlert(res.message || 'Failed to delete user account.', false);
    }
  };

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  window.loadAdminAnalytics = loadAdminAnalytics;
  window.loadUsersData = loadUsersData;
  window.loadEnquiriesData = loadEnquiriesData;
  window.openUserProfileModal = openUserProfileModal;
  window.closeProfileModal = closeProfileModal;
  window.setProvisionRole = setProvisionRole;

  await loadAdminAnalytics();
});
