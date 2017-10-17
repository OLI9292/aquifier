import _ from 'underscore';
import axios from 'axios';
import CONFIG from '../Config/main';

const fetch = async (id) => {
  try {
    return await axios.get(`${CONFIG.ACCOUNTS_API}/class/${id}`);
  } catch (e) {
    return e.response.data;
  }
}

const studentsInClass = async (id) => {
  try {
    return await axios.get(`${CONFIG.ACCOUNTS_API}/class/${id}/students`);
  } catch (e) {
    return e.response.data;
  }
}

const Class = {
  fetch: fetch,
  students: studentsInClass
}

export default Class;