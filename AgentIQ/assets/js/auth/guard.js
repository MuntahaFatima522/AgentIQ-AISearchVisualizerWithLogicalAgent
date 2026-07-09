import { Auth } from './auth.js';

(function checkRouteGuard() {
  const session = Auth.getCurrentSession();
  if (!session) {
    window.location.href = 'login.html';
  }
})();
