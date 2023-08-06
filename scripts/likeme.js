/// <reference path="../models/ThemeObject.js" />
/// <reference path="../models/PieceObject.js" />
/// <reference path="../models/ModeObject.js" />
/// <reference path="../models/LevelsObject.js" />
/// <reference path="../helpers/getDailyChallenge.js" />
/// <reference path="../helpers/console-enhancer.js" />
/// <reference path="../helpers/howler.js" />

// if (!UseDebug) {
Vue.config.devtools = false;
Vue.config.debug = false;
Vue.config.silent = true;
// }

Vue.config.ignoredElements = ['app', 'oobe', 'wallpaper', 'home', 'modes', 'mode', 'piece', 'glyph', 'gild', 'value', 'checkbox', 'toggle', 'version', 'howto', 'icon', 'chrome', 'quit', 'divider', 'stage', 'gameover', 'clears', 'time', 'playarea', 'addtime', 'board', 'me', 'puzzle', 'hint'];

var app = new Vue({
  el: '#app',

  data: {
    serviceWorker: '',
    storedVersion: 0,
    currentVersion: '3.8.119',
    deviceHasTouch: true,
    wallpaperNames: ['square', 'circle', 'triangle', 'hexagon'],
    currentWallpaper: '',
    newVersionAvailable: false,
    appNotificationMessage: '',
    appSettingsModes: Modes,
    appSettingsSoundFX: new Howl({ src: '../audio/phft4.mp3', volume: 0.5 }),
    appSettingsSaveSettings: true,
    appSettingsModeHardInterval: 100,
    appSettingsModeHardInternalChangeCounterCount: 0,
    appSettingsModeHardIntervalChangeCounterLimit: 10,
    appSettingsNumberOfHighScoresShown: 5,
    appSettingsPieceSize: 10,
    appSettingsScoreTwinIncrement: 10,
    appSettingsScoreSiblingIncrement: 20,
    appSettingsScoreModeHardMultiplier: 4,
    appSettingsThemes: Themes,
    appSettingsTotalNumberOfBoardPieces: 16, // never change this
    appSettingsBoardGridSize: 4, // never change this
    appVisualStateShowPageHighScores: false,
    appVisualStateShowPageChallenge: false,
    appVisualStateShowPageCredits: false,
    appVisualStateShowPageGameOver: false,
    appVisualStateShowPageHome: true,
    appVisualStateShowPageOOBE: false,
    appVisualStateShowPageHowToPlay: false,
    appVisualStateShowPageSettings: false,
    appVisualStateShowElementHint: false,
    appVisualStateShowNotification: false,
    appVisualStateShowElementFlyaway: false,
    appVisualStateShowNewHighScoreElement: false,
    gameCurrentIsPaused: false,
    gameCurrentIsGameOver: true,
    gameDailyChallenge: new AllLevelsObject({}),
    gameCurrentIsGameDailyChallenge: false,
    gameDailyChallengeAlreadyScored: false,
    gameDailyChallengeHasBeenStarted: false,
    gameCurrentAllLevels: [],
    gameCurrentLevel: new SingleLevelObject({}),
    gameCurrentMePiece: { shape: 'square' },
    gameCurrentBoardPieces: [],
    gameCurrentBoardScore: 0,
    gameCurrentTotalScore: 0,
    gameLastHighScore: new ScoreObject({}),
    gameCurrentStartingTime: 180000,
    gameCurrentTimer: 180000,
    gameCurrentNumberOfClears: 0,
    gameCurrentNumberOfPerfectMatches: 0,
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
    userSettingsUseSoundFX: true,
    userSettingsUseDarkMode: false,
    documentCssRoot: document.querySelector(':root'),
  },

  methods: {
    NewGame() {
      log('NewGame() called');
      this.gameCurrentAllLevels = [];
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
      log('CheckBoard() called');
      this.gameCurrentIsUserGuessWrong = false;
      let _totalPossibleLikePieces = 0;
      let _totalBoardScore = 0;
      if (!this.gameCurrentIsGameOver) {
        let _perfectMatch = true;
        this.gameCurrentBoardPieces.forEach((piece) => {
          if ((piece.isMatch && !piece.isSelected) || (!piece.isMatch && piece.isSelected)) {
            _perfectMatch = false;
          }
          if (piece.isMatch) {
            _totalPossibleLikePieces++;
            if (piece.isFullMatch) {
              _totalBoardScore = _totalBoardScore + this.appSettingsScoreTwinIncrement * parseInt(this.appSettingsModes.hard.isSelected ? this.appSettingsScoreModeHardMultiplier : 1);
            } else {
              _totalBoardScore = _totalBoardScore + this.appSettingsScoreSiblingIncrement * parseInt(this.appSettingsModes.hard.isSelected ? this.appSettingsScoreModeHardMultiplier : 1);
            }
          }
        });
        if (_totalPossibleLikePieces == 0) {
          _totalBoardScore = (this.appSettingsScoreTwinIncrement + this.appSettingsScoreSiblingIncrement) * parseInt(this.appSettingsModes.hard.isSelected ? this.appSettingsScoreModeHardMultiplier : 1);
        }
        if (_perfectMatch) {
          this.gameCurrentTotalScore = this.gameCurrentTotalScore + _totalBoardScore;
          this.appVisualStateShowElementHint = false;
          this.gameCurrentHasAnyPieceEverBeenSelected = true;
          if (this.gameCurrentNumberOfMisses === 0 && !this.appSettingsModes.infinite.isSelected) {
            if (!this.gameCurrentHasBonusTimeHintDisplayed) {
              this.gameCurrentNumberOfPerfectMatches++;
              this.appVisualStateShowElementHint = true;
              this.gameCurrentHintText = 'Nice! Matching all pieces on your first attempt adds <b>3 seconds</b> to the clock!';
              this.gameCurrentHasBonusTimeHintDisplayed = true;
            }
            this.gameCurrentTimer = this.gameCurrentTimer + 3000;
            this.appVisualStateShowElementFlyaway = true;
            window.setTimeout(function () {
              app.appVisualStateShowElementFlyaway = false;
            }, 100);
          }
          this.gameCurrentNumberOfClears++;
          this.gameCurrentLevel.completed = true;
          this.NewBoard();
        } else {
          if (this.gameCurrentNumberOfMisses >= 1) {
            this.appVisualStateShowElementHint = true;
            if (_totalPossibleLikePieces === 0) {
              this.gameCurrentHintText = 'Some boards have zero matches.';
            } else {
              this.gameCurrentHintText = _totalPossibleLikePieces === 1 ? 'There is only <b>' + _totalPossibleLikePieces + '</b> piece like me.' : 'There are a total of <b>' + _totalPossibleLikePieces + '</b> pieces like me.';
            }
            let _mismatchFound = false;
            this.gameCurrentBoardPieces.forEach((piece) => {
              piece.nudge = false;
              if (!_mismatchFound && ((piece.isMatch && !piece.isSelected) || (!piece.isMatch && piece.isSelected))) {
                piece.nudge = true;
                _mismatchFound = true;
              }
            });
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
      log('NewBoard() called');
      this.AdjustPieceSizeBasedOnViewport();
      this.gameCurrentBoardPieces = [];
      this.gameCurrentBoardScore = 0;
      this.gameCurrentNumberOfMisses = 0;

      let _board = null;
      if (this.gameDailyChallengeHasBeenStarted) {
        console.log(this.gameDailyChallenge.allLevels);
        this.gameDailyChallenge.allLevels.forEach((level, i) => {
          if (_board === null && !level.completed) {
            error(i);
            _board = level;
          }
        });
      }

      if (_board === null && this.gameDailyChallengeHasBeenStarted) {
        log('ending game due to no more levels');
        this.EndGame();
        return;
      } else if (_board === null) {
        _board = constructLevel(createLevelSource(), true);
      }
      log('continuing with new board');
      this.gameCurrentMePiece = _board.me;
      this.gameCurrentLevel = _board;

      _board.board.forEach((_piece, x) => {
        _piece.delay = (_board.board.length - x) * 40;
        this.gameCurrentBoardPieces.push(_piece);
        window.setTimeout(function () {
          _piece.hasDropped = true;
          if (app.userSettingsUseSoundFX) {
            app.appSettingsSoundFX.play();
          }
        }, _piece.delay);
      });
    },

    TogglePieceSelection(_piece) {
      log('TogglePieceSelection() called for: " this.gameCurrentBoardPieces[' + this.gameCurrentBoardPieces.indexOf(_piece) + ']"');
      this.appVisualStateShowElementHint = false;
      _piece.nudge = false;
      if (!this.gameCurrentIsGameOver) {
        _piece.isSelected = !_piece.isSelected;
        this.gameCurrentHasAnyPieceEverBeenSelected = true;
      }
    },

    ShareApp() {
      let _shareObject = {
        title: 'Like Me?',
        text: 'A game of matching likenesses!',
        url: 'https://' + window.location.host,
      };
      if (this.CheckForMobile()) {
        navigator.share(_shareObject);
      } else {
        _shareObject = 'https://' + window.location.host;
        this.appVisualStateShowNotification = true;
        this.appNotificationMessage = 'Copied app url to clipboard.';
        navigator.clipboard.writeText(_shareObject);
      }
    },

    ShareScore() {
      let _shareText = document.getElementById('copyme').textContent;
      if (this.CheckForMobile()) {
        let _shareObject = {
          text: _shareText,
        };
        navigator.share(_shareObject);
      } else {
        this.appVisualStateShowNotification = true;
        this.appNotificationMessage = 'Score results copied to clipboard.';
        navigator.clipboard.writeText(_shareText);
      }
    },

    RestartGame() {
      log('RestartGame() called');
      this.gameCurrentTimer = this.appSettingsModes.infinite.isSelected ? 0 : this.gameCurrentStartingTime;
      this.gameCurrentNumberOfFails = 0;
      this.gameCurrentNumberOfClears = 0;
      this.gameCurrentNumberOfPerfectMatches = 0;
      this.appVisualStateShowNotification = false;
      this.appVisualStateShowPageHome = false;
      this.appVisualStateShowPageGameOver = false;
      this.appVisualStateShowElementHint = false;
      this.gameCurrentIsPaused = false;
      this.gameCurrentHintText = 'Select pieces that share <b>at least two</b> of my attributes (color, shape, pattern).';
      this.gameCurrentHasAnyPieceEverBeenSelected = false;
      this.NewGame();
    },

    SelectMode(_mode) {
      log('SelectMode(mode) called for:  "' + _mode.name + '"');
      if (_mode === this.appSettingsModes.hard && !this.appSettingsModes.hard.isSelected) {
        this.appSettingsModes.easy.isSelected = false;
        this.appSettingsModes.hard.isSelected = true;
        this.appSettingsModes.infinite.isSelected = false;
      } else if (_mode === this.appSettingsModes.easy && !this.appSettingsModes.easy.isSelected) {
        this.appSettingsModes.easy.isSelected = true;
        this.appSettingsModes.hard.isSelected = false;
        this.appSettingsModes.infinite.isSelected = false;
      } else if (_mode === this.appSettingsModes.infinite && !this.appSettingsModes.infinite.isSelected) {
        this.appSettingsModes.easy.isSelected = false;
        this.appSettingsModes.hard.isSelected = false;
        this.appSettingsModes.infinite.isSelected = true;
      }
    },

    SelectTheme(_theme) {
      log('SelectTheme(theme) called for: "' + _theme.name + '"');
      this.appSettingsThemes.forEach((t) => {
        t.isSelected = _theme == t;
      });
      this.documentCssRoot.style.setProperty('--color1', _theme.color1);
      this.documentCssRoot.style.setProperty('--color2', _theme.color2);
      this.documentCssRoot.style.setProperty('--color3', _theme.color3);
      this.documentCssRoot.style.setProperty('--color3contrast', _theme.color3contrast);
      localStorage.setItem('userSettingsTheme', JSON.stringify(_theme.name));
    },

    UpdateApp() {
      if (!this.gameCurrentIsPaused && !this.appVisualStateShowPageGameOver) {
        if (this.gameCurrentTimer > 0 || (this.appSettingsModes.infinite.isSelected && !this.gameCurrentIsGameOver)) {
          this.appSettingsModeHardInternalChangeCounterCount++;
          if (!this.appSettingsModes.infinite.isSelected) {
            this.gameCurrentTimer = this.gameCurrentTimer - this.appSettingsModeHardInterval;
          } else {
            this.gameCurrentTimer = parseInt(this.gameCurrentTimer) + parseInt(this.appSettingsModeHardInterval);
          }
        } else {
          if (!this.gameCurrentIsGameOver) {
            this.EndGame();
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
            let _rando = this.gameCurrentBoardPieces[_index];
            _rando.shape = Shapes[getRandomInt(0, Shapes.length)];
            _rando.color = Colors[getRandomInt(0, Colors.length)];
            _rando.backgroundImage = BackgroundImages[getRandomInt(0, BackgroundImages.length)];

            let _likeness = 0;
            if (_rando.color === this.gameCurrentMePiece.color) {
              _likeness++;
            }
            if (_rando.shape === this.gameCurrentMePiece.shape) {
              _likeness++;
            }
            if (_rando.backgroundImage === this.gameCurrentMePiece.backgroundImage) {
              _likeness++;
            }
            _rando.isMatch = _likeness > 1;
            _rando.isFullMatch = _likeness === 3;
          }

          this.appSettingsModeHardInternalChangeCounterCount = 0;
        }
      }
    },

    GetMsToTime(s) {
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;

      var secstring = ':' + ('0' + secs).slice(-2);
      var minstring = mins != 0 ? mins : '';
      var hrsstring = hrs != 0 ? hrs + ':' : '';
      return this.appSettingsModes.infinite.isSelected ? hrsstring + minstring + secstring : minstring + secstring;
    },

    EndGame() {
      log('EndGame() called');

      let _score = new ScoreObject({
        value: this.gameCurrentTotalScore,
        isDaily: this.gameCurrentIsGameDailyChallenge,
      });
      if (this.appSettingsModes.easy.isSelected) {
        this.userHighScoresEasy.push(_score);
        if (_score === this.userScoresHighEasyByValue[0]) {
          this.appVisualStateShowNewHighScoreElement = true;
        }
        localStorage.setItem('userHighScoresEasy', JSON.stringify(this.userHighScoresEasy));
      } else if (this.appSettingsModes.hard.isSelected) {
        this.userHighScoresHard.push(_score);
        if (_score === this.userScoresHighHardByValue[0]) {
          this.appVisualStateShowNewHighScoreElement = true;
        }
        localStorage.setItem('userHighScoresHard', JSON.stringify(this.userHighScoresHard));
      } else if (this.appSettingsModes.infinite.isSelected) {
        this.userHighScoresInfinite.push(_score);
        localStorage.setItem('userHighScoresInfinite', JSON.stringify(this.userHighScoresInfinite));
      }
      _score.isCurrent = true;
      this.gameLastHighScore = _score;

      this.gameCurrentLevel.completed = true;
      if (this.gameCurrentIsGameDailyChallenge) {
        this.GetDailyChallenge();
      }
      this.gameCurrentIsGameOver = true;
      this.gameDailyChallengeHasBeenStarted = false;
      this.appVisualStateShowPageChallenge = false;
      this.appVisualStateShowPageGameOver = true;
      this.gameCurrentIsGameDailyChallenge = false;
      this.gameDailyChallenge.completed = true; // bad, but I don't think it's actually used. fix soon.
    },

    CheckIfUserHasScoredDailyChallenge(fromCallback = false) {
      log('CheckIfUserHasScoredDailyChallenge() called');
      this.gameDailyChallengeAlreadyScored = false;
      _today = this.FormatDate(new Date());
      this.userHighScoresEasy.forEach((_score) => {
        if (_score.isDaily && this.FormatDate(_score.date) === _today) {
          this.gameDailyChallengeAlreadyScored = true;
          return;
        }
      });
      return this.gameDailyChallengeAlreadyScored;
    },

    ToggleUsingHints(event) {
      log('ToggleUsingHints(event) called');
      event.stopPropagation();
      event.preventDefault();
      this.userSettingsUseHints = !this.userSettingsUseHints;
      if (!this.userSettingsUseHints) {
        this.gameCurrentBoardPieces.forEach((_piece) => {
          _piece.nudge = false;
        });
      }
      localStorage.setItem('userSettingsUseHints', this.userSettingsUseHints);
    },

    ToggleUsingSound(event) {
      log('ToggleUsingSound(event) called');
      event.stopPropagation();
      event.preventDefault();
      this.userSettingsUseSoundFX = !this.userSettingsUseSoundFX;
      localStorage.setItem('userSettingsUseSoundFX', this.userSettingsUseSoundFX);
    },

    ToggleUsingDarkMode(event) {
      log('ToggleUsingDarkMode(event) called');
      if (event != undefined) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.userSettingsUseDarkMode = !this.userSettingsUseDarkMode;
      document.getElementById('themeColor').content = this.userSettingsUseDarkMode ? '#000000' : '#f0f0f0';
      localStorage.setItem('userSettingsUseDarkMode', this.userSettingsUseDarkMode);
    },

    ToggleGamePause(event, _value) {
      log('ToggleGamePause(event) called');
      if (event != undefined) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.gameCurrentIsPaused = _value;
      localStorage.setItem('gameCurrentIsPaused', this.gameCurrentIsPaused);
      if (_value) {
        this.appVisualStateShowElementHint = false;
      }
    },

    ResetModalContentScrollPositions() {
      log('ResetModalContentScrollPositions() called');
      let _contentElements = document.getElementsByTagName('content');
      for (let i = 0; i < _contentElements.length; i++) {
        const element = _contentElements[i];
        element.scroll({ top: 0 });
      }
    },

    ToggleChallenge(event, _value) {
      log('ToggleHowToPlay(event, value) called');
      if (event != null) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageChallenge = _value;
    },

    ToggleHowToPlay(event, _value) {
      log('ToggleHowToPlay(event, value) called');
      event.stopPropagation();
      event.preventDefault();
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageHowToPlay = _value;
    },

    ToggleOOBE(event, _value) {
      log('ToggleOOBE(event, value) called');
      if (event != null) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageOOBE = _value;
    },

    ToggleHighScores(event, _value) {
      log('ToggleHighScores(event, value) called');
      event.stopPropagation();
      event.preventDefault();
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageGameOver = false;
      this.appVisualStateShowPageHome = true;
      this.appVisualStateShowPageHighScores = _value;
    },

    ToggleSettings(event, _value) {
      log('ToggleSettings(event, value) called');
      event.stopPropagation();
      event.preventDefault();
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageSettings = _value;
    },

    ToggleCredits(event, _value) {
      log('ToggleCredits(event, value) called');
      event.stopPropagation();
      event.preventDefault();
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageCredits = _value;
    },

    GetUserSettings() {
      log('GetUserSettings() called');

      if (localStorage.length === 0) {
        this.ToggleOOBE(null, true);
      }

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

      let _sounds = localStorage.getItem('userSettingsUseSoundFX');
      if (_sounds !== undefined && _sounds !== null) {
        _sounds = JSON.parse(_sounds);
        this.userSettingsUseSoundFX = _sounds;
      }

      let _darkmode = localStorage.getItem('userSettingsUseDarkMode');
      if (_darkmode !== undefined && _darkmode !== null) {
        _darkmode = JSON.parse(_darkmode);
        this.userSettingsUseDarkMode = _darkmode;
        document.getElementById('themeColor').content = this.userSettingsUseDarkMode ? '#000000' : '#f0f0f0';
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
            this.userHighScoresEasy.push(new ScoreObject({ date: new Date(s.date), isDaily: s.isDaily, value: s.value }));
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
      log('ClearAllUserScores() called');
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
      log('RestoreCurrentGame() called');
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

      let _appSettingsBoardGridSize = localStorage.getItem('appSettingsBoardGridSize');
      try {
        if (_appSettingsBoardGridSize !== undefined && _appSettingsBoardGridSize !== null) {
          this.appSettingsBoardGridSize = _appSettingsBoardGridSize;
        }
      } catch (error) {
        log('_appSettingsBoardGridSize error: ' + error);
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

      let _gameCurrentIsPaused = localStorage.getItem('gameCurrentIsPaused');
      try {
        if (_gameCurrentIsPaused !== undefined && _gameCurrentIsPaused !== null) {
          _gameCurrentIsPaused = JSON.parse(_gameCurrentIsPaused);
          this.gameCurrentIsPaused = _gameCurrentIsPaused;
        }
      } catch (error) {
        log('_gameCurrentIsPaused error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameDailyChallenge = localStorage.getItem('gameDailyChallenge');
      try {
        if (_gameDailyChallenge !== undefined && _gameDailyChallenge !== null) {
          _gameDailyChallenge = JSON.parse(_gameDailyChallenge);
          _letAllLevels = new AllLevelsObject({ date: _gameDailyChallenge.date });
          _gameDailyChallenge.allLevels.forEach((level) => {
            let _level = new SingleLevelObject({ me: level.me, completed: level.completed });
            level.board.forEach((piece) => {
              _level.board.push(new PieceObject(piece));
            });
            _letAllLevels.allLevels.push(_level);
          });
          this.gameDailyChallenge = _letAllLevels;
        }
      } catch (error) {
        log('_gameDailyChallenge error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentIsGameDailyChallenge = localStorage.getItem('gameCurrentIsGameDailyChallenge');
      try {
        if (_gameCurrentIsGameDailyChallenge !== undefined && _gameCurrentIsGameDailyChallenge !== null) {
          _gameCurrentIsGameDailyChallenge = JSON.parse(_gameCurrentIsGameDailyChallenge);
          this.gameCurrentIsGameDailyChallenge = _gameCurrentIsGameDailyChallenge;
        }
      } catch (error) {
        log('_gameCurrentIsGameDailyChallenge error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameDailyChallengeHasBeenStarted = localStorage.getItem('gameDailyChallengeHasBeenStarted');
      try {
        if (_gameDailyChallengeHasBeenStarted !== undefined && _gameDailyChallengeHasBeenStarted !== null) {
          _gameDailyChallengeHasBeenStarted = JSON.parse(_gameDailyChallengeHasBeenStarted);
          this.gameDailyChallengeHasBeenStarted = _gameDailyChallengeHasBeenStarted;
        }
      } catch (error) {
        log('_gameDailyChallengeHasBeenStarted error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentAllLevels = localStorage.getItem('gameCurrentAllLevels');
      try {
        if (_gameCurrentAllLevels !== undefined && _gameCurrentAllLevels !== null) {
          _gameCurrentAllLevels = JSON.parse(_gameCurrentAllLevels);
          this.gameCurrentAllLevels = _gameCurrentAllLevels;
        }
      } catch (error) {
        log('_gameCurrentAllLevels error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentLevel = localStorage.getItem('gameCurrentLevel');
      try {
        if (_gameCurrentLevel !== undefined && _gameCurrentLevel !== null) {
          _gameCurrentLevel = JSON.parse(_gameCurrentLevel);
          let _level = new SingleLevelObject({ me: _gameCurrentLevel.me, completed: _gameCurrentLevel.completed });
          _gameCurrentLevel.board.forEach((piece) => {
            _level.board.push(new PieceObject(piece));
          });
          this.gameCurrentLevel = _level;
        }
      } catch (error) {
        log('_gameCurrentLevel error: ' + error);
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

      let _gameCurrentNumberOfPerfectMatches = localStorage.getItem('gameCurrentNumberOfPerfectMatches');
      try {
        if (_gameCurrentNumberOfPerfectMatches !== undefined && _gameCurrentNumberOfPerfectMatches !== null) {
          this.gameCurrentNumberOfPerfectMatches = _gameCurrentNumberOfPerfectMatches;
        }
      } catch (error) {
        log('_gameCurrentNumberOfPerfectMatches error: ' + error);
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

      let _gameCurrentHintText = localStorage.getItem('gameCurrentHintText');
      try {
        if (_gameCurrentHintText !== undefined && _gameCurrentHintText !== null) {
          this.gameCurrentHintText = _gameCurrentHintText;
        }
      } catch (error) {
        log('_gameCurrentHintText error: ' + error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentTotalScore = localStorage.getItem('gameCurrentTotalScore');
      try {
        if (_gameCurrentTotalScore !== undefined && _gameCurrentTotalScore !== null) {
          this.gameCurrentTotalScore = parseInt(_gameCurrentTotalScore);
        }
      } catch (error) {
        log('_gameCurrentTotalScore error: ' + error);
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

      this.CheckIfUserHasScoredDailyChallenge();

      if (_gameDataCorrupt) {
        this.gameCurrentIsGameOver = true;
        this.NewGame();
      }
    },

    InitializeGame() {
      announce('App Initialized');
      this.AdjustPieceSizeBasedOnViewport();
      this.CheckForMobile();

      this.currentWallpaper = this.wallpaperNames[getRandomInt(0, this.wallpaperNames.length)];
      document.getElementsByTagName('wallpaper')[0].className = this.currentWallpaper;

      let _onemoretime = localStorage.getItem('onemoretime');
      try {
        if (_onemoretime !== undefined && _onemoretime !== null) {
          _onemoretime = JSON.parse(_onemoretime);
          if (_onemoretime) {
            localStorage.setItem('onemoretime', false);
            window.location.reload(true);
          }
        }
      } catch (error) {
        log('_onemoretime error: ' + error);
      }

      let _newVersionAvailable = localStorage.getItem('newVersionAvailable');
      try {
        if (_newVersionAvailable !== undefined && _newVersionAvailable !== null) {
          this.newVersionAvailable = JSON.parse(_newVersionAvailable);
        }
      } catch (error) {
        log('_newVersionAvailable error: ' + error);
      }

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

      if (!this.gameCurrentIsGameOver) {
        this.RestoreCurrentGame();
      } else {
        this.GetDailyChallenge();
      }

      this.updateInterval = window.setInterval(this.UpdateApp, this.appSettingsModeHardInterval);
    },

    HandleOnPageHideEvent() {
      window.clearInterval(this.updateInterval);
      this.appSettingsSoundFX.unload();
      if (this.appSettingsSaveSettings) {
        localStorage.setItem('storedVersion', this.currentVersion);
        localStorage.setItem('appSettingsModes', JSON.stringify(this.appSettingsModes));
        localStorage.setItem('appSettingsModeHardInterval', this.appSettingsModeHardInterval);
        localStorage.setItem('appSettingsModeHardInternalChangeCounterCount', this.appSettingsModeHardInternalChangeCounterCount);
        localStorage.setItem('appSettingsModeHardIntervalChangeCounterLimit', this.appSettingsModeHardIntervalChangeCounterLimit);
        localStorage.setItem('appSettingsPieceSize', this.appSettingsPieceSize);
        localStorage.setItem('appSettingsTotalNumberOfBoardPieces', this.appSettingsTotalNumberOfBoardPieces);
        localStorage.setItem('appSettingsBoardGridSize', this.appSettingsBoardGridSize);
        localStorage.setItem('appVisualStateShowPageHome', JSON.stringify(this.appVisualStateShowPageHome));
        localStorage.setItem('appVisualStateShowPageHowToPlay', JSON.stringify(this.appVisualStateShowPageHowToPlay));
        localStorage.setItem('appVisualStateShowPageSettings', JSON.stringify(this.appVisualStateShowPageSettings));
        localStorage.setItem('appVisualStateShowElementHint', JSON.stringify(this.appVisualStateShowElementHint));
        localStorage.setItem('appVisualStateShowElementFlyaway', JSON.stringify(this.appVisualStateShowElementFlyaway));
        localStorage.setItem('gameDailyChallenge', JSON.stringify(this.gameDailyChallenge));
        localStorage.setItem('gameCurrentIsGameDailyChallenge', JSON.stringify(this.gameCurrentIsGameDailyChallenge));
        localStorage.setItem('gameDailyChallengeHasBeenStarted', JSON.stringify(this.gameDailyChallengeHasBeenStarted));
        localStorage.setItem('gameCurrentAllLevels', JSON.stringify(this.gameCurrentAllLevels));
        localStorage.setItem('gameCurrentLevel', JSON.stringify(this.gameCurrentLevel));
        localStorage.setItem('gameCurrentIsGameOver', JSON.stringify(this.gameCurrentIsGameOver));
        localStorage.setItem('gameCurrentMePiece', JSON.stringify(this.gameCurrentMePiece));
        localStorage.setItem('gameCurrentBoardPieces', JSON.stringify(this.gameCurrentBoardPieces));
        localStorage.setItem('gameCurrentStartingTime', this.gameCurrentStartingTime);
        localStorage.setItem('gameCurrentTimer', this.gameCurrentTimer);
        localStorage.setItem('gameCurrentNumberOfClears', this.gameCurrentNumberOfClears);
        localStorage.setItem('gameCurrentNumberOfPerfectMatches', this.gameCurrentNumberOfPerfectMatches);
        localStorage.setItem('gameCurrentIsUserGuessWrong', JSON.stringify(this.gameCurrentIsUserGuessWrong));
        localStorage.setItem('gameCurrentNumberOfFails', this.gameCurrentNumberOfFails);
        localStorage.setItem('gameCurrentNumberOfMisses', this.gameCurrentNumberOfMisses);
        localStorage.setItem('gameCurrentHintText', this.gameCurrentHintText);
        localStorage.setItem('gameCurrentTotalScore', this.gameCurrentTotalScore);
        localStorage.setItem('gameCurrentHasAnyPieceEverBeenSelected', JSON.stringify(this.gameCurrentHasAnyPieceEverBeenSelected));
        localStorage.setItem('userSettingsUseHints', this.userSettingsUseHints);
        localStorage.setItem('userSettingsUseSoundFX', this.userSettingsUseSoundFX);
        localStorage.setItem('userSettingsUseDarkMode', this.userSettingsUseDarkMode);
      }
    },

    HandleOnPageShowEvent() {
      this.appSettingsSoundFX = new Howl({ src: '../audio/phft4.mp3', volume: 0.5 });
    },

    AdjustPieceSizeBasedOnViewport() {
      this.appSettingsPieceSize = window.innerWidth < 500 ? (window.innerWidth - 60) / this.appSettingsBoardGridSize + 'px' : 450 / this.appSettingsBoardGridSize + 'px';
      this.documentCssRoot.style.setProperty('--pieceSize', this.appSettingsPieceSize);
      this.appSettingsTotalNumberOfBoardPieces = window.innerHeight < 234 ? 12 : 16;
    },

    GetDailyChallenge() {
      log('GetDailyChallenge() called');
      readDailyChallengeFile(function (contents, result) {
        app.gameDailyChallenge = new AllLevelsObject({});
        if (contents !== null && contents !== undefined) {
          constructAllLevels(contents, app.gameDailyChallenge);
          app.CheckIfUserHasScoredDailyChallenge(true);
        }
      });
    },

    StartDailyChallenge() {
      log('StartDailyChallenge() called');
      this.SelectMode(this.appSettingsModes.easy);
      this.gameDailyChallengeHasBeenStarted = true;
      this.gameCurrentIsGameDailyChallenge = true;
      this.RestartGame();
    },

    HandleOnResizeEvent() {
      this.AdjustPieceSizeBasedOnViewport();
    },

    FormatDate(_date) {
      let _newDate = new Date(_date).toLocaleDateString();
      return _newDate;
    },

    NumberWithCommas(_num) {
      return _num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    CheckForMobile() {
      let _check = 'ontouchstart' in document.documentElement;
      this.deviceHasTouch = _check;
      return _check;
    },

    HandleKeyUp(event) {
      // event.preventDefault();
      log('HandleKeyUp(event) called');
      let _currentThemeIndex = -1;
      this.appSettingsThemes.forEach((theme, i) => {
        if (theme.isSelected) {
          _currentThemeIndex = i;
        }
      });
      switch (event.key) {
        case ']':
          _currentThemeIndex = _currentThemeIndex == this.appSettingsThemes.length - 1 ? 0 : _currentThemeIndex + 1;
          this.SelectTheme(this.appSettingsThemes[_currentThemeIndex]);
          break;
        case '[':
          _currentThemeIndex = _currentThemeIndex == 0 ? this.appSettingsThemes.length - 1 : _currentThemeIndex - 1;
          this.SelectTheme(this.appSettingsThemes[_currentThemeIndex]);
          break;
        case '/':
          this.ToggleUsingDarkMode();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          break;
        case 'Enter':
        case ' ':
          if (!this.gameCurrentIsGameOver && !this.appVisualStateShowPageChallenge) {
            this.CheckBoard();
          } else if (this.appVisualStateShowPageChallenge) {
            this.EndGame();
          }
          break;
        case 'Escape':
          if (this.gameCurrentIsGameOver) {
            this.appVisualStateShowPageHome = true;
          }
          this.appVisualStateShowPageSettings = false;
          this.appVisualStateShowPageHighScores = false;
          this.appVisualStateShowPageHowToPlay = false;
          this.appVisualStateShowPageCredits = false;
          this.appVisualStateShowPageChallenge = false;
          this.appVisualStateShowElementHint = false;
          this.appVisualStateShowPageGameOver = false;
          break;
      }
    },

    HandleUpdateAppButtonClick() {
      log('HandleUpdateAppButtonClick() called');
      this.newVersionAvailable = false;
      localStorage.setItem('newVersionAvailable', this.newVersionAvailable);
      if (this.serviceWorker !== '') {
        this.serviceWorker.postMessage({ action: 'skipWaiting' });
      } else {
        window.location.reload(true);
      }
    },

    HandleServiceWorkerRegistration() {
      log('HandleServiceWorkerRegistration() called');
      if ('serviceWorker' in navigator) {
        // Register the service worker
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          reg.addEventListener('updatefound', () => {
            // An updated service worker has appeared in reg.installing!
            this.serviceWorker = reg.installing;
            this.serviceWorker.addEventListener('statechange', () => {
              // Has service worker state changed?
              switch (this.serviceWorker.state) {
                case 'installed':
                  // There is a new service worker available, show the notification
                  if (navigator.serviceWorker.controller) {
                    this.newVersionAvailable = true;
                    localStorage.setItem('newVersionAvailable', this.newVersionAvailable);
                  }
                  break;
              }
            });
          });
        });
      }
    },
  },

  mounted() {
    this.HandleServiceWorkerRegistration();
    this.InitializeGame();
    window.addEventListener('keyup', this.HandleKeyUp);
    window.addEventListener('pageshow', this.HandleOnPageShowEvent);
    window.addEventListener('pagehide', this.HandleOnPageHideEvent);
    window.addEventListener('resize', this.HandleOnResizeEvent);
    if (navigator.serviceWorker != undefined) {
      navigator.serviceWorker.addEventListener('message', this.HandleServiceWorkerWaiting);
      let refreshing;
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (refreshing) return;
        localStorage.setItem('onemoretime', true);
        window.location.reload();
        refreshing = true;
      });
    }
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
