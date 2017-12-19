const LocalStorage = {
  getSession: () => {
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session) : undefined;
  },

  setSession: (session) => {
    if (session) {
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
