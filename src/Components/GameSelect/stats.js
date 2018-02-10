import { color } from '../../Library/Styles/index';

export const stats = {
  leaderboards: [
    {
      slug: 'earth',
      image: require('../../Library/Images/icon-earth.png'),
      color: color.mainBlue,
      seed: '438th'
    },
    {
      slug: 'school',
      image: require('../../Library/Images/icon-house.png'),
      color: color.red,
      seed: '42nd'
    }
  ],  
  progress: [
    {
      name: 'POINTS',
      slug: 'starCount',
      image: require('../../Library/Images/icon-star.png'),
      color: color.yellow,
      seed: '8331'
    },
    {
      name: 'WORDS',
      slug: 'wordsLearned',
      image: require('../../Library/Images/icon-book.png'),
      color: color.green,
      seed: '1304'
    },
    {
      name: 'ACCURACY',
      slug: 'accuracy',
      image: require('../../Library/Images/icon-archer-purple.png'),
      color: color.purple,
      seed: '87%'
    },
    {
      name: 'LEVELS COMPLETED',
      slug: 'levelsCompleted',
      image: require('../../Library/Images/icon-stair.png'),
      color: color.green,
      seed: '8/100  '
    }
  ]
}
