const times = [3, 5];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const topics = [
  { slug: 'everything', displayName: 'Everything' },
  { slug: 'esl', displayName: 'ESL' },
  { slug: 'gre', displayName: 'GRE' },
  { slug: 'medicine', displayName: 'Medicine' },
  { slug: 'humanity', displayName: 'Humanity' },
  { slug: 'sat-act', displayName: 'SAT/ACT' },
  { slug: 'science', displayName: 'Science' },
  { slug: 'zoology', displayName: 'Zoology' }
]

module.exports = {
  SETTINGS: {
    TIME: times,
    LEVEL: levels,
    TOPIC: topics
  }
};
