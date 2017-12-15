import axios from 'axios';

import CONFIG from '../Config/main';

const href = `${CONFIG.ACCOUNTS_API}/user`

const fetch = async (query) => {
  try {
    return query.type === 'id'
      ? await axios.get(`${href}/${query.value}`)
      : await axios.get(`${href}${query.value}`);
  } catch (error) {
    return { error: error };
  }
}

const createAccount = async (data) => {
  try {
    return await axios.post(`${href}/create`, data);
  } catch (error) {
    return { error: error }
  }
}

const login = async (data) => {
  try {
    return await axios.post(`${href}/login`, data)
  } catch (error) {
    return { error: error }
  }
}

const saveStats = async (id, stats, wordList) => {
  try {
    return await axios.patch(href, {
      id: id,
      stats: stats,
      platform: 'web',
      wordList: wordList
    })
  } catch (error) {
    return { error: error }
  }
}

const loggedIn = (attr) => {
  if (attr) {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed) {
        return parsed[attr];
      }
    }
    return null;
  }
  return localStorage.getItem('user') !== null;
}

const update = async (id, data) => {
  try {
    const result = await axios.patch(`${href}/${id}`, data);
    User.saveLocally(data);
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

const username = () => {
  if (User.loggedIn()) {
    return `${User.loggedIn('firstName')} ${User.loggedIn('lastName')}`;
  }
  return null;
}

const saveLocally = (data) => {
  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }
}

const User = {
  createAccount: createAccount,
  login: login,
  fetch: fetch,
  saveStats: saveStats,
  saveLocally: saveLocally,
  loggedIn: loggedIn,
  update: update,
  username: username
}

export default User;
