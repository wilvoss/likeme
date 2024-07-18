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
    hue: 48,
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

/// <reference path="../helpers/console-enhancer.js" />
/// <reference path="../models/PieceObject.js" />

class TutorialStepObject {
  constructor(spec) {
    this.title = spec.title == undefined ? 'Title' : spec.title;
    this.description = spec.description == undefined ? 'Description' : spec.description;
    this.unreveal = spec.unreveal == undefined ? false : spec.unreveal;
    this.partial = spec.partial == undefined ? false : spec.partial;
    this.describe = spec.describe == undefined ? false : spec.describe;
    this.checkBoard = spec.checkBoard == undefined ? false : spec.checkBoard;
  }
}

var TutorialSteps = [
  new TutorialStepObject({
    title: 'Hi! This is Me.',
    description: 'I live inside this button.',
    unreveal: true,
  }),
  new TutorialStepObject({
    title: 'This is still Me.',
    description: 'I change every level.',
    unreveal: true,
  }),
  new TutorialStepObject({
    title: 'This is a level.',
    description: 'Some of these pieces are "like" Me.',
  }),
  new TutorialStepObject({
    title: 'These 4 are like me!',
    description: 'They are the only ones that share <b>at least 2</b> of my attributes: color, shape, or pattern.',
    partial: true,
    describe: true,
  }),
  new TutorialStepObject({
    title: 'So now what?',
    description: 'Select all of the pieces like Me (hint, the top 4) and then click Me to clear the level. Hit <b>BACK</b> if you get stuck.',
    checkBoard: true,
  }),
  new TutorialStepObject({
    title: "That's it!",
    description: 'Clear as many levels as possible before the clock runs out. Perfect clears add bonus time.',
    unreveal: true,
  }),
];

class ScoreObject {
  constructor(spec) {
    this.date = spec.date === undefined ? new Date() : spec.date;
    this.modeId = spec.modeId === undefined ? '' : spec.modeId;
    this.rankId = spec.rankId === undefined ? 0 : spec.rankId;
    this.modeName = spec.modeName === undefined ? '' : spec.modeName;
    this.numberOfClears = spec.numberOfClears === undefined ? 0 : spec.numberOfClears;
    this.numberOfPerfectClears = spec.numberOfPerfectClears === undefined ? 0 : spec.numberOfPerfectClears;
    this.totalPossibleClears = spec.totalPossibleClears === undefined ? -1 : spec.totalPossibleClears;
    this.dailyDate = spec.dailyDate === undefined ? new Date() : spec.dailyDate;
    this.isCurrent = spec.isCurrent === undefined ? false : spec.isCurrent;
    this.isDaily = spec.isDaily === undefined ? false : spec.isDaily;
    this.value = spec.value === undefined ? -1 : spec.value;
    this.streak = spec.streak === undefined ? 0 : spec.streak;
  }
}

/// <reference path="../helpers/console-enhancer.js" />
class CurrencyObject {
  constructor(spec) {
    this.id = spec.id === undefined ? 0 : spec.id;
    this.name = spec.name === undefined ? '' : spec.name;
    this.labor = spec.labor === undefined ? '' : spec.labor;
    this.pluralName = spec.pluralName === undefined ? '' : spec.pluralName;
    this.className = spec.className === undefined ? '' : spec.className;
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
    className: 'gem',
    count: UseDebug ? 1000 : 1000,
    isEnabled: true,
  }),
  new CurrencyObject({
    id: 2,
    name: 'Key',
    pluralName: 'Keys',
    labor: '1 key is earned for every 5 unassisted levels cleared.',
    count: 0,
  }),
  new CurrencyObject({
    id: 3,
    name: 'Coin',
    pluralName: 'Coins',
    count: 0,
  }),
];

class Currency {
  Update(_currency, _amount) {
    note('Currency.Update() called');
    return _currency;
  }
}

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
    name: 'AUTO HINT',
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
    name: 'CLEAR LEVEL',
    description: 'Gives one perfect level',
    explanation: 'Forgives all mistakes made on the current level, solves it perfectly, and then advances you to the next level. You must tap in-game to spend.',
    maxCount: 4,
    cost: 2500,
    count: UseDebug ? 0 : 0,
  }),
  new ActionItemObject({
    id: 3,
    order: 2,
    icon: '⌛️',
    name: 'ADD &nbsp;10s',
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
    name: 'ADD &nbsp;30s',
    description: 'Adds 30 seconds',
    explanation: "It's possible to add a total of 60 seconds with this single-use powerup when combined with the 10 second one. You must tap in-game to spend. Use it wisely.",
    maxCount: 1,
    cost: 12500,
    count: UseDebug ? 0 : 0,
  }),
];

