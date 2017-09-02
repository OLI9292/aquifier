import _ from 'underscore';

const Word = (val, data) => {
  return {
    value: val,
    categories: _.has(data, 'categories') ? data['categories'].split(',') : [],
    components: data['components'],
    definition: data['definition'],
    roots: data['components'].filter((c) => c.type === 'root')
  }
}

export default Word;
