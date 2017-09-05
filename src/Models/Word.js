import _ from 'underscore';

const Word = (val, data) => {
  // TODO: - validation
  if (_.isUndefined(val)) {
  	return seed;
  }
  return {
    value: val,
    categories: _.has(data, 'categories') ? data['categories'].split(',') : [],
    components: data['components'],
    definition: data['definition'],
    flattened: _.flatten(data['components'].map((c) => c.value.split('').map((char) => ({ value: char, display: false })))),
    roots: data['components'].filter((c) => c.type === 'root')
  }
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
