import axios from 'axios';

import CONFIG from '../Config/main';

const createAccount = async (data) => {
  try {
    return await axios.post(`${CONFIG.ACCOUNTS_API}/user/create`, data);
  } catch (e) {
    return e.response.data;
  }
}

const login = async (data) => {
  try {
    return await axios.post(`${CONFIG.ACCOUNTS_API}/user/login`, data);
  } catch (e) {
    return e.response.data;
  }
}

const User = {
  createAccount: createAccount,
  login: login
}

export default User;
