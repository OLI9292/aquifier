import { color } from '../../Library/Styles/index';

export const stats = {
  leaderboards: [
    {
      slug: 'earth',
      image: require('../../Library/Images/archer.png'),
      color: color.mainBlue
    },
    {
      slug: 'school',
      image: require('../../Library/Images/archer.png'),
      color: color.red
    }
  ],  
  progress: [
    {
      name: 'POINTS',
      slug: 'starCount',
      image: require('../../Library/Images/archer.png'),
      color: color.yellow
    },
    {
      name: 'WORDS',
      slug: 'wordsLearned',
      image: require('../../Library/Images/archer.png'),
      color: color.green
    },
    {
      name: 'WORDS MASTERED',
      slug: 'wordsMastered',
      image: require('../../Library/Images/archer.png'),
      color: color.blue
    },
    {
      name: 'ACCURACY',
      slug: 'accuracy',
      image: require('../../Library/Images/archer.png'),
      color: color.purple
    },
    {
      name: 'ACCURACY PRIZES',
      slug: 'accuracyPrizes',
      image: require('../../Library/Images/archer.png'),
      color: color.blue
    },
    {
      name: 'LEVELS COMPLETED',
      slug: 'levelsCompleted',
      image: require('../../Library/Images/archer.png'),
      color: color.green
    },
    {
      name: 'LEVELS MASTERED',
      slug: 'levelsMastered',
      image: require('../../Library/Images/archer.png'),
      color: color.red
    }
  ]
}
