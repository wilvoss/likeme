/// <reference path="../models/PieceObject.js" />
/// <reference path="../helpers/console-enhancer.js" />

// if (!UseDebug) {
Vue.config.devtools = false;
Vue.config.debug = false;
Vue.config.silent = true;
// }

Vue.config.ignoredElements = ['app', 'page', 'navbar', 'settings', 'splash', 'splashwrap', 'message', 'notifications', 'speedControls', 'state', 'bank', 'commodity', 'detail', 'gameover', 'listheader', 'listings', 'category', 'name', 'units', 'currentPrice', 'description', 'market', 'currentValue', 'contractSize', 'goldbacking', 'contractUnit'];

var app = new Vue({
  el: '#app',
  data: {
    gameOver: true,
    piecesCount: 16,
    puzzlePiece: { shape: 'square' },
    easyPiece: new PieceObject({
      name: 'easyPiece',
      shape: Shapes[getRandomInt(0, Shapes.length)],
      color: Colors[getRandomInt(0, Colors.length)],
      backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)],
      isSelected: true,
    }),
    hardPiece: new PieceObject({
      name: 'hardPiece',
      shape: Shapes[getRandomInt(0, Shapes.length)],
      color: Colors[getRandomInt(0, Colors.length)],
      backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)],
    }),
    infinityPiece: new PieceObject({
      name: 'infinityPiece',
      shape: 'var(--infinity)',
      color: Colors[getRandomInt(0, Colors.length)],
      backgroundImage: 'var(--bgImage4)',
    }),
    hardInterval: 100,
    pieces: [],
    startingTime: 180000,
    timer: 180000,
    showHome: true,
    showInstructions: true,
    showHowTo: false,
    showHint: false,
    numberOfClears: 0,
    nope: false,
    numberOfFails: 0,
    currentMisses: 0,
    hardPieceChangeCount: 0,
    atLeastOnePieceHasBeenSelected: false,
    flyaway: false,
    useHints: true,
    bonusTimeHintDisplayed: false,
    hintText: 'Select pieces that share <b>at least two</b> of my attributes (color, shape, pattern).',
    r: document.querySelector(':root'),
  },
  methods: {
    NewGame() {
      this.NewBoard();
      this.gameOver = false;
    },
    CheckBoard() {
      this.nope = false;
      let totalPossibleLikePieces = 0;
      log('this.currentMisses = ' + this.currentMisses);
      if (!this.gameOver) {
        let perfectMatch = true;
        this.pieces.forEach((piece) => {
          let likeness = 0;
          if (piece.color == this.puzzlePiece.color) {
            likeness++;
          }
          if (piece.shape == this.puzzlePiece.shape) {
            likeness++;
          }
          if (piece.backgroundImage == this.puzzlePiece.backgroundImage) {
            likeness++;
          }
          if ((likeness >= 2 && !piece.isSelected) || (likeness < 2 && piece.isSelected)) {
            perfectMatch = false;
            // return;
          }
          if (likeness >= 2) {
            totalPossibleLikePieces++;
          }
        });
        if (perfectMatch) {
          this.showHint = false;
          this.atLeastOnePieceHasBeenSelected = true;
          if (this.currentMisses == 0 && !this.infinityPiece.isSelected) {
            if (!this.bonusTimeHintDisplayed) {
              this.showHint = this.useHints;
              this.hintText = 'Getting a perfect match on your first attempt adds 3 seconds to the clock!';
              this.bonusTimeHintDisplayed = true;
            }
            this.timer = this.timer + 3000;
            this.flyaway = true;
            window.setTimeout(function () {
              app.flyaway = false;
            }, 600);
          }
          this.numberOfClears++;
          // log('this.numberOfClears = ' + this.numberOfClears + ': this.currentMisses = ' + this.currentMisses + ': this.mode = ' + this.mode);
          this.NewBoard();
        } else {
          // this.atLeastOnePieceHasBeenSelected = false;
          if (this.currentMisses == 0 && !this.atLeastOnePieceHasBeenSelected) {
            this.showHint = this.useHints;
          }
          if (this.currentMisses >= 1) {
            this.showHint = this.useHints;
            if (totalPossibleLikePieces == 0) {
              this.hintText = 'Some boards have zero matches.';
            } else {
              this.hintText = totalPossibleLikePieces == 1 ? 'There is ' + totalPossibleLikePieces + ' piece like me.' : 'There are a total of ' + totalPossibleLikePieces + ' pieces like me.';
            }
          }
          this.currentMisses++;
          this.numberOfFails++;
          window.setTimeout(function () {
            app.nope = true;
          }, 5);
        }
      }
    },
    NewBoard() {
      this.r.style.setProperty('--pieceSize', window.innerWidth < 440 ? (window.innerWidth - 60) / 4 + 'px' : 440 / 4 + 'px');
      this.pieces = [];
      this.currentMisses = 0;
      for (let x = 0; x < this.piecesCount; x++) {
        let piece = new PieceObject({
          shape: Shapes[getRandomInt(0, Shapes.length)],
          color: Colors[getRandomInt(0, Colors.length)],
          backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)],
          isSelected: false,
          hasDropped: false,
          delay: (this.piecesCount - x) * 15,
        });
        log(x + ' delay = ' + piece.delay);
        this.pieces.push(piece);
        window.setTimeout(function () {
          piece.hasDropped = true;
        }, piece.delay);
      }
      this.puzzlePiece = new PieceObject({ shape: Shapes[getRandomInt(0, Shapes.length)], color: Colors[getRandomInt(0, Colors.length)], backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)] });
    },
    TogglePieceSelection(piece) {
      if (!this.gameOver) {
        piece.isSelected = !piece.isSelected;
        this.atLeastOnePieceHasBeenSelected = true;
      }
    },
    Share() {
      navigator.share({
        title: 'Like Me?',
        text: 'What in the world is like me?',
        url: 'https://likeme.games',
      });
    },
    RestartGame() {
      this.timer = this.infinityPiece.isSelected ? 0 : 180000;
      this.numberOfFails = 0;
      this.numberOfClears = 0;
      this.showHome = false;
      this.atLeastOnePieceHasBeenSelected = false;
      this.showHint = false;
      this.NewGame();
    },
    SelectMode(piece) {
      if (piece == this.hardPiece && !this.hardPiece.isSelected) {
        this.easyPiece.isSelected = false;
        this.hardPiece.isSelected = true;
        this.infinityPiece.isSelected = false;
      } else if (piece == this.easyPiece && !this.easyPiece.isSelected) {
        this.easyPiece.isSelected = true;
        this.hardPiece.isSelected = false;
        this.infinityPiece.isSelected = false;
      } else if (piece == this.infinityPiece && !this.infinityPiece.isSelected) {
        this.easyPiece.isSelected = false;
        this.hardPiece.isSelected = false;
        this.infinityPiece.isSelected = true;
      }
      localStorage.setItem('mode', piece.name);
    },
    UpdateApp() {
      if (this.timer > 0 || (this.infinityPiece.isSelected && !this.gameOver)) {
        this.hardPieceChangeCount++;
        if (!this.infinityPiece.isSelected) {
          this.timer = this.timer - this.hardInterval;
          if (this.numberOfClears == 0 && this.timer <= this.startingTime - 10000 && !this.atLeastOnePieceHasBeenSelected) {
            this.showHint = this.useHints;
          }
        } else {
          this.timer = this.timer + this.hardInterval;
          if (this.numberOfClears == 0 && this.timer >= 10000 && !this.atLeastOnePieceHasBeenSelected) {
            this.showHint = this.useHints;
          }
        }
      } else {
        this.gameOver = true;
      }
      if (this.hardPieceChangeCount == 10) {
        if (this.showHome) {
          this.hardPiece.shape = Shapes[getRandomInt(0, Shapes.length)];
          this.hardPiece.color = Colors[getRandomInt(0, Colors.length)];
          this.hardPiece.backgroundImage = BackgroundImages[getRandomInt(0, BackgroundImages.length)];
        }
        if (this.hardPiece.isSelected) {
          let index = getRandomInt(0, this.pieces.length);
          let rando = this.pieces[index];
          rando.shape = Shapes[getRandomInt(0, Shapes.length)];
          rando.color = Colors[getRandomInt(0, Colors.length)];
          rando.backgroundImage = BackgroundImages[getRandomInt(0, BackgroundImages.length)];
        }

        this.hardPieceChangeCount = 0;
      }
    },
    MsToTime(s) {
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;

      var secstring = mins != 0 || hrs != 0 ? ('0' + secs).slice(-2) : secs;
      var minstring = mins != 0 ? mins + '∶' : '';
      var hrsstring = hrs != 0 ? hrs + '∶' : '';
      return this.infinityPiece.isSelected ? hrsstring + minstring + secstring : minstring + secstring;
    },
    EndGame() {
      let confirm = window.confirm('Are you sure you want to quit?');
      if (confirm) {
        this.gameOver = true;
      }
    },
    ToggleUsingHints() {
      this.useHints = !this.useHints;
      localStorage.setItem('useHints', this.useHints);
    },
    GetSettings() {
      let mode = localStorage.getItem('mode');
      if (mode != undefined && mode != null) {
        if (mode == 'easyPiece') {
          this.SelectMode(this.easyPiece);
        } else if (mode == 'hardPiece') {
          this.SelectMode(this.hardPiece);
        } else if (mode == 'infinityPiece') {
          this.SelectMode(this.infinityPiece);
        }
      }
      let hints = localStorage.getItem('useHints');
      if (hints != undefined && hints != null) {
        this.useHints = hints == 'true';
      }
    },
  },

  mounted() {
    this.NewGame();
    this.gameOver = true;
    this.GetSettings();
    // this.ReadyStage();
    this.updateInterval = window.setInterval(this.UpdateApp, this.hardInterval);
  },

  computed: {},
});
