const LocalStorage = {
  getSession: () => {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : undefined;
  },

  getUserId: () => {
    const userId = localStorage.getItem('userId');
    return userId && JSON.parse(userId);
  },

  setSession: (session) => {
    if (session) {
      localStorage.setItem('userId', JSON.stringify(session.user));
      localStorage.setItem('session', JSON.stringify(session));
    } else {
      console.log('Invalid session given.');
    }
  },

  logout: () => {
    localStorage.removeItem('session');
  }
}

module.exports = LocalStorage
