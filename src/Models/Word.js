import _ from 'underscore';

const Word = (val, data) => {
  const roots = data['components'].filter((c) => c.type === 'root');
  const categories = _.has(data, 'categories') ? data['categories'].split(',') : [];
  const components = data['components'];
  const definition = data['definition'];

  const obj = { value: val, categories: categories, components: components, definition: definition, roots: roots };

  if (_.isUndefined(val) || _.isEmpty(roots)) {
    return seed;
  }

  return obj;
}

const val = 'cephalapod';
const data = {
  components: [
    {
      value: 'ceph',
      type: 'root'
    },
    {
      value: 'ala',
      type: 'unknown'
    },
    {
      value: 'pod',
      type: 'root'
    }
  ],
  definition: [
    {
      value: 'has a head',
      isRoot: true
    },
    {
      value: ' and ',
      isRoot: false
    },
    {
      value: 'feet',
      isRoot: true
    }
  ]
};

const seed = Word(val, data);

export default Word;
