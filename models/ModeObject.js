/// <reference path="../models/PieceObject.js" />

class ModeObject {
  constructor(spec) {
    this.id = spec.id;
    this.name = spec.name;
    this.description = spec.description == undefined ? 'This is a game mode.' : spec.description;
    this.piece = spec.piece;
    this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
    this.scoreMultiplier = spec.scoreMultiplier == undefined ? 2 : spec.scoreMultiplier;
    this.starttime = spec.starttime == undefined ? 0 : spec.starttime;
    this.bonustime = spec.bonustime == undefined ? 0 : spec.bonustime;
    this.highscores = spec.highscores == undefined ? [] : spec.highscores;
    this.isHidden = spec.isHidden == undefined ? false : spec.isHidden;
    this.useBatThwap = spec.useBatThwap == undefined ? false : spec.useBatThwap;
    this.endGameTitle = spec.endGameTitle == undefined ? 'Game over' : spec.endGameTitle;
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
    description: 'Untimed matching with no pressure.',
    piece: new PieceObject({
      shape: 'var(--infinity)',
      color: Colors[2],
      backgroundImage: 'var(--bgImage4)',
    }),
    endGameTitle: '☯',
    endGameConsolationMessage: 'Find your inner zen.',
  }),
  new ModeObject({
    id: 'normal',
    name: 'Basic Mode',
    description: 'Game starts with a 3 minute countdown.',
    piece: new PieceObject({
      shape: Shapes[3],
      color: Colors[1],
      backgroundImage: BackgroundImages[0],
    }),
    scoreMultiplier: 1,
    starttime: 181000,
    isSelected: true,
    bonustime: 3000,
  }),
  new ModeObject({
    id: 'blitz',
    name: 'Sudden Death',
    description: '1 minute, no mistakes, no bonuses!',
    piece: new PieceObject({
      shape: Shapes[2],
      color: Colors[0],
      backgroundImage: BackgroundImages[2],
    }),
    starttime: 61000,
    useBatThwap: true,
    endGameConsolationMessage: 'That was fast.',
    scoreMultiplier: 4,
  }),
  new ModeObject({
    id: 'hard',
    name: 'Hard Mode',
    description: 'Like Normal, but pieces change randomly.',
    piece: new PieceObject({
      shape: Shapes[0],
      color: Colors[2],
      backgroundImage: BackgroundImages[2],
    }),
    starttime: 61000,
    isHidden: true,
    bonustime: 3000,
  }),
];
