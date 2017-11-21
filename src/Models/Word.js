import axios from 'axios';
import CONFIG from '../Config/main';

const fetch = async (query) => {
  try {
    return await axios.get(`${CONFIG.WORDS_API}/words`);
  } catch (e) {
    return e.response.data;
  }
}

const relatedWords = async (data) => {
  try {
    return await axios.get(`${CONFIG.WORDS_API}/related-words?words=${data}`);
  } catch (e) {
    return e.response.data;
  }
}
  

const Word = {
  fetch: fetch,
  relatedWords: relatedWords
}

export default Word;
