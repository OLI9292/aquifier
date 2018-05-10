import _ from 'underscore';

const USERNAMES = [
  "flowerpotseptum",
  "snowballrearend",
  "anviljowl",
  "furnaceabdomen",
  "portalanus",
  "torcharmpit",
  "melonpinkie",
  "blazerodjoint",
  "sulphurankle",
  "potatocranium",
  "lilypadurethra",
  "bonemealpituitary",
  "birchwoodgland",
  "dandelionfemur",
  "carrotscerebrum",
  "leathervocal",
  "slimeballcalf",
  "wheatlumbar",
  "trapdoorblood",
  "clockearlobe",
  "obsidiandeltoid",
  "spongetibia",
  "redstonegyrus",
  "charcoalcheek"
];

const SPEEDS = {
  slow: {
    elo: 1000,
    speed: 6
  },
  fast: {
    elo: 4000,
    speed: 2
  }
};

const pointsForQuestion = () => _.sample(_.flatten([
  Array(3).fill(0),
  Array(14).fill(1),
  Array(3).fill(2)
]))

const randomElo = () => {
  const random = Math.random();

  if (random > 0.95) {
    return _.random(3500, 4000);
  } else if (random < 0.05) {
    return _.random(1000, 1500);
  } else if (random > 0.85) {
    return _.random(3000, 3500);
  } else if (random < 0.15) {
    return _.random(1500, 2000);
  } else {
    return _.random(2000, 3000);
  }
};

const speedForElo = elo => {
  const { slow, fast } = SPEEDS;
  const eloDiff = fast.elo - slow.elo;
  const speedDiff = fast.speed - slow.speed;
  return slow.speed + (((elo - slow.elo) / eloDiff) * (fast.speed - slow.speed));
};

export default class Bot {
  constructor(questionsCount, username, elo) {
    this.questionsCount = questionsCount;
    this.questionIndex = 0;
    this.elo = elo || randomElo();
    this.username = username || _.sample(USERNAMES);
    this.speed = speedForElo(this.elo);
  }

  randomSpeed() {
    return (this.speed + (Math.random() * (Math.random() > 0.5 ? 1 : -1))) * 1000;
  }

  progress() {
    return this.questionIndex / this.questionsCount;
  }

  nextQuestion() {
    this.questionIndex = this.questionIndex + (Math.random() > 0.8 ? 2 : 1);
  }
};
