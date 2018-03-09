import { color } from '../../Library/Styles/index';

export const alerts = {
  speedy: {
    name: 'speedy!',
    color: color.red,
    image: require('../../Library/Images/speedy.png')
  },
  passed: {
    name: 'passed',
    color: color.green,
    image: require('../../Library/Images/Checkmark-Green.png')
  },
  correct: {
    name: 'correct!',
    color: color.warmYellow,
    image: require('../../Library/Images/star-yellow.png')
  }
}