import axios from 'axios';

import CONFIG from '../Config/main';

const href = `${CONFIG.ACCOUNTS_API}/user`

const fetch = async (id) => {
  try {
    return await axios.get(`${href}/${id}`);
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
    axios.post(`${href}login`, stats);
  } catch (e) {
    console.log(e)
  }
}

const User = {
  createAccount: createAccount,
  login: login,
  fetch
}

export default User;
