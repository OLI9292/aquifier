import _ from 'underscore';
import axios from 'axios';

import CONFIG from '../Config/main';

const href = `${CONFIG.WORDS_API}`

const fetch = async (query) => {
  try {
    if (query) {

    } else {
      return await axios.get(`${href}/words`);
    }
  } catch (e) {
    return e.response.data;
  }
}

const Word = {
  fetch: fetch
}

/*const Word = async (val, data) => {



  const roots = data['components'].filter((c) => c.type === 'root');
  const categories = _.has(data, 'categories') ? data['categories'].split(',') : [];
  const components = data['components'];
  const definition = data['definition'];

  const obj = { value: val, categories: categories, components: components, definition: definition, roots: roots };

  if (_.isUndefined(val) || _.isEmpty(roots)) {
    return seed;
  }

  return obj;
}*/

export default Word;
