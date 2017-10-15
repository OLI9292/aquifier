import _ from 'underscore';
import axios from 'axios';
import CONFIG from '../Config/main';

const fetch = async (query) => {
  try {
    if (query) {

    } else {
      return await axios.get(`${CONFIG.WORDS_API}/words`);
    }
  } catch (e) {
    return e.response.data;
  }
}

const Word = {
  fetch: fetch
}

export default Word;
