/// <reference path="../models/PieceObject.js" />

class ModeObject {
  constructor(spec) {
    this.name = spec.name;
    this.piece = spec.piece;
    this.isSelected = spec.isSelected == undefined ? false : spec.isSelected;
  }
}

var Modes = {
  infinite: new ModeObject({
    name: 'infinite',
    piece: new PieceObject({
      shape: 'var(--infinity)',
      color: Colors[getRandomInt(0, Colors.length)],
      backgroundImage: 'var(--bgImage4)',
    }),
  }),
  easy: new ModeObject({
    name: 'easy',
    piece: new PieceObject({
      shape: Shapes[getRandomInt(0, Shapes.length)],
      color: Colors[getRandomInt(0, Colors.length)],
      backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)],
    }),
    isSelected: true,
  }),
  hard: new ModeObject({
    name: 'hard',
    piece: new PieceObject({
      shape: Shapes[getRandomInt(0, Shapes.length)],
      color: Colors[getRandomInt(0, Colors.length)],
      backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)],
    }),
  }),
};