class ThemeObject {
  constructor(spec) {
    this.name = spec.name == undefined ? '' : spec.name;
    this.color1 = spec.color1;
    this.color2 = spec.color2;
    this.color3 = spec.color3;
    this.color3contrast = spec.color3contrast == undefined ? 'white' : spec.color3contrast;
    this.darkPatternHSL = spec.darkPatternHSL == undefined ? '0, 0%, 0%' : spec.darkPatternHSL;
    this.darkBlendMode = spec.darkBlendMode == undefined ? 'soft-light' : spec.darkBlendMode;
    this.darkPatternOpacity = spec.darkPatternOpacity == undefined ? 1 : spec.darkPatternOpacity;
    this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
  }
}

var Themes = [
  new ThemeObject({
    name: 'Awake',
    color1: 'hsl(313, 44%, 25%)',
    color2: 'hsl(187, 42%, 46%)',
    color3: 'hsl(64, 60%, 49%)',
    color3contrast: 'black',
    isSelected: true,
  }),
  new ThemeObject({
    name: 'Aware',
    color1: 'rgb(138 33 115)',
    color2: 'rgb(37 174 193)',
    color3: 'rgb(209 224 0)',
    color3contrast: 'black',
  }),
  new ThemeObject({
    name: 'Calm',
    color1: 'rgb(117 93 122)',
    color2: 'rgb(68 130 155)',
    color3: 'rgb(167, 177, 119)',
  }),
  new ThemeObject({
    name: 'Intent',
    color1: 'hsl(0, 0%, 15%)',
    color2: 'hsl(0, 0%, 46%)',
    color3: 'hsl(0, 0%, 70%)',
    color3contrast: 'black',
    darkPatternOpacity: 0.5,
    darkPatternHSL: '0, 0%, 0%',
    darkBlendMode: 'overlay',
  }),
  new ThemeObject({
    name: 'Keen',
    color1: 'rgb(0 184 255)',
    color2: 'rgb(0 222 0) ',
    color3: 'rgb(255, 112, 227)',
  }),
  new ThemeObject({
    name: 'Content',
    color1: 'rgb(0 202 234)',
    color2: 'rgb(84, 184, 0)',
    color3: 'rgb(184 222 0)',
    color3contrast: 'rgb(56, 122, 0)',
  }),
  new ThemeObject({
    name: 'Alive',
    color1: 'rgb(0 136 8)',
    color2: 'rgb(0 176 243)',
    color3: 'rgb(239 216 0)',
    color3contrast: 'rgb(0 136 8)',
  }),
  new ThemeObject({
    name: 'Wise',
    color1: 'rgb(145 97 21)',
    color2: 'rgb(104 195 156)',
    color3: 'rgb(234 145 4)',
    darkPatternHSL: '0, 0%, 50%',
    darkBlendMode: 'luminosity',
  }),
  new ThemeObject({
    name: 'Moody',
    color1: 'rgb(96, 0, 117)',
    color2: 'rgb(204, 17, 110)',
    color3: 'rgb(255, 127, 78)',
    darkPatternHSL: '0, 0%, 50%',
    darkBlendMode: 'luminosity',
  }),
  new ThemeObject({
    name: 'Mellow',
    color1: 'rgb(58, 93, 66)',
    color2: 'rgb(79, 159, 198)',
    color3: 'rgb(134, 219, 162)',
    color3contrast: 'rgb(58, 93, 66)',
  }),
  new ThemeObject({
    name: 'Antsy',
    color1: 'rgb(129, 32, 0)',
    color2: 'rgb(255, 0, 0)',
    color3: 'rgb(255, 159, 0)',
    darkPatternHSL: '0, 0%, 50%',
    darkBlendMode: 'luminosity',
  }),
  new ThemeObject({
    name: 'Sullen',
    color1: 'rgb(66, 39, 110)',
    color2: 'rgb(74, 116, 150)',
    color3: 'rgb(134, 198, 165)',
    darkPatternOpacity: 0.5,
  }),
];

