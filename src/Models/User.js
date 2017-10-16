import axios from 'axios';

import CONFIG from '../Config/main';

const href = `${CONFIG.ACCOUNTS_API}/user`

const fetch = async (query) => {
  try {
    return query.type === 'id'
      ? await axios.get(`${href}/${query.value}`)
      : await axios.get(`${href}${query.value}`);
  } catch (e) {
    return e.response.data;
  }
}

const createAccount = async (data) => {
  try {
    return await axios.post(`${href}/create`, data);
  } catch (e) {
    return e.response.data;
  }
}

const login = async (data) => {
  try {
    return await axios.post(`${href}/login`, data);
  } catch (e) {
    return e.response.data;
  }
}

const saveStats = (id, stats) => {
  try {
    const params = {
      id: id,
      stats: stats,
      platform: 'web'
    }
    console.log(params)
    axios.post(href, stats);
  } catch (e) {
    console.log(e)
  }
}

const User = {
  createAccount: createAccount,
  login: login,
  fetch: fetch,
  saveStats: saveStats
}

export default User;
