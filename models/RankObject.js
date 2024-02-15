class RankObject {
  constructor(spec) {
    this.rank = spec.rank === undefined ? -1 : spec.rank;
    this.name = spec.name === undefined ? 'Novice' : spec.name;
    this.levels = spec.levels === undefined ? 10 : spec.levels;
    this.hue = spec.hue === undefined ? 0 : spec.hue;
    this.emoji = spec.emoji === undefined ? '' : spec.emoji;
  }
}

let AllPlayerRanks = [
  new RankObject({
    rank: 0,
    levels: 5,
    emoji: '🧺',
    name: 'Casual Classifier',
    hue: 50,
  }),
  new RankObject({
    rank: 1,
    levels: 10,
    emoji: '🧸',
    name: 'Serviceable Spotter',
    hue: 80,
  }),
  new RankObject({
    rank: 2,
    levels: 15,
    emoji: '📚',
    name: 'Decent Discerner',
    hue: 200,
  }),
  new RankObject({
    rank: 3,
    levels: 20,
    emoji: '🎓',
    name: 'Marvelous Matcher',
    hue: 270,
  }),
  new RankObject({
    rank: 4,
    levels: 30,
    emoji: '🧐',
    name: 'Wicked Watcher',
    hue: 320,
  }),
  new RankObject({
    rank: 5,
    levels: 50,
    emoji: '🧙‍♀️',
    name: 'Precise Pinpointer',
    hue: 350,
  }),
  new RankObject({
    rank: 6,
    levels: 75,
    emoji: '🦄',
    name: 'Super Selector!',
    hue: 140,
  }),
];