class PieceObject {
  constructor(spec) {
    this.shape = spec.shape == undefined ? 'var(--shape1)' : spec.shape;
    this.color = spec.color == undefined ? 'var(--color1)' : spec.color;
    this.backgroundImage = spec.backgroundImage == undefined ? 'var(--bgImage1)' : spec.backgroundImage;
    this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
    this.hasDropped = spec.hasDropped == undefined ? false : spec.hasDropped;
    this.delay = spec.delay == undefined ? 0 : spec.delay;
    this.nudge = spec.nudge == undefined ? false : spec.nudge;
    this.isMatch = spec.isMatch == undefined ? false : spec.isMatch;
    this.isFullMatch = spec.isFullMatch == undefined ? false : spec.isFullMatch;
    this.description = spec.description == undefined ? '' : spec.description;
  }
}

var Shapes = ['var(--shape1)', 'var(--shape2)', 'var(--shape3)', 'var(--shape4)'];
var Colors = ['var(--color1)', 'var(--color2)', 'var(--color3)'];
var BackgroundImages = ['var(--bgImage1)', 'var(--bgImage2)', 'var(--bgImage3)', 'var(--bgImage4)'];

/// <reference path="../models/PieceObject.js" />

class ModeObject {
  constructor(spec) {
    this.id = spec.id;
    this.name = spec.name;
    this.description = spec.description == undefined ? 'This is a game mode.' : spec.description;
    this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
    this.starttime = spec.starttime == undefined ? 0 : spec.starttime;
    this.bonustime = spec.bonustime == undefined ? 0 : spec.bonustime;
    this.highscores = spec.highscores == undefined ? [] : spec.highscores;
    this.useBatThwap = spec.useBatThwap == undefined ? false : spec.useBatThwap;
    this.endGameTitle = spec.endGameTitle == undefined ? 'Game Over' : spec.endGameTitle;
    this.endGameConsolationMessage = spec.endGameConsolationMessage == undefined ? '' : spec.endGameConsolationMessage;
  }
}

const BatThwaps = [
  'AIEEE!',
  'AIIEEE!',
  'ARRRGH!',
  'AWK!',
  'AWKKKKKK!',
  'BAM!',
  'BANG!',
  'BANG-ETH!',
  'BAP!',
  'BIFF!',
  'BLOOP!',
  'BLURP!',
  'BONK!',
  'CLANK!',
  'CLANGE!',
  'CLANK-EST!',
  'CLASH!',
  'CLUNK!',
  'CLUNK-ETH!',
  'CRAAACK!',
  'CRASH!',
  'CRRAAACK!',
  'CRUNCH!',
  'CRUNCH-ETH!',
  'EEE-YOW!',
  'FLRBBBBB!',
  'GLIPP!',
  'GLURPP!',
  'KAPOW!',
  'KAYO!',
  'KER-PLOP!',
  'KER-SPLOOSH!',
  'KLONK!',
  'KRUNCH!',
  'OOOFF!',
  'OOOOFF!',
  'OUCH!',
  'OUCH-ETH!',
  'OWWW!',
  'OW-ETH!',
  'PAM!',
  'PLOP!',
  'POW!',
  'POWIE!',
  'QUNCKKK!',
  'RAKKK!',
  'RIP!',
  'SLOSH!',
  'SOCK!',
  'SPLAAT!',
  'SPLATT!',
  'SPLOOSH!',
  'SWAAP!',
  'SWISH!',
  'SWOOSH!',
  'THUNK!',
  'THWACK!',
  'THWACKEL!',
  'THWAPE!',
  'THWAPP!',
  'TOUCHÉ!',
  'UGGH!',
  'URKK!',
  'URKKK!',
  'VRONK!',
  'WHACK!',
  'WHACK-ETH!',
  'WHAM-ETH!',
  'WHAMM!',
  'WHAMMM!',
  'WHAP!',
  'ZAM!',
  'ZAMM!',
  'ZAMMM!',
  'ZAP!',
  'ZAP-ETH',
  'ZGRUPPP!',
  'ZLONK!',
  'ZLOPP!',
  'ZLOTT!',
  'ZOK!',
  'ZOWIE!',
  'ZWAPP!',
  'Z-ZWAP!',
  'Z-Z-Z-Z-WAP!',
  'ZZZZZWAP!',
];

