import axios from 'axios';
import CONFIG from '../Config/main';

const forTeacher = async (id) => {
  try {
    return await axios.get(`${CONFIG.ACCOUNTS_API}/class?teacher=${id}`);
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
  forTeacher: forTeacher,
  students: studentsInClass
}

export default Class;
