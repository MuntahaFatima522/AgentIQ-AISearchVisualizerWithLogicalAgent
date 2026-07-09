/* ============================================================
   auth.js — AgentIQ Mock Authentication Logic
   ============================================================ */

export const Auth = {
  // Simple base64 encode for mock password "hashing"
  hashPassword(password) {
    return btoa(password);
  },

  getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem('agentiq_users')) || [];
    } catch (e) {
      return [];
    }
  },

  signUp(name, email, password) {
    const users = this.getAllUsers();
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      name,
      email,
      password_hash: this.hashPassword(password),
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('agentiq_users', JSON.stringify(users));

    // Automatically log in the user after sign up
    return this.login(email, password);
  },

  login(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'No account found with this email.' };
    }

    const hashInput = this.hashPassword(password);
    if (user.password_hash !== hashInput) {
      return { success: false, message: 'Incorrect password.' };
    }

    // Set user session with timestamp
    const session = {
      email: user.email,
      name: user.name,
      loggedInAt: new Date().getTime()
    };
    localStorage.setItem('agentiq_session', JSON.stringify(session));

    return { success: true };
  },

  logout() {
    localStorage.removeItem('agentiq_session');
    // Preserve theme preference on logout
    const currentTheme = localStorage.getItem('agentiq_theme') || 'dark';
    window.location.href = 'index.html?theme=' + currentTheme;
  },

  getCurrentSession() {
    try {
      const session = JSON.parse(localStorage.getItem('agentiq_session'));
      if (!session) return null;

      // Check if session has expired (24h = 86400000 ms)
      const now = new Date().getTime();
      const expiry = 86400000;
      if (now - session.loggedInAt > expiry) {
        this.logout();
        return null;
      }
      return session;
    } catch (e) {
      return null;
    }
  }
};
