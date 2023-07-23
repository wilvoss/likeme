/// <reference path="../models/ThemeObject.js" />
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
    storedVersion: 0,
    currentVersion: '3.6.19',
    appSettingsModes: Modes,
    appSettingsModeHardInterval: 100,
    appSettingsModeHardInternalChangeCounterCount: 0,
    appSettingsModeHardIntervalChangeCounterLimit: 10,
    appSettingsNumberOfHighScoresShown: 3,
    appSettingsPieceSize: 10,
    appSettingsScoreTwinIncrement: 10,
    appSettingsScoreSiblingIncrement: 20,
    appSettingsScoreModeHardMultiplier: 4,
    appSettingsThemes: Themes,
    appSettingsTotalNumberOfBoardPieces: 16,
    appVisualStateShowPageHighScores: false,
    appVisualStateShowPageHome: true,
    appVisualStateShowPageHowToPlay: false,
    appVisualStateShowPageSettings: false,
    appVisualStateShowElementHint: false,
    appVisualStateShowElementFlyaway: false,
    appVisualStateShowNewHighScoreElement: false,
    gameCurrentIsGameOver: true,
    gameCurrentMePiece: { shape: 'square' },
    gameCurrentBoardPieces: [],
    gameCurrentBoardScore: 0,
    gameCurrentTotalScore: 0,
    gameCurrentStartingTime: 180000,
    gameCurrentTimer: 180000,
    gameCurrentNumberOfClears: 0,
    gameCurrentIsUserGuessWrong: false,
    gameCurrentNumberOfFails: 0,
    gameCurrentNumberOfMisses: 0,
    gameCurrentHasBonusTimeHintDisplayed: false,
    gameCurrentHintText: 'Select pieces that share <b>at least two</b> of my attributes (color, shape, pattern).',
    gameCurrentHasAnyPieceEverBeenSelected: false,
    userHighScoresInfinite: [],
    userHighScoresEasy: [],
    userHighScoresHard: [],
    userSettingsUseHints: true,
    documentCssRoot: document.querySelector(':root'),
  },

  methods: {
    NewGame() {
      log('this.NewGame() called');
      this.NewBoard();
      this.userHighScoresEasy.forEach((s) => {
        s.isCurrent = false;
      });
      this.userHighScoresHard.forEach((s) => {
        s.isCurrent = false;
      });
      this.userHighScoresInfinite.forEach((s) => {
        s.isCurrent = false;
      });

      this.appVisualStateShowNewHighScoreElement = false;
      this.gameCurrentTotalScore = 0;
      this.gameCurrentIsGameOver = false;
    },

    CheckBoard() {
      log('this.CheckBoard() called');
      this.gameCurrentIsUserGuessWrong = false;
      let _totalPossibleLikePieces = 0;
      let _totalBoardScore = 0;
      if (!this.gameCurrentIsGameOver) {
        let _perfectMatch = true;
        this.gameCurrentBoardPieces.forEach((piece) => {
          let _likeness = 0;
          if (piece.color === this.gameCurrentMePiece.color) {
            _likeness++;
          }
          if (piece.shape === this.gameCurrentMePiece.shape) {
            _likeness++;
          }
          if (piece.backgroundImage === this.gameCurrentMePiece.backgroundImage) {
            _likeness++;
          }
          if ((_likeness >= 2 && !piece.isSelected) || (_likeness < 2 && piece.isSelected)) {
            _perfectMatch = false;
          }
          if (_likeness >= 2) {
            _totalPossibleLikePieces++;
          }
          switch (_likeness) {
            case 0:
              break;
            case 2:
              _totalBoardScore = _totalBoardScore + this.appSettingsScoreSiblingIncrement * parseInt(this.appSettingsModes.hard.isSelected ? this.appSettingsScoreModeHardMultiplier : 1);
              break;
            case 3:
              _totalBoardScore = _totalBoardScore + this.appSettingsScoreTwinIncrement * parseInt(this.appSettingsModes.hard.isSelected ? this.appSettingsScoreModeHardMultiplier : 1);
              break;
            default:
              break;
          }
        });
        if (_totalPossibleLikePieces == 0) {
          _totalBoardScore = this.appSettingsTotalNumberOfBoardPieces * (_totalBoardScore + this.appSettingsScoreTwinIncrement * parseInt(this.appSettingsModes.hard.isSelected ? this.appSettingsScoreModeHardMultiplier : 1));
        }
        if (_perfectMatch) {
          this.gameCurrentTotalScore = this.gameCurrentTotalScore + _totalBoardScore;
          this.appVisualStateShowElementHint = false;
          this.gameCurrentHasAnyPieceEverBeenSelected = true;
          if (this.gameCurrentNumberOfMisses === 0 && !this.appSettingsModes.infinite.isSelected) {
            if (!this.gameCurrentHasBonusTimeHintDisplayed) {
              this.appVisualStateShowElementHint = this.userSettingsUseHints;
              this.gameCurrentHintText = 'Matching all pieces on your first attempt adds <b>3 seconds</b> to the clock!';
              this.gameCurrentHasBonusTimeHintDisplayed = true;
            }
            this.gameCurrentTimer = this.gameCurrentTimer + 3000;
            this.appVisualStateShowElementFlyaway = true;
            window.setTimeout(function () {
              app.appVisualStateShowElementFlyaway = false;
            }, 100);
          }
          this.gameCurrentNumberOfClears++;
          this.NewBoard();
        } else {
          if (this.gameCurrentNumberOfMisses === 0 && !this.gameCurrentHasAnyPieceEverBeenSelected) {
            this.appVisualStateShowElementHint = this.userSettingsUseHints;
          }
          if (this.gameCurrentNumberOfMisses >= 1) {
            this.appVisualStateShowElementHint = this.userSettingsUseHints;
            if (_totalPossibleLikePieces === 0) {
              this.gameCurrentHintText = 'Some boards have zero matches.';
            } else {
              this.gameCurrentHintText = _totalPossibleLikePieces === 1 ? 'There is <b>' + _totalPossibleLikePieces + '</b> piece like me.' : 'There are a total of <b>' + _totalPossibleLikePieces + '</b> pieces like me.';
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
      log('this.NewBoard() called');
      this.AdjustPieceSizeBasedOnViewport();
      this.gameCurrentBoardPieces = [];
      this.gameCurrentBoardScore = 0;
      this.gameCurrentNumberOfMisses = 0;
      for (let x = 0; x < this.appSettingsTotalNumberOfBoardPieces; x++) {
        let _piece = new PieceObject({
          shape: Shapes[getRandomInt(0, Shapes.length)],
          color: Colors[getRandomInt(0, Colors.length)],
          backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)],
          isSelected: false,
          hasDropped: false,
          delay: (this.appSettingsTotalNumberOfBoardPieces - x) * 15,
        });
        this.gameCurrentBoardPieces.push(_piece);
        window.setTimeout(function () {
          _piece.hasDropped = true;
        }, _piece.delay);
      }
      this.gameCurrentMePiece = new PieceObject({ shape: Shapes[getRandomInt(0, Shapes.length)], color: Colors[getRandomInt(0, Colors.length)], backgroundImage: BackgroundImages[getRandomInt(0, BackgroundImages.length)] });
    },

    TogglePieceSelection(piece) {
      log('this.TogglePieceSelection() called for: " this.gameCurrentBoardPieces[' + this.gameCurrentBoardPieces.indexOf(piece) + ']"');
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
      log('this.RestartGame() called');
      this.gameCurrentTimer = this.appSettingsModes.infinite.isSelected ? 0 : this.gameCurrentStartingTime;
      this.gameCurrentNumberOfFails = 0;
      this.gameCurrentNumberOfClears = 0;
      this.appVisualStateShowPageHome = false;
      this.gameCurrentHasAnyPieceEverBeenSelected = false;
      this.appVisualStateShowElementHint = false;
      this.NewGame();
    },

    SelectMode(mode) {
      log('this.SelectMode(mode) called for:  "' + mode.name + '"');
      if (mode === this.appSettingsModes.hard && !this.appSettingsModes.hard.isSelected) {
        this.appSettingsModes.easy.isSelected = false;
        this.appSettingsModes.hard.isSelected = true;
        this.appSettingsModes.infinite.isSelected = false;
      } else if (mode === this.appSettingsModes.easy && !this.appSettingsModes.easy.isSelected) {
        this.appSettingsModes.easy.isSelected = true;
        this.appSettingsModes.hard.isSelected = false;
        this.appSettingsModes.infinite.isSelected = false;
      } else if (mode === this.appSettingsModes.infinite && !this.appSettingsModes.infinite.isSelected) {
        this.appSettingsModes.easy.isSelected = false;
        this.appSettingsModes.hard.isSelected = false;
        this.appSettingsModes.infinite.isSelected = true;
      }
    },

    SelectTheme(theme) {
      log('this.SelectTheme(theme) called for: "' + theme.name + '"');
      this.appSettingsThemes.forEach((t) => {
        t.isSelected = theme == t;
      });
      this.documentCssRoot.style.setProperty('--color1', theme.color1);
      this.documentCssRoot.style.setProperty('--color2', theme.color2);
      this.documentCssRoot.style.setProperty('--color3', theme.color3);
      localStorage.setItem('userSettingsTheme', JSON.stringify(theme.name));
    },

    UpdateApp() {
      if (this.gameCurrentTimer > 0 || (this.appSettingsModes.infinite.isSelected && !this.gameCurrentIsGameOver)) {
        this.appSettingsModeHardInternalChangeCounterCount++;
        if (!this.appSettingsModes.infinite.isSelected) {
          this.gameCurrentTimer = this.gameCurrentTimer - this.appSettingsModeHardInterval;
          if (this.gameCurrentNumberOfClears === 0 && this.gameCurrentTimer <= this.gameCurrentStartingTime - 10000 && !this.gameCurrentHasAnyPieceEverBeenSelected) {
            this.appVisualStateShowElementHint = this.userSettingsUseHints;
          }
        } else {
          this.gameCurrentTimer = parseInt(this.gameCurrentTimer) + parseInt(this.appSettingsModeHardInterval);
          if (this.gameCurrentNumberOfClears === 0 && this.gameCurrentTimer >= 10000 && !this.gameCurrentHasAnyPieceEverBeenSelected) {
            this.appVisualStateShowElementHint = this.userSettingsUseHints;
          }
        }
      } else {
        if (!this.gameCurrentIsGameOver) {
          this.EndGame(false);
        }
      }
      if (this.appSettingsModeHardInternalChangeCounterCount >= this.appSettingsModeHardIntervalChangeCounterLimit) {
        if (this.appVisualStateShowPageHome) {
          this.appSettingsModes.hard.piece.shape = Shapes[getRandomInt(0, Shapes.length)];
          this.appSettingsModes.hard.piece.color = Colors[getRandomInt(0, Colors.length)];
          this.appSettingsModes.hard.piece.backgroundImage = BackgroundImages[getRandomInt(0, BackgroundImages.length)];
        }
        if (!this.gameCurrentIsGameOver && this.appSettingsModes.hard.isSelected) {
          let _index = getRandomInt(0, this.gameCurrentBoardPieces.length);
          log(_index);
          let _rando = this.gameCurrentBoardPieces[_index];
          _rando.shape = Shapes[getRandomInt(0, Shapes.length)];
          _rando.color = Colors[getRandomInt(0, Colors.length)];
          _rando.backgroundImage = BackgroundImages[getRandomInt(0, BackgroundImages.length)];
        }

        this.appSettingsModeHardInternalChangeCounterCount = 0;
      }
    },

    GetMsToTime(s) {
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

    EndGame(challenge = true) {
      log('this.EndGame() called');
      var _confirm = false;
      if (challenge) {
        _confirm = window.confirm('Are you sure you want to quit?');
      }
      if (_confirm || !challenge) {
        this.gameCurrentIsGameOver = true;
        let _score = new ScoreObject({
          value: this.gameCurrentTotalScore,
        });
        if (this.appSettingsModes.easy.isSelected) {
          this.userHighScoresEasy.push(_score);
          if (_score === this.userScoresHighEasyByValue[0]) {
            this.appVisualStateShowNewHighScoreElement = true;
          }
          localStorage.setItem('userHighScoresEasy', JSON.stringify(this.userHighScoresEasy));
        } else if (this.appSettingsModes.hard.isSelected) {
          this.userHighScoresHard.push(_score);
          localStorage.setItem('userHighScoresHard', JSON.stringify(this.userHighScoresHard));
        } else if (this.appSettingsModes.infinite.isSelected) {
          this.userHighScoresInfinite.push(_score);
          localStorage.setItem('userHighScoresInfinite', JSON.stringify(this.userHighScoresInfinite));
        }
        _score.isCurrent = true;
      }
    },

    ToggleUsingHints(event) {
      log('this.ToggleUsingHints(event) called');
      event.stopPropagation();
      event.preventDefault();
      this.userSettingsUseHints = !this.userSettingsUseHints;
      localStorage.setItem('userSettingsUseHints', this.userSettingsUseHints);
    },

    ToggleHowToPlay(event, value) {
      log('this.ToggleHowToPlay(event, value) called');
      event.stopPropagation();
      event.preventDefault();
      this.appVisualStateShowPageHowToPlay = value;
    },

    ToggleHighScores(event, value) {
      log('this.ToggleHighScores(event, value) called');
      event.stopPropagation();
      event.preventDefault();
      this.appVisualStateShowPageHighScores = value;
    },

    ToggleSettings(event, value) {
      log('this.ToggleSettings(event, value) called');
      event.stopPropagation();
      event.preventDefault();
      this.appVisualStateShowPageSettings = value;
    },

    GetUserSettings() {
      log('this.GetUserSettings() called');
      let _modes = localStorage.getItem('appSettingsModes');
      if (_modes !== undefined && _modes !== null) {
        _modes = JSON.parse(_modes);
        this.appSettingsModes.easy.isSelected = _modes.easy.isSelected;
        this.appSettingsModes.hard.isSelected = _modes.hard.isSelected;
        this.appSettingsModes.infinite.isSelected = _modes.infinite.isSelected;
      }

      let _hints = localStorage.getItem('userSettingsUseHints');
      if (_hints !== undefined && _hints !== null) {
        _hints = JSON.parse(_hints);
        this.userSettingsUseHints = _hints;
      }

      let _userSettingsTheme = localStorage.getItem('userSettingsTheme');
      try {
        let _themeFound = '';
        if (_userSettingsTheme !== undefined && _userSettingsTheme !== null) {
          _userSettingsTheme = JSON.parse(_userSettingsTheme);
          this.appSettingsThemes.forEach((t) => {
            if (t.name == _userSettingsTheme) {
              _themeFound = t;
            }
          });
        }
        if (_themeFound != '') {
          this.SelectTheme(_themeFound);
        }
      } catch (error) {
        log('_userSettingsTheme error: ' + error);
        _gameDataCorrupt = true;
      }

      let _userHighScoresEasy = localStorage.getItem('userHighScoresEasy');
      try {
        if (_userHighScoresEasy !== undefined && _userHighScoresEasy !== '[]' && _userHighScoresEasy !== null) {
          _userHighScoresEasy = JSON.parse(_userHighScoresEasy);
          _userHighScoresEasy.forEach((s) => {
            this.userHighScoresEasy.push(new ScoreObject({ date: new Date(s.date), value: s.value }));
          });
        }
      } catch (error) {
        log('_userHighScoresEasy error: ' + error);
        _gameDataCorrupt = true;
      }

      let _userHighScoresHard = localStorage.getItem('userHighScoresHard');
      try {
        if (_userHighScoresHard !== undefined && _userHighScoresHard !== '[]' && _userHighScoresHard !== null) {
          _userHighScoresHard = JSON.parse(_userHighScoresHard);
          _userHighScoresHard.forEach((s) => {
            this.userHighScoresHard.push(new ScoreObject({ date: new Date(s.date), value: s.value }));
          });
        }
      } catch (error) {
        log('_userHighScoresHard error: ' + error);
        _gameDataCorrupt = true;
      }
    },

    ClearAllUserScores() {
      let _confirm = window.confirm('Are you sure you want to clear all of your scores?');
      if (_confirm) {
        this.userHighScoresEasy = [];
        this.userHighScoresHard = [];
        this.userHighScoresInfinite = [];
        localStorage.setItem('userHighScoresEasy', JSON.stringify(this.userHighScoresEasy));
        localStorage.setItem('userHighScoresHard', JSON.stringify(this.userHighScoresHard));
        localStorage.setItem('userHighScoresInfinite', JSON.stringify(this.userHighScoresInfinite));
      }
    },

    RestoreCurrentGame() {
      log('this.RestoreCurrentGame() called');
      let _gameDataCorrupt = false;

      let _appSettingsModeHardInterval = localStorage.getItem('appSettingsModeHardInterval');
      try {
        if (_appSettingsModeHardInterval !== undefined && _appSettingsModeHardInterval !== null) {
          this.appSettingsModeHardInterval = _appSettingsModeHardInterval;
        }
      } catch (error) {
        log('_appSettingsModeHardInterval error: ' + error);
        _gameDataCorrupt = true;
      }

      let _appSettingsModeHardInternalChangeCounterCount = localStorage.getItem('appSettingsModeHardInternalChangeCounterCount');
      try {
        if (_appSettingsModeHardInternalChangeCounterCount !== undefined && _appSettingsModeHardInternalChangeCounterCount !== null) {
          this.appSettingsModeHardInternalChangeCounterCount = _appSettingsModeHardInternalChangeCounterCount;
        }
      } catch (error) {
        log('_appSettingsModeHardInternalChangeCounterCount error: ' + error);
        _gameDataCorrupt = true;
      }

      let _appSettingsModeHardIntervalChangeCounterLimit = localStorage.getItem('appSettingsModeHardIntervalChangeCounterLimit');
      try {
        if (_appSettingsModeHardIntervalChangeCounterLimit !== undefined && _appSettingsModeHardIntervalChangeCounterLimit !== null) {
          this.appSettingsModeHardIntervalChangeCounterLimit = _appSettingsModeHardIntervalChangeCounterLimit;
        }
      } catch (error) {
        log('_appSettingsModeHardIntervalChangeCounterLimit error: ' + error);
        _gameDataCorrupt = true;
      }

      let _appSettingsPieceSize = localStorage.getItem('appSettingsPieceSize');
      try {
        if (_appSettingsPieceSize !== undefined && _appSettingsPieceSize !== null) {
          this.appSettingsPieceSize = _appSettingsPieceSize;
        }
      } catch (error) {
        log('_appSettingsPieceSize error: ' + error);
        _gameDataCorrupt = true;
      }

      let _appSettingsTotalNumberOfBoardPieces = localStorage.getItem('appSettingsTotalNumberOfBoardPieces');
      try {
        if (_appSettingsTotalNumberOfBoardPieces !== undefined && _appSettingsTotalNumberOfBoardPieces !== null) {
          this.appSettingsTotalNumberOfBoardPieces = _appSettingsTotalNumberOfBoardPieces;
        }
      } catch (error) {
        log('_appSettingsTotalNumberOfBoardPieces error: ' + error);
        _gameDataCorrupt = true;
      }

      let _appVisualStateShowPageHome = localStorage.getItem('appVisualStateShowPageHome');
      try {
        if (_appVisualStateShowPageHome !== undefined && _appVisualStateShowPageHome !== null) {
          this.appVisualStateShowPageHome = JSON.parse(_appVisualStateShowPageHome);
        }
      } catch (error) {
        log('_appVisualStateShowPageHome error: ' + error);
        _gameDataCorrupt = true;
      }

      let _appVisualStateShowPageHowToPlay = localStorage.getItem('appVisualStateShowPageHowToPlay');
      try {
        if (_appVisualStateShowPageHowToPlay !== undefined && _appVisualStateShowPageHowToPlay !== null) {
          this.appVisualStateShowPageHowToPlay = JSON.parse(_appVisualStateShowPageHowToPlay);
        }
      } catch (error) {
        log('_appVisualStateShowPageHowToPlay error: ' + error);
        _gameDataCorrupt = true;
      }

      let _appVisualStateShowPageSettings = localStorage.getItem('appVisualStateShowPageSettings');
      try {
        if (_appVisualStateShowPageSettings !== undefined && _appVisualStateShowPageSettings !== null) {
          this.appVisualStateShowPageSettings = JSON.parse(_appVisualStateShowPageSettings);
        }
      } catch (error) {
        log('_appVisualStateShowPageSettings error: ' + error);
        _gameDataCorrupt = true;
      }

      let _appVisualStateShowElementHint = localStorage.getItem('appVisualStateShowElementHint');
      try {
        if (_appVisualStateShowElementHint !== undefined && _appVisualStateShowElementHint !== null) {
          this.appVisualStateShowElementHint = JSON.parse(_appVisualStateShowElementHint);
        }
      } catch (error) {
        log('_appVisualStateShowElementHint error: ' + error);
        _gameDataCorrupt = true;
      }

      let _appVisualStateShowElementFlyaway = localStorage.getItem('appVisualStateShowElementFlyaway');
      try {
        if (_appVisualStateShowElementFlyaway !== undefined && _appVisualStateShowElementFlyaway !== null) {
          this.appVisualStateShowElementFlyaway = JSON.parse(_appVisualStateShowElementFlyaway);
        }
      } catch (error) {
        log('_appVisualStateShowElementFlyaway error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentMePiece = localStorage.getItem('gameCurrentMePiece');
      try {
        if (_gameCurrentMePiece !== undefined && _gameCurrentMePiece !== null) {
          _gameCurrentMePiece = JSON.parse(_gameCurrentMePiece);
          this.gameCurrentMePiece = new PieceObject(_gameCurrentMePiece);
        }
      } catch (error) {
        log('_gameCurrentMePiece error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentBoardPieces = localStorage.getItem('gameCurrentBoardPieces');
      try {
        if (_gameCurrentBoardPieces !== undefined && _gameCurrentBoardPieces !== null) {
          _gameCurrentBoardPieces = JSON.parse(_gameCurrentBoardPieces);
          this.gameCurrentBoardPieces = [];
          _gameCurrentBoardPieces.forEach((piece) => {
            this.gameCurrentBoardPieces.push(new PieceObject(piece));
          });
        }
      } catch (error) {
        log('_gameCurrentBoardPieces error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentStartingTime = localStorage.getItem('gameCurrentStartingTime');
      try {
        if (_gameCurrentStartingTime !== undefined && _gameCurrentStartingTime !== null) {
          this.gameCurrentStartingTime = _gameCurrentStartingTime;
        }
      } catch (error) {
        log('_gameCurrentStartingTime error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentTimer = localStorage.getItem('gameCurrentTimer');
      try {
        if (_gameCurrentTimer !== undefined && _gameCurrentTimer !== null) {
          this.gameCurrentTimer = _gameCurrentTimer;
        }
      } catch (error) {
        log('_gameCurrentTimer error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentNumberOfClears = localStorage.getItem('gameCurrentNumberOfClears');
      try {
        if (_gameCurrentNumberOfClears !== undefined && _gameCurrentNumberOfClears !== null) {
          this.gameCurrentNumberOfClears = _gameCurrentNumberOfClears;
        }
      } catch (error) {
        log('_gameCurrentNumberOfClears error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentIsUserGuessWrong = localStorage.getItem('gameCurrentIsUserGuessWrong');
      try {
        if (_gameCurrentIsUserGuessWrong !== undefined && _gameCurrentIsUserGuessWrong !== null) {
          this.gameCurrentIsUserGuessWrong = JSON.parse(_gameCurrentIsUserGuessWrong);
        }
      } catch (error) {
        log('_gameCurrentIsUserGuessWrong error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentNumberOfFails = localStorage.getItem('gameCurrentNumberOfFails');
      try {
        if (_gameCurrentNumberOfFails !== undefined && _gameCurrentNumberOfFails !== null) {
          this.gameCurrentNumberOfFails = _gameCurrentNumberOfFails;
        }
      } catch (error) {
        log('_gameCurrentNumberOfFails error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentNumberOfMisses = localStorage.getItem('gameCurrentNumberOfMisses');
      try {
        if (_gameCurrentNumberOfMisses !== undefined && _gameCurrentNumberOfMisses !== null) {
          this.gameCurrentNumberOfMisses = _gameCurrentNumberOfMisses;
        }
      } catch (error) {
        log('_gameCurrentNumberOfMisses error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentHasBonusTimeHintDisplayed = localStorage.getItem('gameCurrentHasBonusTimeHintDisplayed');
      try {
        if (_gameCurrentHasBonusTimeHintDisplayed !== undefined && _gameCurrentHasBonusTimeHintDisplayed !== null) {
          this.gameCurrentHasBonusTimeHintDisplayed = JSON.parse(_gameCurrentHasBonusTimeHintDisplayed);
        }
      } catch (error) {
        log('_gameCurrentHasBonusTimeHintDisplayed error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentHintText = localStorage.getItem('gameCurrentHintText');
      try {
        if (_gameCurrentHintText !== undefined && _gameCurrentHintText !== null) {
          this.gameCurrentHintText = _gameCurrentHintText;
        }
      } catch (error) {
        log('_gameCurrentHintText error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentHasAnyPieceEverBeenSelected = localStorage.getItem('gameCurrentHasAnyPieceEverBeenSelected');
      try {
        if (_gameCurrentHasAnyPieceEverBeenSelected !== undefined && _gameCurrentHasAnyPieceEverBeenSelected !== null) {
          this.gameCurrentHasAnyPieceEverBeenSelected = JSON.parse(_gameCurrentHasAnyPieceEverBeenSelected);
        }
      } catch (error) {
        log('_gameCurrentHasAnyPieceEverBeenSelected error: ' + error);
        _gameDataCorrupt = true;
      }

      if (_gameDataCorrupt) {
        this.gameCurrentIsGameOver = true;
        this.NewGame();
      }
    },

    InitializeGame() {
      log('App Initialized', true);
      this.AdjustPieceSizeBasedOnViewport();

      let _storedVersion = localStorage.getItem('storedVersion');
      try {
        if (_storedVersion !== undefined && _storedVersion !== null) {
          this.storedVersion = _storedVersion;
        }
      } catch (error) {
        _storedVersion = null;
      }

      let _gameCurrentIsGameOver = localStorage.getItem('gameCurrentIsGameOver');
      try {
        if (_gameCurrentIsGameOver !== undefined && _gameCurrentIsGameOver !== null) {
          this.gameCurrentIsGameOver = JSON.parse(_gameCurrentIsGameOver);
        }
      } catch (error) {
        this.gameCurrentIsGameOver = true;
      }

      this.GetUserSettings();

      log(this.gameCurrentIsGameOver, true, '#00ffff');
      if (this.currentVersion === this.storedVersion && !this.gameCurrentIsGameOver) {
        this.RestoreCurrentGame();
      }

      this.updateInterval = window.setInterval(this.UpdateApp, this.appSettingsModeHardInterval);
    },

    HandleOnUnloadEvent() {
      localStorage.setItem('storedVersion', this.currentVersion);
      localStorage.setItem('appSettingsModes', JSON.stringify(this.appSettingsModes));
      localStorage.setItem('appSettingsModeHardInterval', this.appSettingsModeHardInterval);
      localStorage.setItem('appSettingsModeHardInternalChangeCounterCount', this.appSettingsModeHardInternalChangeCounterCount);
      localStorage.setItem('appSettingsModeHardIntervalChangeCounterLimit', this.appSettingsModeHardIntervalChangeCounterLimit);
      localStorage.setItem('appSettingsPieceSize', this.appSettingsPieceSize);
      localStorage.setItem('appSettingsTotalNumberOfBoardPieces', this.appSettingsTotalNumberOfBoardPieces);
      localStorage.setItem('appVisualStateShowPageHome', JSON.stringify(this.appVisualStateShowPageHome));
      localStorage.setItem('appVisualStateShowPageHowToPlay', JSON.stringify(this.appVisualStateShowPageHowToPlay));
      localStorage.setItem('appVisualStateShowPageSettings', JSON.stringify(this.appVisualStateShowPageSettings));
      localStorage.setItem('appVisualStateShowElementHint', JSON.stringify(this.appVisualStateShowElementHint));
      localStorage.setItem('appVisualStateShowElementFlyaway', JSON.stringify(this.appVisualStateShowElementFlyaway));
      localStorage.setItem('gameCurrentIsGameOver', JSON.stringify(this.gameCurrentIsGameOver));
      localStorage.setItem('gameCurrentMePiece', JSON.stringify(this.gameCurrentMePiece));
      localStorage.setItem('gameCurrentBoardPieces', JSON.stringify(this.gameCurrentBoardPieces));
      localStorage.setItem('gameCurrentStartingTime', this.gameCurrentStartingTime);
      localStorage.setItem('gameCurrentTimer', this.gameCurrentTimer);
      localStorage.setItem('gameCurrentNumberOfClears', this.gameCurrentNumberOfClears);
      localStorage.setItem('gameCurrentIsUserGuessWrong', JSON.stringify(this.gameCurrentIsUserGuessWrong));
      localStorage.setItem('gameCurrentNumberOfFails', this.gameCurrentNumberOfFails);
      localStorage.setItem('gameCurrentNumberOfMisses', this.gameCurrentNumberOfMisses);
      localStorage.setItem('gameCurrentHasBonusTimeHintDisplayed', JSON.stringify(this.gameCurrentHasBonusTimeHintDisplayed));
      localStorage.setItem('gameCurrentHintText', this.gameCurrentHintText);
      localStorage.setItem('gameCurrentHasAnyPieceEverBeenSelected', JSON.stringify(this.gameCurrentHasAnyPieceEverBeenSelected));
      localStorage.setItem('userSettingsUseHints', this.userSettingsUseHints);
      window.clearInterval(this.updateInterval);
    },

    AdjustPieceSizeBasedOnViewport() {
      this.appSettingsPieceSize = window.innerWidth < 440 ? (window.innerWidth - 60) / 4 + 'px' : 440 / 4 + 'px';
      this.documentCssRoot.style.setProperty('--pieceSize', this.appSettingsPieceSize);
    },

    HandleOnResizeEvent() {
      this.AdjustPieceSizeBasedOnViewport();
    },

    FormatDate(_date) {
      let _formattedDate = _date.getDay() + '/' + _date.getMonth() + '/' + _date.getFullYear();
      return _formattedDate;
    },

    NumberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    HandleKeyUp(event) {
      event.preventDefault();
      log('HandleKeyUp(event) called');
      log("'" + event.key + "'");
      let _currentThemeIndex = -1;
      this.appSettingsThemes.forEach((theme, i) => {
        if (theme.isSelected) {
          _currentThemeIndex = i;
        }
      });
      switch (event.key) {
        case 'ArrowRight':
          _currentThemeIndex = _currentThemeIndex == this.appSettingsThemes.length - 1 ? 0 : _currentThemeIndex + 1;
          this.SelectTheme(this.appSettingsThemes[_currentThemeIndex]);
          break;
        case 'ArrowLeft':
          _currentThemeIndex = _currentThemeIndex == 0 ? this.appSettingsThemes.length - 1 : _currentThemeIndex - 1;
          this.SelectTheme(this.appSettingsThemes[_currentThemeIndex]);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          break;
        case 'Enter':
        case ' ':
          if (!this.gameCurrentIsGameOver) {
            this.CheckBoard();
          }
          break;
        case 'Escape':
          if (this.appVisualStateShowPageSettings) {
            this.appVisualStateShowPageSettings = false;
          } else if (this.appVisualStateShowPageHighScores) {
            this.appVisualStateShowPageHighScores = false;
          } else if (this.appVisualStateShowPageHowToPlay) {
            this.appVisualStateShowPageHowToPlay = false;
          } else if (this.gameCurrentIsGameOver) {
            this.appVisualStateShowPageHome = true;
          }
          break;
      }
    },
  },

  mounted() {
    this.InitializeGame();
    window.addEventListener('keyup', this.HandleKeyUp);
    window.addEventListener('unload', this.HandleOnUnloadEvent);
    window.addEventListener('resize', this.HandleOnResizeEvent);
  },

  computed: {
    userScoresHighHardByValue: function () {
      function compare(a, b) {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;
        return 0;
      }
      return this.userHighScoresHard.sort(compare).flat().slice(0, this.appSettingsNumberOfHighScoresShown);
    },

    userScoresHighEasyByValue: function () {
      function compare(a, b) {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;
        return 0;
      }
      return this.userHighScoresEasy.sort(compare).flat().slice(0, this.appSettingsNumberOfHighScoresShown);
    },

    userScoresHighInfiniteByValue: function () {
      function compare(a, b) {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;
        return 0;
      }
      return this.userHighScoresInfinite.sort(compare).flat().slice(0, this.appSettingsNumberOfHighScoresShown);
    },
  },
});
