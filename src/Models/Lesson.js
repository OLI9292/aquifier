import _ from 'underscore';
import axios from 'axios';
import CONFIG from '../Config/main';

const create = async (data) => {
  try {
    return await axios.post(`${CONFIG.ACCOUNTS_API}/lesson`, data);
  } catch (e) {
    return e.response.data;
  }
}

const Lesson = {
  create: create
}

export default Lesson;
