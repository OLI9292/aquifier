import CONFIG from '../Config/main';
import axios from 'axios';

const fetch = async (query) => {
  try {
    return await axios.get(`${CONFIG.WORDS_API}/roots`);
  } catch (e) {
    return e.response.data;
  }
}

const Root = {
  fetch: fetch
}

export default Root;
