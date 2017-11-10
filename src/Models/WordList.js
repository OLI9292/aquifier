import axios from 'axios';
import CONFIG from '../Config/main';

const fetch = async () => {
  try {
    return await axios.get(`${CONFIG.WORDS_API}/word-lists`);
  } catch (e) {
    return e.response.data;
  }
}  

const create = async (data) => {
  try {
    return await axios.post(`${CONFIG.WORDS_API}/word-lists`, data);
  } catch (e) {
    return e.response.data;
  }
}

const deleteWordList = async (id) => {
  try {
    return await axios.delete(`${CONFIG.WORDS_API}/word-lists/${id}`);
  } catch (e) {
    return e.response.data;
  }
} 

const update = async (id, data) => {
  try {
    return await axios.patch(`${CONFIG.WORDS_API}/word-lists/${id}`, data);
  } catch (e) {
    return e.response.data;
  }
} 

const WordList = {
  create: create,
  fetch: fetch,
  delete: deleteWordList,
  update: update
}

export default WordList;
