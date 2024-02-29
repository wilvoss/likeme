/// <reference path="../models/CurrencyObject.js" />

class ActionItemObject {
  constructor(spec) {
    this.id = spec.id === undefined ? 0 : spec.id;
    this.order = spec.order === undefined ? 0 : spec.order;
    this.icon = spec.icon === undefined ? '' : spec.icon;
    this.name = spec.name === undefined ? 'Reward' : spec.name + ' <icon class="info"></icon> ';
    this.description = spec.description === undefined ? '' : spec.description;
    this.explanation = spec.explanation === undefined ? '' : spec.explanation;
    this.count = spec.count === undefined ? 0 : spec.count;
    this.currency = spec.currency === undefined ? Currencies[0] : spec.currency;
    this.maxCount = spec.maxCount === undefined ? 10 : spec.maxCount;
    this.cost = spec.cost === undefined ? 250 : spec.cost;
    this.isExpanded = spec.isExpanded === undefined ? false : spec.isExpanded;
  }
}

let ActonItems = [
  new ActionItemObject({
    id: 1,
    order: 0,
    icon: '🔎',
    name: 'Auto Hint',
    description: 'Highlights a mistake',
    explanation: 'Automatically highlights a mistake on the board after you try to solve the level. Also forgives that attempt.',
    cost: 500,
    count: UseDebug ? 0 : 0,
    maxCount: 10,
  }),
  new ActionItemObject({
    id: 4,
    order: 1,
    icon: '🎟️',
    name: 'Clear Level',
    description: 'Gives one perfect level',
    explanation: 'Forgives all mistakes made on the current level, solves it perfectly, and then advances you to the next level. You must tap in-game to spend.',
    maxCount: 4,
    cost: 2500,
    count: UseDebug ? 0 : 0,
  }), // new ActionItemObject({
  //   id: 2,
  //   order: 2,
  //   icon: '🗑️',
  //   name: 'Reset Level',
  //   description: 'All level mistakes cleared',
  //   cost: 1000,
  //   count: UseDebug ? 1 : 0,
  // }),
  new ActionItemObject({
    id: 3,
    order: 2,
    icon: '⌛️',
    name: 'Add 10&nbsp;sec',
    description: 'Adds 10 seconds',
    explanation: 'With a maximum of 3 in any given game, you can add a total of 30 seconds to the clock with this powerup! You must tap in-game to spend.',
    maxCount: 3,
    cost: 5000,
    count: UseDebug ? 1 : 0,
  }),
  new ActionItemObject({
    id: 5,
    order: 3,
    icon: '⌛️',
    name: 'Add 30&nbsp;sec',
    description: 'Adds 30 seconds',
    explanation: "It's possible to add a total of 60 seconds with this single-use powerup when combined with the 10 second one. You must tap in-game to spend. Use it wisely.",
    maxCount: 1,
    cost: 12500,
    count: UseDebug ? 0 : 0,
  }),
];
