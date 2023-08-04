/// <reference path="../helpers/console-enhancer.js" />
/// <reference path="../models/PieceObject.js" />

class SingleLevelObject {
  constructor(spec) {
    this.me = spec.me == undefined ? new PieceObject({ shape: Shapes[(0)[0]], color: Colors[(0)[1]], backgroundImage: BackgroundImages[(0)[2]] }) : spec.me;
    this.board = spec.board == undefined ? [] : spec.board;
    this.completed = spec.completed == undefined ? false : spec.completed;
  }
}

class AllLevelsObject {
  constructor(spec) {
    this.allLevelsSource = createAllLevelsSource();
    this.allLevels = spec.level == undefined ? [] : spec.level;
    this.completed = spec.completed == undefined ? false : spec.completed;
    this.date = new Date();
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

function constructAllLevels(_source, _levels) {
  var _piecesSources = _source.match(new RegExp('.{1,3}', 'g'));
  console.log(_piecesSources);

  var _levelChunkSize = 17;
  var _levelSources = _piecesSources
    .map(function (e, i) {
      return i % _levelChunkSize === 0 ? _piecesSources.slice(i, i + _levelChunkSize) : null;
    })
    .filter(function (e) {
      return e;
    });

  _levelSources.forEach((_bs, i) => {
    _levels.push(constructLevel(_bs));
  });
}

// breaks a single string of numbers into me PieceObject and 16 fully realized board PieceObjects
function constructLevel(_bs, _splice = false) {
  if (_splice) {
    _bs = createLevelSource();
    _bs = _bs.match(new RegExp('.{1,3}', 'g'));
  }

  let _level = new SingleLevelObject({});
  const _b = _bs[0].toString().split('');
  _level.me = new PieceObject({ shape: Shapes[_b[0]], color: Colors[_b[1]], backgroundImage: BackgroundImages[_b[2]] });

  for (let x = 1; x < _bs.length; x++) {
    const _s = _bs[x].toString().split('');
    let _piece = new PieceObject({ shape: Shapes[_s[0]], color: Colors[_s[1]], backgroundImage: BackgroundImages[_s[2]] });

    let _likeness = 0;
    if (_piece.color === _level.me.color) {
      _likeness++;
    }
    if (_piece.shape === _level.me.shape) {
      _likeness++;
    }
    if (_piece.backgroundImage === _level.me.backgroundImage) {
      _likeness++;
    }
    _piece.isMatch = _likeness > 1;
    _piece.isFullMatch = _likeness === 3;

    _level.board.push(_piece);
  }
  return _level;
}
