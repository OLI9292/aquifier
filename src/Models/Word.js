import _ from 'underscore';
import axios from 'axios';
import CONFIG from '../Config/main';

const Word = (val, data) => {
  
  const roots = data['components'].filter((c) => c.type === 'root');
  const categories = _.has(data, 'categories') ? data['categories'].split(',') : [];
  const components = data['components'];
  const definition = data['definition'];
  
  return {
    value: val,
    categories: categories,
    components: components,
    definition: definition,
    roots: roots
  };
}

/*const fetch = async (query) => {
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
}*/

export default Word;
