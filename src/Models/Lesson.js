import axios from 'axios';
import CONFIG from '../Config/main';

const fetch = async (id) => {
  try {
    return await axios.get(`${CONFIG.ACCOUNTS_API}/lesson/${id}`);
  } catch (e) {
    return e.response.data;
  }
}

const create = async (data) => {
  try {
    return await axios.post(`${CONFIG.ACCOUNTS_API}/lesson`, data);
  } catch (e) {
    return e.response.data;
  }
}

const update = async (id, data) => {
  try {
    return await axios.patch(`${CONFIG.ACCOUNTS_API}/lesson/${id}`, data);
  } catch (e) {
    return e.response.data;
  }
}

const forTeacher = async (id) => {
  try {
    return await axios.get(`${CONFIG.ACCOUNTS_API}/lesson?teacher=${id}`);
  } catch (e) {
    return e.response.data;
  }
}

const forStudent = async (id) => {
  try {
    return await axios.get(`${CONFIG.ACCOUNTS_API}/lesson?student=${id || 'anon'}`);
  } catch (e) {
    return e.response.data;
  }
}

const deleteLesson = async (id) => {
  try {
    return await axios.delete(`${CONFIG.ACCOUNTS_API}/lesson/${id}`);
  } catch (e) {
    return e.response.data;
  }
}

const Lesson = {
  create: create,
  forTeacher: forTeacher,
  forStudent: forStudent,
  delete: deleteLesson,
  fetch: fetch,
  update: update
}

export default Lesson;
