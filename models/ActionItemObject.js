/// <reference path="../models/CurrencyObject.js" />

class ActionItemObject {
  constructor(spec) {
    this.id = spec.id === undefined ? 0 : spec.id;
    this.order = spec.order === undefined ? 0 : spec.order;
    this.icon = spec.icon === undefined ? '' : spec.icon;
    this.name = spec.name === undefined ? 'Reward' : spec.name;
    this.description = spec.description === undefined ? '' : spec.description;
    this.count = spec.count === undefined ? 0 : spec.count;
    this.currency = spec.currency === undefined ? Currencies.gem : spec.currency;
    this.maxCount = spec.maxCount === undefined ? 10 : spec.maxCount;
    this.cost = spec.cost === undefined ? 250 : spec.cost;
  }
}

let ActonItems = [
  new ActionItemObject({
    id: 1,
    order: 0,
    icon: '🔎',
    name: 'Auto Hint',
    description: 'Forgives a failure and highlights a mistake',
    cost: 500,
    count: UseDebug ? 0 : 0,
    maxCount: 10,
  }),
  new ActionItemObject({
    id: 4,
    order: 1,
    icon: '🎟️',
    name: 'Clear Level',
    description: 'Gives one perfect level clear, no matter what',
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
    maxCount: 1,
    cost: 12500,
    count: UseDebug ? 0 : 0,
  }),
];
