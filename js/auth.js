/**
 * Authentication & Session Management Helper
 */

const Auth = {
  getUser() {
    const userJson = localStorage.getItem('helpdesk_active_user');
    return userJson ? JSON.parse(userJson) : null;
  },

  setUser(user) {
    localStorage.setItem('helpdesk_active_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('helpdesk_active_user');
    window.location.href = 'index.html';
  },

  requireAuth(allowedRoles = []) {
    const user = this.getUser();
    if (!user) {
      window.location.href = 'index.html';
      return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      alert(`Access denied for role: ${user.role}`);
      this.redirectByRole(user.role);
      return null;
    }

    // Populate user profile info in navbar if elements exist
    const userNameEl = document.getElementById('navbar-user-name');
    const userRoleEl = document.getElementById('navbar-user-role');
    const userAvatarEl = document.getElementById('navbar-user-avatar');

    if (userNameEl) userNameEl.textContent = user.name || user.email;
    if (userRoleEl) userRoleEl.textContent = user.role.replace('_', ' ');
    if (userAvatarEl) userAvatarEl.textContent = (user.name || user.email).charAt(0).toUpperCase();

    return user;
  },

  redirectByRole(role) {
    switch (role) {
      case 'ADMIN':
        window.location.href = 'admin-dashboard.html';
        break;
      case 'IT_STAFF':
        window.location.href = 'staff-dashboard.html';
        break;
      case 'EMPLOYEE':
      default:
        window.location.href = 'employee-dashboard.html';
        break;
    }
  }
};
