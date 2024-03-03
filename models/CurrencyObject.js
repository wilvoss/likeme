/// <reference path="../helpers/console-enhancer.js" />
class CurrencyObject {
  constructor(spec) {
    this.id = spec.id === undefined ? 0 : spec.id;
    this.name = spec.name === undefined ? '' : spec.name;
    this.labor = spec.labor === undefined ? '' : spec.labor;
    this.pluralName = spec.pluralName === undefined ? '' : spec.pluralName;
    this.icon = spec.icon === undefined ? '' : spec.icon;
    this.increment = spec.increment === undefined ? 1000 : spec.increment;
    this.count = spec.count === undefined ? 0 : spec.count;
    this.maxCount = spec.maxCount === undefined ? 500000 : spec.maxCount;
    this.isEnabled = spec.isEnabled === undefined ? false : spec.isEnabled;
  }
}
let Currencies = [
  new CurrencyObject({
    id: 1,
    name: 'Gem',
    pluralName: 'Gems',
    labor: 'One level is worth 10 gems. Clearing all levels in one game is worth an additional 1,000 gems. ',
    icon: '💎',
    count: UseDebug ? 1000 : 1000,
    isEnabled: true,
  }),
  new CurrencyObject({
    id: 2,
    name: 'Key',
    pluralName: 'Keys',
    labor: '1 key is earned for every 5 unassisted levels cleared.',
    icon: '🔑',
    count: 0,
  }),
  new CurrencyObject({
    id: 3,
    name: 'Coin',
    pluralName: 'Coins',
    icon: '🪙',
    count: 0,
  }),
];

class Currency {
  Update(_currency, _amount) {
    note('Currency.Update() called');
    return _currency;
  }
}
