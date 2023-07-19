/// <reference path="../models/PieceObject.js" />
/// <reference path="../models/ModeObject.js" />
/// <reference path="../helpers/console-enhancer.js" />

// if (!UseDebug) {
Vue.config.devtools = false;
Vue.config.debug = false;
Vue.config.silent = true;
// }

// prettier-ignore
Vue.config.ignoredElements = [
  'app',
  'home',
  'modes',
  'mode',
  'piece',
  'gild',
  'value',
  'checkbox',
  'toggle',
  'version',
  'howto',
  'chrome',
  'quit',
  'divider',
  'stage',
  'gameover',
  'clears',
  'time',
  'playarea',
  'addtime',
  'board',
  'me',
  'puzzle',
  'hint',
];

var app = new Vue({
  el: '#app',

  data: {
    appSettingsModes: Modes,
    appSettingsModeHardInterval: 100,
    appSettingsModeHardInternalChangeCounterCount: 0,
    appSettingsModeHardIntervalChangeCounterLimit: 10,
    appSettingsTotalNumberOfBoardPieces: 16,
    appVisualStateShowPageHome: true,
    appVisualStateShowPageHowToPlay: false,
    appVisualStateShowElementHint: false,
    appVisualStateShowElementFlyaway: false,
    gameCurrentIsGameOver: true,
    gameCurrentMePiece: { shape: 'square' },
    gameBoardPieces: [],
    gameCurrentStartingTime: 180000,
    gameCurrentTimer: 180000,
    gameCurrentNumberOfClears: 0,
    gameCurrentIsUserGuessWrong: false,
    gameCurrentNumberOfFails: 0,
    gameCurrentNumberOfMisses: 0,
    gameCurrentHasBonusTimeHintDisplayed: false,
    gameCurrentHintText: 'Select pieces that share <b>at least two</b> of my attributes (color, shape, pattern).',
    gameCurrentHasAnyPieceEverBeenSelected: false,
    userSettingsUseHints: true,
    documentCssRoot: document.querySelector(':root'),
  },

  methods: {
    NewGame() {
      this.NewBoard();
      this.gameCurrentIsGameOver = false;
    },

    CheckBoard() {
      this.gameCurrentIsUserGuessWrong = false;
      let totalPossibleLikePieces = 0;
      if (!this.gameCurrentIsGameOver) {
        let perfectMatch = true;
        this.gameBoardPieces.forEach((piece) => {
          let likeness = 0;
          if (piece.color == this.gameCurrentMePiece.color) {
            likeness++;
          }
          if (piece.shape == this.gameCurrentMePiece.shape) {
            likeness++;
          }
          if (piece.backgroundImage == this.gameCurrentMePiece.backgroundImage) {
            likeness++;
          }
          if ((likeness >= 2 && !piece.isSelected) || (likeness < 2 && piece.isSelected)) {
            perfectMatch = false;
          }
          if (likeness >= 2) {
            totalPossibleLikePieces++;
          }
        });
        if (perfectMatch) {
          this.appVisualStateShowElementHint = false;
          this.gameCurrentHasAnyPieceEverBeenSelected = true;
          if (this.gameCurrentNumberOfMisses == 0 && !this.appSettingsModes.infinite.isSelected) {
            if (!this.gameCurrentHasBonusTimeHintDisplayed) {
              this.appVisualStateShowElementHint = this.userSettingsUseHints;
              this.gameCurrentHintText = 'Successfully selecting all matching pieces on your first attempt adds <b>3 seconds</b> to the clock!';
              this.gameCurrentHasBonusTimeHintDisplayed = true;
            }
            this.gameCurrentTimer = this.gameCurrentTimer + 3000;
            this.appVisualStateShowElementFlyaway = true;
            window.setTimeout(function () {
              app.appVisualStateShowElementFlyaway = false;
            }, 600);
          }
          this.gameCurrentNumberOfClears++;
          this.NewBoard();
        } else {
          if (this.gameCurrentNumberOfMisses == 0 && !this.gameCurrentHasAnyPieceEverBeenSelected) {
            this.appVisualStateShowElementHint = this.userSettingsUseHints;
          }
          if (this.gameCurrentNumberOfMisses >= 1) {
            this.appVisualStateShowElementHint = this.userSettingsUseHints;
            if (totalPossibleLikePieces == 0) {
              this.gameCurrentHintText = 'Some boards have zero matches.';
            } else {
              this.gameCurrentHintText = totalPossibleLikePieces == 1 ? 'There is <b>' + totalPossibleLikePieces + '</b> piece like me.' : 'There are a total of <b>' + totalPossibleLikePieces + '</b> pieces like me.';
            }
          }
          this.gameCurrentNumberOfMisses++;
          this.gameCurrentNumberOfFails++;
          window.setTimeout(function () {
            app.gameCurrentIsUserGuessWrong = true;
          }, 5);
        }
      }
    },

    NewBoard() {
      this.documentCssRoot.style.setProperty('--pieceSize', window.innerWidth < 440 ? (window.innerWidth - 60) / 4 + 'px' : 440 / 4 + 'px');
      this.gameBoardPieces = [];
      this.gameCurrentNumberOfMisses = 0;
      for (let x = 0; x < this.appSettingsTotalNumberOfBoardPieces; x++) {
        let piece = new PieceObject({
          shape: Shapes[getRandomInt(0, Shapes.length)],
          color: Colors[getRandomInt(0, Colors.length)],
          backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)],
          isSelected: false,
          hasDropped: false,
          delay: (this.appSettingsTotalNumberOfBoardPieces - x) * 15,
        });
        this.gameBoardPieces.push(piece);
        window.setTimeout(function () {
          piece.hasDropped = true;
        }, piece.delay);
      }
      this.gameCurrentMePiece = new PieceObject({ shape: Shapes[getRandomInt(0, Shapes.length)], color: Colors[getRandomInt(0, Colors.length)], backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)] });
    },

    TogglePieceSelection(piece) {
      if (!this.gameCurrentIsGameOver) {
        piece.isSelected = !piece.isSelected;
        this.gameCurrentHasAnyPieceEverBeenSelected = true;
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
      this.gameCurrentTimer = this.appSettingsModes.infinite.isSelected ? 0 : 180000;
      this.gameCurrentNumberOfFails = 0;
      this.gameCurrentNumberOfClears = 0;
      this.appVisualStateShowPageHome = false;
      this.gameCurrentHasAnyPieceEverBeenSelected = false;
      this.appVisualStateShowElementHint = false;
      this.NewGame();
    },

    SelectMode(mode) {
      if (mode == this.appSettingsModes.hard && !this.appSettingsModes.hard.isSelected) {
        this.appSettingsModes.easy.isSelected = false;
        this.appSettingsModes.hard.isSelected = true;
        this.appSettingsModes.infinite.isSelected = false;
      } else if (mode == this.appSettingsModes.easy && !this.appSettingsModes.easy.isSelected) {
        this.appSettingsModes.easy.isSelected = true;
        this.appSettingsModes.hard.isSelected = false;
        this.appSettingsModes.infinite.isSelected = false;
      } else if (mode == this.appSettingsModes.infinite && !this.appSettingsModes.infinite.isSelected) {
        this.appSettingsModes.easy.isSelected = false;
        this.appSettingsModes.hard.isSelected = false;
        this.appSettingsModes.infinite.isSelected = true;
      }
      localStorage.setItem('mode', mode.name);
    },

    UpdateApp() {
      if (this.gameCurrentTimer > 0 || (this.appSettingsModes.infinite.isSelected && !this.gameCurrentIsGameOver)) {
        this.appSettingsModeHardInternalChangeCounterCount++;
        if (!this.appSettingsModes.infinite.isSelected) {
          this.gameCurrentTimer = this.gameCurrentTimer - this.appSettingsModeHardInterval;
          if (this.gameCurrentNumberOfClears == 0 && this.gameCurrentTimer <= this.gameCurrentStartingTime - 10000 && !this.gameCurrentHasAnyPieceEverBeenSelected) {
            this.appVisualStateShowElementHint = this.userSettingsUseHints;
          }
        } else {
          this.gameCurrentTimer = this.gameCurrentTimer + this.appSettingsModeHardInterval;
          if (this.gameCurrentNumberOfClears == 0 && this.gameCurrentTimer >= 10000 && !this.gameCurrentHasAnyPieceEverBeenSelected) {
            this.appVisualStateShowElementHint = this.userSettingsUseHints;
          }
        }
      } else {
        this.gameCurrentIsGameOver = true;
      }
      if (this.appSettingsModeHardInternalChangeCounterCount == this.appSettingsModeHardIntervalChangeCounterLimit) {
        if (this.appVisualStateShowPageHome) {
          this.appSettingsModes.hard.piece.shape = Shapes[getRandomInt(0, Shapes.length)];
          this.appSettingsModes.hard.piece.color = Colors[getRandomInt(0, Colors.length)];
          this.appSettingsModes.hard.piece.backgroundImage = BackgroundImages[getRandomInt(0, BackgroundImages.length)];
        }
        if (this.appSettingsModes.hard.isSelected) {
          let index = getRandomInt(0, this.gameBoardPieces.length);
          let rando = this.gameBoardPieces[index];
          rando.shape = Shapes[getRandomInt(0, Shapes.length)];
          rando.color = Colors[getRandomInt(0, Colors.length)];
          rando.backgroundImage = BackgroundImages[getRandomInt(0, BackgroundImages.length)];
        }

        this.appSettingsModeHardInternalChangeCounterCount = 0;
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
      return this.appSettingsModes.infinite.isSelected ? hrsstring + minstring + secstring : minstring + secstring;
    },

    EndGame() {
      let confirm = window.confirm('Are you sure you want to quit?');
      if (confirm) {
        this.gameCurrentIsGameOver = true;
      }
    },

    ToggleUsingHints() {
      this.userSettingsUseHints = !this.userSettingsUseHints;
      localStorage.setItem('userSettingsUseHints', this.userSettingsUseHints);
    },

    GetSettings() {
      let mode = localStorage.getItem('mode');
      if (mode != undefined && mode != null) {
        if (mode == 'hard') {
          this.SelectMode(this.appSettingsModes.hard);
        } else if (mode == 'infinite') {
          this.SelectMode(this.appSettingsModes.infinite);
        } else {
          this.SelectMode(this.appSettingsModes.easy);
        }
      }
      let hints = localStorage.getItem('userSettingsUseHints');
      if (hints != undefined && hints != null) {
        this.userSettingsUseHints = hints == 'true';
      }
    },
  },

  mounted() {
    this.NewGame();
    this.gameCurrentIsGameOver = true;
    this.updateInterval = window.setInterval(this.UpdateApp, this.appSettingsModeHardInterval);
    this.GetSettings();
  },

  computed: {},
});
