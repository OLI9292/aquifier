import _ from 'underscore';

export const STEPS = [
  {
    index: 1,
    name: 'gameType',
    header: 'choose game type',
    options: ['general vocabulary', 'topics', 'roots']
  },
  {
    index: 2,
    name: 'level',
    header: 'choose level',
    options: []
  },
  {
    index: 3,
    name: 'time',
    header: 'choose time',
    options: _.map(_.range(1,10,2), n => `${n} minutes`)
  },
  {
    index: 4,
    name: 'matchPreview',
    header: 'match preview',
    options: ['create match']
  }   
]
