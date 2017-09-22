const times = [3, 5];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

const topics = [
  { slug: 'everything', displayName: 'Everything' },
  { slug: 'esl', displayName: 'ESL' },
  { slug: 'gre', displayName: 'GRE' },
  { slug: 'sat-act', displayName: 'SAT/ACT' },
  { slug: 'science', displayName: 'Science' },
  { slug: 'math', displayName: 'Math' },
  { slug: 'medicine', displayName: 'Medicine' },
  { slug: 'humanity', displayName: 'Humanity' },
  { slug: 'zoology', displayName: 'Zoology' },
  { slug: 'biology', displayName: 'Biology' },
  { slug: 'paleontology', displayName: 'Paleontology' },
  { slug: 'ecology', displayName: 'Ecology' },
  { slug: 'botany', displayName: 'Botany' },
  { slug: 'astronomy', displayName: 'Astronomy' },
  { slug: 'physics', displayName: 'Physics' },
  { slug: 'chemistry', displayName: 'Chemistry' },
  { slug: 'geology', displayName: 'Geology' },
  { slug: 'geography', displayName: 'Geography' },
  { slug: 'history', displayName: 'History' },
  { slug: 'sociology', displayName: 'Sociology' },
  { slug: 'law', displayName: 'Law' },
  { slug: 'economics', displayName: 'Economics' },
  { slug: 'mythology', displayName: 'Mythology' },
  { slug: 'psychology', displayName: 'Psychology' },
  { slug: 'philosophy', displayName: 'Philosophy' },
  { slug: 'dinosaurs', displayName: 'Dinosaurs' }
]

module.exports = {
  SETTINGS: {
    TIME: times,
    LEVEL: levels,
    TOPIC: topics
  }
};