var Modes = [
  new ModeObject({
    id: 'infinite',
    name: 'Zen Mode',
    description: 'Zen Mode is untimed and stress free.',
    endGameConsolationMessage: 'Find your inner zen.',
  }),
  new ModeObject({
    id: 'normal',
    name: 'Basic Mode',
    description: 'Basic Mode starts with a 1 minute timer.',
    starttime: 61000,
    isSelected: true,
    bonustime: 3000,
  }),
];

/// <reference path="../helpers/console-enhancer.js" />
/// <reference path="../helpers/seedrandom.js" />
/// <reference path="../models/PieceObject.js" />

class SingleLevelObject {
  constructor(spec) {
    this.me = spec.me == undefined ? new PieceObject({}) : spec.me;
    this.board = spec.board == undefined ? [] : spec.board;
    this.completed = spec.completed == undefined ? false : spec.completed;
  }
}

class AllLevelsObject {
  constructor(spec) {
    this.allLevelsSource = spec.allLevelsSource == undefined ? '' : spec.allLevelsSource;
    this.allLevels = spec.allLevels == undefined ? [] : spec.allLevels;
    // this.started = spec.started == undefined ? false : spec.started;
    // this.completed = spec.completed == undefined ? false : spec.completed;
    this.date = spec.date == undefined ? new Date() : spec.date;
  }
}

// creates a single string of numbers that can be mapped to a functioning AllLevelsObject
function createAllLevelsSource(_numOfLevels = 100) {
  let _levelSource = [];
  for (let i = 0; i < _numOfLevels; i++) {
    _levelSource.push(createLevelSource());
  }
  _levelSource = _levelSource.join('');
  return _levelSource;
}

// creates a single string of numbers that can be mapped to a function SingleLevelObject
function createLevelSource() {
  let _levelSource = [];
  for (let i = 0; i < 17; i++) {
    let _source = getRandomInt(0, Shapes.length) + '' + getRandomInt(0, Colors.length) + '' + getRandomInt(0, BackgroundImages.length);
    _levelSource.push(_source);
  }
  _levelSource = _levelSource.join('');
  return _levelSource;
}

function constructAllLevels(_source, _allLevelsObject) {
  _allLevelsObject.allLevelsSource = _source;
  var _piecesSources = _source.match(new RegExp('.{1,3}', 'g'));
  var _levelChunkSize = 17;
  var _levelSources = _piecesSources
    .map(function (e, i) {
      return i % _levelChunkSize === 0 ? _piecesSources.slice(i, i + _levelChunkSize) : null;
    })
    .filter(function (e) {
      return e;
    });
  _levelSources.forEach((_bs, i) => {
    _allLevelsObject.allLevels.push(constructLevel(_bs));
  });
}

// breaks a single string of numbers into me PieceObject and 16 fully realized board PieceObjects
function constructLevel(_bs, _splice = false) {
  if (_splice) {
    _bs = _bs.match(new RegExp('.{1,3}', 'g'));
  }

  let _level = new SingleLevelObject({});
  const _b = _bs[0].toString().split('');
  _level.me = new PieceObject({ shape: Shapes[_b[0]], color: Colors[_b[1]], backgroundImage: BackgroundImages[_b[2]] });

  for (let x = 1; x < _bs.length; x++) {
    const _s = _bs[x].toString().split('');
    let _piece = new PieceObject({ shape: Shapes[_s[0]], color: Colors[_s[1]], backgroundImage: BackgroundImages[_s[2]] });
    let _description = '';
    let _likeness = 0;
    if (_piece.color === _level.me.color) {
      _likeness++;
      _description = _description + '<b>color</b>';
    }
    if (_piece.shape === _level.me.shape) {
      _description = _description + '<b>shape</b>';
      _likeness++;
    }
    if (_piece.backgroundImage === _level.me.backgroundImage) {
      _description = _description + '<b>pattern</b>';
      _likeness++;
    }
    _piece.isMatch = _likeness > 1;
    _piece.isFullMatch = _likeness === 3;
    _piece.description = _description;

    _level.board.push(_piece);
  }
  return _level;
}
