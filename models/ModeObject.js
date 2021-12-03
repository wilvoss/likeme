class ModeObject {
  constructor(spec) {
    this.name = spec.name == undefined ? '' : spec.name;
    this.numberOfPieces = spec.numberOfPieces = undefined ? 16 : spec.numberOfPieces;
  }
}

var Modes = [
  new ModeObject({
    name: 'Easy',
  }),

  new ModeObject({
    name: 'Hard',
  }),
];
