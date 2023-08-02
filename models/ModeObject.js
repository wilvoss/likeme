/// <reference path="../models/PieceObject.js" />

class ModeObject {
  constructor(spec) {
    this.name = spec.name;
    this.description = spec.description == undefined ? 'This is a game mode.' : spec.description;
    this.piece = spec.piece;
    this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
  }
}

var Modes = {
  infinite: new ModeObject({
    name: 'Zen',
    description: 'Untimed matching with no pressure.',
    piece: new PieceObject({
      shape: 'var(--infinity)',
      color: Colors[getRandomInt(0, Colors.length)],
      backgroundImage: 'var(--bgImage4)',
    }),
  }),
  easy: new ModeObject({
    name: 'Easy',
    description: 'Game ends after three minutes.',
    piece: new PieceObject({
      shape: Shapes[getRandomInt(0, Shapes.length)],
      color: Colors[getRandomInt(0, Colors.length)],
      backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)],
    }),
    isSelected: true,
  }),
  hard: new ModeObject({
    name: 'Hard',
    description: 'Like Easy, but pieces change randomly.',
    piece: new PieceObject({
      shape: Shapes[getRandomInt(0, Shapes.length)],
      color: Colors[getRandomInt(0, Colors.length)],
      backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)],
    }),
  }),
};
