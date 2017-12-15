import axios from 'axios';
import CONFIG from '../Config/main';

const studentsInClass = async (id) => {
  try {
    return await axios.get(`${CONFIG.ACCOUNTS_API}/v2/auth/class/${id}/students`);
  } catch (e) {
    return e.response.data;
  }
}

const Class = {
  students: studentsInClass
}

export default Class;
