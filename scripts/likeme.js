/// <reference path="../helpers/console-enhancer.js" />
/// <reference path="../models/RankObject.js" />
/// <reference path="../models/CurrencyObject.js" />
/// <reference path="../models/ActionItemObject.js" />
/// <reference path="../models/TutorialStepObject.js" />
/// <reference path="../models/ThemeObject.js" />
/// <reference path="../models/PieceObject.js" />
/// <reference path="../models/ModeObject.js" />
/// <reference path="../models/LevelsObject.js" />
/// <reference path="../helpers/getDailyChallenge.js" />
/// <reference path="../helpers/howler.js" />

Vue.config.devtools = UseDebug;
Vue.config.debug = UseDebug;
Vue.config.silent = !UseDebug;

Vue.config.ignoredElements = ['app', 'tutorial', 'oobe', 'wallpaper', 'home', 'modes', 'mode', 'piece', 'glyph', 'gild', 'value', 'checkbox', 'toggle', 'version', 'howto', 'icon', 'chrome', 'quit', 'divider', 'stage', 'gameover', 'clears', 'time', 'playarea', 'addtime', 'board', 'me', 'puzzle', 'hint'];

var app = new Vue({
  el: '#app',

  data: {
    serviceWorker: '',
    storedVersion: 0,
    currentVersion: '4.2.295',
    deviceHasTouch: true,
    allPlayerRanks: AllPlayerRanks,
    currency: new Currency(),
    timeToMidnight: '24h 0m 0s',
    isGettingDailyChallenge: false,
    getDailyTimeThreshold: 86400000,
    isInNativeAppWebView: false,
    wallpaperNames: ['square', 'circle', 'triangle', 'hexagon'],
    splashBoard: false,
    currentWallpaper: '',
    newVersionAvailable: false,
    appTutorialUserHasSeen: false,
    appTutorialCurrentStepIndex: 0,
    appTutorialSteps: TutorialSteps,
    appTutorialBoardPieces: constructLevel('010013110020010303112100220221213211102001200313120', true),
    appTutorialIsInPlay: false,
    appTutorialMePiece: new PieceObject({ color: 'var(--color2)' }),
    appNotificationMessage: '',
    appSettingsAddBonusToScoreInterval: null,
    appSettingsModes: Modes,
    appSettingsEnableEconomy: true,
    appSettingsCurrentGameMode: null,
    appSettingsInfiniteMode: null,
    appIsBeingReset: false,
    appSettingsSoundFX: new Howl({
      src: './audio/phts.mp3',
      volume: 0.05,
    }),
    appSettingsWinFX: new Howl({
      src: './audio/triumph.mp3',
      volume: 0.05,
    }),
    appSettingsLevelUpFX: new Howl({
      src: './audio/levelup.mp3',
      volume: 0.07,
    }),
    appSettingsSadFX: new Howl({
      src: './audio/sadsound.mp3',
      volume: 0.1,
    }),
    userSettingsMusicVolume: 0.15,
    appSettingsThemeSong: new Howl({
      src: './audio/themesong.m4a',
      volume: 0,
      loop: true,
      id: 'theme',
    }),
    appSettingsHardcoreEmoji: '🤯',
    appSettingsHardcoreFinishedEmoji: '🤯',
    appSettingsSaveSettings: true,
    appSettingsModeIntervalIncrement: 100,
    appSettingsNumberOfHighScoresShown: 5,
    appSettingsPieceSize: 10,
    appSettingsScoreTwinIncrement: 10,
    appSettingsScoreSiblingIncrement: 20,
    appSettingsShowSimpleRankPlaques: false,
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
    appVisualStateShowPageAchievements: false,
    appVisualStateShowPageSettings: false,
    appVisualStateShowPageManageCurrency: false,
    appVisualStateShowGameOverContent: true,
    appVisualStateShowElementHint: false,
    appVisualStateShowNotification: false,
    appVisualStateShowElementFlyaway: false,
    appVisualStateShowNewHighScoreElement: false,
    appVisualStateIsAddingBonusTime: false,
    gameConfettiCount: 0,
    gameCurrentIsPaused: true,
    gameCurrentIsGameOver: true,
    gameDailyChallenge: new AllLevelsObject({}),
    gameCurrentIsGameDailyChallenge: false,
    gameDailyChallengeAlreadyScored: false,
    gameDailyChallengeHasBeenStarted: false,
    gameCurrentAllLevels: [],
    gameCurrentUpdatedCurrencyDeltas: [],
    gameCurrentLevel: new SingleLevelObject({}),
    gameCurrentMePiece: { shape: 'square' },
    gameCurrentBoardPieces: [],
    gameCurrentJustRankedUp: false,
    gameCurrentBoardScore: 0,
    gameCurrentTotalScore: 0,
    gameLastHighScore: new ScoreObject({}),
    gameScoreToShare: new ScoreObject({}),
    gameCurrentStartingTime: 61000,
    gameCurrentTimer: 61000,
    gameCurrentNumberOfClears: 0,
    gameCurrentNumberOfPerfectMatches: 0,
    gameCurrentIsUserGuessWrong: false,
    gameCurrentNumberOfFails: 0,
    gameCurrentNumberOfMisses: 0,
    gameCurrentHasBonusTimeHintDisplayed: false,
    gameCurrentHintText: 'Select pieces that share <b>at least 2</b> of my attributes: color, shape, or pattern.',
    gameCurrentHasAnyPieceEverBeenSelected: false,
    gameLikenessNudgeHasBeenShown: false,
    gameClickMeNudgeHasBeenShown: false,
    userSettingsUseCats: false,
    userDailyLevel: 0,
    userHighScoresInfinite: [],
    userHighScoresEasy: [],
    userRank: 0,
    userNumberOfPerfectBasicGames: 0,
    tempPerfectBasicGames: 0,
    userSettingsActionItems: ActonItems,
    userSettingsUseAltPatterns: false,
    userSettingsUseHints: true,
    userSettingsUseSoundFX: true,
    userSettingsPlayMusic: true,
    userSettingsUseDarkMode: false,
    userCurrency: Currencies,
    userSettingsUseHardCoreMode: false,
    usersModeBeforeDailyChallenge: null,
    userTutorialCheckCount: 0,
    documentCssRoot: document.querySelector(':root'),
  },

  methods: {
    NewGame() {
      note('NewGame() called');
      this.gameCurrentAllLevels = [];
      this.NewBoard();
      this.userHighScoresEasy.forEach((s) => {
        s.isCurrent = false;
      });
      this.userHighScoresInfinite.forEach((s) => {
        s.isCurrent = false;
      });

      this.gameCurrentUpdatedCurrencyDeltas = 0;
      this.appVisualStateShowNewHighScoreElement = false;
      this.tempPerfectBasicGames = this.userNumberOfPerfectBasicGames;
      this.gameCurrentTotalScore = 0;
      this.gameCurrentIsGameOver = false;
    },

    ResetApp() {
      note('NewGame() called');
      let confirm = window.confirm('Are you sure you want to reset the entire app? Everything will be lost!');
      if (confirm) {
        this.appIsBeingReset = true;
        localStorage.clear();
        window.location.reload();
      }
    },

    CheckBoard() {
      note('CheckBoard() called');
      this.appVisualStateShowElementHint = false;
      this.gameCurrentIsUserGuessWrong = false;
      let _totalPossibleLikePieces = 0;
      let _totalBoardScore = 0;
      this.gameClickMeNudgeHasBeenShown = true;
      if (!this.gameCurrentIsGameOver) {
        let _perfectMatch = true;
        this.gameCurrentBoardPieces.forEach((piece) => {
          if ((piece.isMatch && !piece.isSelected) || (!piece.isMatch && piece.isSelected)) {
            _perfectMatch = false;
          }
          if (piece.isMatch) {
            _totalPossibleLikePieces++;
            if (piece.isFullMatch) {
              _totalBoardScore = _totalBoardScore + this.appSettingsScoreTwinIncrement;
            } else {
              _totalBoardScore = _totalBoardScore + this.appSettingsScoreSiblingIncrement;
            }
          }
        });
        if (_totalPossibleLikePieces == 0) {
          _totalBoardScore = this.appSettingsScoreTwinIncrement + this.appSettingsScoreSiblingIncrement;
        }
        if (_perfectMatch) {
          this.gameLikenessNudgeHasBeenShown = true;
          this.gameCurrentTotalScore = this.gameCurrentTotalScore + _totalBoardScore;
          this.appVisualStateShowElementHint = false;
          this.gameCurrentHasAnyPieceEverBeenSelected = true;
          if (this.gameCurrentNumberOfMisses === 0 && !this.GetModeById('infinite').isSelected) {
            this.gameCurrentNumberOfPerfectMatches++;
            this.AddTimeBonus();
          }
          this.gameCurrentNumberOfClears++;
          this.gameCurrentLevel.completed = true;
          this.NewBoard();
        } else if (this.appSettingsEnableEconomy && this.userSettingsActionItems[0].count > 0) {
          this.IdentifyMismatches();
          this.userSettingsActionItems[0].count--;
        } else {
          if (this.gameCurrentNumberOfMisses >= 1) {
            this.appVisualStateShowElementHint = true;
            if (_totalPossibleLikePieces === 0) {
              this.gameCurrentHintText = 'Some levels have zero matches.';
            } else {
              this.gameCurrentHintText = _totalPossibleLikePieces === 1 ? 'There is only <b>' + _totalPossibleLikePieces + '</b> piece like me.' : 'There are a total of <b>' + _totalPossibleLikePieces + '</b> pieces like me.';
            }
            if (this.userSettingsUseHints) {
              this.IdentifyMismatches();
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

    RemoveConfetti() {
      note('RemoveConfetti() called');
      let allConfetti = document.getElementsByTagName('confetti');
      for (let _x = allConfetti.length - 1; _x >= 0; _x--) {
        document.body.removeChild(allConfetti[_x]);
      }
    },

    CreateConfetti(_hue = null, _rank = null) {
      note('CreateConfetti() called');
      this.RemoveConfetti();
      _rank = _rank === null ? this.userRank : _rank;
      let domApp = document.getElementsByTagName('app')[0];
      let count = domApp.clientWidth;

      let useHue = _rank !== this.getLastRank.rank;

      if (_rank !== null && _rank === this.getLastRank.rank) {
        useHue = false;
      }

      for (let x = 0; x < count; x++) {
        let confetti = document.createElement('confetti');
        let hue = useHue ? this.getCurrentPlayerRank.hue : getRandomInt(0, 360);
        if (_hue !== null && useHue) {
          hue = _hue;
        }

        let lightness = useHue ? getRandomInt(50, 100) : 60;
        confetti.style.setProperty('left', getRandomInt(0, domApp.clientWidth) + (window.innerWidth - domApp.clientWidth) / 2 + 'px');
        confetti.style.setProperty('transition-duration', getRandomInt(1600, 3001) + 'ms');
        confetti.style.setProperty('transition-delay', getRandomInt(0, 800) + 'ms');
        confetti.style.setProperty('background-color', 'hsl(' + hue + ',80%, ' + lightness + '%)');
        confetti.style.setProperty('rotate', +'deg');
        let width = getRandomInt(40, 100) / 10;
        let height = getRandomInt(40, 100) / 10;
        confetti.style.setProperty('width', width + 'px');
        confetti.style.setProperty('height', height + 'px');
        document.body.appendChild(confetti);
      }
      window.setTimeout(
        function () {
          let allConfetti = document.getElementsByTagName('confetti');
          for (let _x = 0; _x < allConfetti.length; _x++) {
            const confetti = allConfetti[_x];
            confetti.style.setProperty('translate', parseInt(getRandomInt(-20, 20)) + 'px ' + parseInt(document.body.clientHeight - confetti.clientHeight + 20) + 'px');
            confetti.style.setProperty('rotate', getRandomInt(-360, 360) + 'deg');
            confetti.className = 'drop';
          }
        },
        this.appVisualStateShowPageGameOver ? 300 : 10,
      );
    },

    SetUserBasedOnRank(_rank, _confetti = false) {
      note('SetUserBasedOnRank() called');
      this.userRank = _rank;
      let fullRank = this.allPlayerRanks.find((r) => r.rank === _rank);
      this.documentCssRoot.style.setProperty('--rankHue', fullRank.hue);
      if (_confetti) {
        this.CreateConfetti();
        this.GetDailyChallenge();
      }
      localStorage.setItem('userRank', this.userRank);
    },

    CalculateDailyChallengeTotalScore() {
      note('CalculateDailyChallengeTotalScore() called');
      let _totalGameScore = 0;
      this.gameDailyChallenge.allLevels.forEach((level, index) => {
        let _totalBoardScore = 0;
        let _totalPossibleLikePieces = 0;
        level.board.forEach((piece, pi) => {
          if (piece.isMatch) {
            _totalPossibleLikePieces++;
            if (piece.isFullMatch) {
              _totalBoardScore = _totalBoardScore + this.appSettingsScoreTwinIncrement;
            } else {
              _totalBoardScore = _totalBoardScore + this.appSettingsScoreSiblingIncrement;
            }
          }
        });
        if (_totalPossibleLikePieces === 0) {
          _totalBoardScore = this.appSettingsScoreTwinIncrement + this.appSettingsScoreSiblingIncrement;
        }
        _totalGameScore = _totalGameScore + _totalBoardScore;
      });
      return _totalGameScore;
    },

    NewBoard() {
      note('NewBoard() called');
      this.AdjustPieceSizeBasedOnViewport();
      this.gameCurrentBoardScore = 0;
      this.gameCurrentNumberOfMisses = 0;

      let _board = null;
      if (this.gameDailyChallengeHasBeenStarted) {
        this.gameDailyChallenge.allLevels.forEach((level, i) => {
          if (_board === null && !level.completed) {
            error(i);
            _board = level;
          }
        });
      }

      let noMoreLevels = this.GetCurrentGameMode().id !== 'infinite' && this.gameCurrentAllLevels.length === this.getCurrentPlayerRank.levels;
      if (!noMoreLevels) {
        this.gameCurrentBoardPieces = [];
      }

      if (_board === null && noMoreLevels) {
        this.EndGame();
        return;
      } else if (_board === null) {
        _board = constructLevel(createLevelSource(), true);
      }

      this.gameCurrentMePiece = _board.me;
      this.gameCurrentLevel = _board;
      this.gameCurrentAllLevels.push(this.gameCurrentLevel);

      if (this.userSettingsUseSoundFX) {
        this.appSettingsSoundFX.volume(0.05);
        window.setTimeout(function () {
          app.appSettingsSoundFX.play();
        }, 236);
      }

      _board.board.forEach((_piece, x) => {
        _piece.delay = (_board.board.length - x) * 40;
        this.gameCurrentBoardPieces.push(_piece);
        window.setTimeout(function () {
          _piece.hasDropped = true;
        }, _piece.delay);
      });
    },

    TogglePieceSelection(_piece) {
      note('TogglePieceSelection() called for: " this.gameCurrentBoardPieces[' + this.gameCurrentBoardPieces.indexOf(_piece) + ']"');
      this.appVisualStateShowElementHint = false;
      _piece.nudge = false;
      if (!this.gameLikenessNudgeHasBeenShown) {
        let _likeness = 0;
        _likeness = _piece.color === this.gameCurrentMePiece.color ? parseInt(_likeness + 1) : _likeness;
        _likeness = _piece.backgroundImage === this.gameCurrentMePiece.backgroundImage ? parseInt(_likeness + 1) : _likeness;
        _likeness = _piece.shape === this.gameCurrentMePiece.shape ? parseInt(_likeness + 1) : _likeness;
        if (_likeness < 2) {
          this.appVisualStateShowElementHint = true;
          this.gameCurrentHintText = 'Select pieces that share <b>at least 2</b> of my attributes: color, shape, or pattern.';
        }
        this.gameLikenessNudgeHasBeenShown = true;
      }
      if (navigator.vibrate != undefined) {
        navigator.vibrate(100);
      }
      if (!this.gameCurrentIsGameOver) {
        _piece.isSelected = !_piece.isSelected;
        this.gameCurrentHasAnyPieceEverBeenSelected = true;
      }
    },

    ShareApp() {
      let _shareObject = {
        title: 'Like Me?',
        text: "Check out this fun game I've been playing!",
        url: 'https://bigtentgames.com/likeme.html',
      };
      if (navigator.share) {
        navigator.share(_shareObject);
      } else {
        _shareObject = 'https://bigtentgames.com/likeme.html';
        this.appVisualStateShowNotification = true;
        this.appNotificationMessage = 'Copied game link to the clipboard.';
        navigator.clipboard.writeText(_shareObject);
      }
    },

    SetScoreForSharingAndShare(_score, _mode, _rankedUp = false) {
      note('SetScoreForSharingAndShare() called');
      if (!this.appVisualStateIsAddingBonusTime) {
        this.appVisualStateShowNotification = false;
        if (_score.modeId === '') {
          _score.modeId = _mode.id;
          _score.modeName = _mode.name;
          _score.numberOfPerfectClears = this.gameCurrentNumberOfPerfectMatches;
        }
        this.gameScoreToShare = _score;
        if (this.appVisualStateShowNotification) {
          window.setTimeout(function () {
            app.ShareScore(_rankedUp);
          }, 200);
        } else {
          app.ShareScore(_rankedUp);
        }
      }
    },

    ShareScore(_rankedUp = false) {
      note('ShareScored() called');
      let _shapes = ['▨ ', '▲ ', '◯ '].sort(() => Math.random() - 0.5).join('');
      let modeName = this.userSettingsUseHardCoreMode ? 'Hardcore Mode' : this.gameScoreToShare.modeName;
      let _shareText = `${_shapes}${this.gameScoreToShare.isDaily ? 'Daily - ' + this.GetMonthAndDay(this.gameScoreToShare.dailyDate) : modeName}
${_rankedUp ? 'I just unlocked ' + this.getCurrentPlayerRank.name + '!' : '"' + this.GetRankById(this.gameScoreToShare.rankId).name + '"'}
${this.NumberWithCommas(this.gameScoreToShare.value)} pts - ${this.gameScoreToShare.numberOfClears} lvl${this.gameScoreToShare.numberOfClears === 1 ? '' : 's'} ${this.gameScoreToShare.numberOfPerfectClears > 0 ? '(' + this.gameScoreToShare.numberOfPerfectClears + ' perfect)' : ''}`;

      announce(_shareText);

      if (navigator.share) {
        let _shareObject = {
          text: _shareText,
        };
        navigator.share(_shareObject);
      } else {
        this.appVisualStateShowNotification = true;
        this.appNotificationMessage = this.gameLastHighScore.isDaily ? 'Daily challenge results copied to the clipboard.' : 'Game results copied to the clipboard.';
        navigator.clipboard.writeText(_shareText);
      }
    },

    GiveFeedback() {
      window.location = 'mailto:bigtentgames@icloud.com?subject=Feedback - Like Me v' + this.currentVersion;
    },

    RestartGame() {
      note('RestartGame() called');

      this.gameCurrentStartingTime = this.appSettingsCurrentGameMode.starttime;
      this.gameCurrentTimer = this.GetModeById('infinite').isSelected ? 0 : this.gameCurrentStartingTime;
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
      note('SelectMode(mode) called for:  "' + _mode.name + '"');
      this.gameCurrentBoardPieces = [];
      this.appSettingsModes.forEach((mode) => {
        mode.isSelected = _mode === mode;
      });
      this.appSettingsCurrentGameMode = _mode;
    },

    GetCurrentGameMode() {
      note('GetCurrentGameMode() called');
      let _mode = null;
      this.appSettingsModes.forEach((mode) => {
        if (mode.isSelected) {
          _mode = mode;
        }
      });
      if (_mode === null) {
        this.SelectMode(this.GetModeById('normal'));
        _mode = this.appSettingsCurrentGameMode;
      }
      return _mode;
    },

    GetModeById(_id) {
      note('GetModeById(_id) called for: "' + _id + '"');
      let _mode = {};
      _mode.name = 'no name';
      this.appSettingsModes.forEach((mode) => {
        if (mode.id === _id) {
          _mode = mode;
        }
      });
      if (_mode != null) {
        return _mode;
      }
    },

    GetRankById(_id) {
      return this.allPlayerRanks.find((r) => r.rank === _id);
    },

    SelectTheme(_theme) {
      note('SelectTheme(theme) called for: "' + _theme.name + '"');
      this.appSettingsThemes.forEach((t) => {
        t.isSelected = _theme == t;
      });
      this.documentCssRoot.style.setProperty('--color1', _theme.color1);
      this.documentCssRoot.style.setProperty('--color2', _theme.color2);
      this.documentCssRoot.style.setProperty('--color3', _theme.color3);
      this.documentCssRoot.style.setProperty('--color3contrast', _theme.color3contrast);
      this.documentCssRoot.style.setProperty('--darkBlendMode', _theme.darkBlendMode);
      this.documentCssRoot.style.setProperty('--darkPatternOpacity', _theme.darkPatternOpacity);
      if (this.userSettingsUseDarkMode) {
        this.documentCssRoot.style.setProperty('--patternHSL', _theme.darkPatternHSL);
      } else {
        this.documentCssRoot.style.setProperty('--patternHSL', '0, 0%, 100%');
      }
      localStorage.setItem('userSettingsTheme', JSON.stringify(_theme.name));
      this.GetRandomWallpaper();
    },

    GetCurrentTheme() {
      note('GetCurrentTheme() called');
      return this.appSettingsThemes.filter((obj) => obj.isSelected)[0];
    },

    UpdateApp() {
      if (this.appVisualStateShowPageHome) {
        this.timeToMidnight = this.GetTimeUntilMidnight();
        if (this.GetTimeUntilMidnightInMS() < this.getDailyTimeThreshold && this.GetTimeUntilMidnightInMS() > this.getDailyTimeThreshold - 1000) {
          this.GetDailyChallenge();
        }
      }

      if (!this.gameCurrentIsPaused && !this.appVisualStateShowPageGameOver) {
        if (this.gameCurrentNumberOfClears === 0 && this.userHighScoresEasy.length === 0) {
          if (!this.appSettingsInfiniteMode.isSelected && !this.gameLikenessNudgeHasBeenShown && this.appSettingsCurrentGameMode.starttime - this.gameCurrentTimer === 7000) {
            this.appVisualStateShowElementHint = true;
            this.gameCurrentHintText = 'Select pieces that share <b>at least 2</b> of my attributes: color, shape, or pattern.';
            this.gameLikenessNudgeHasBeenShown = true;
          } else if (this.appSettingsInfiniteMode.isSelected && !this.gameLikenessNudgeHasBeenShown && this.gameCurrentTimer === 7000) {
            this.appVisualStateShowElementHint = true;
            this.gameCurrentHintText = 'Select pieces that share <b>at least 2</b> of my attributes: color, shape, or pattern.';
            this.gameLikenessNudgeHasBeenShown = true;
          }

          if (!this.appSettingsInfiniteMode.isSelected && !this.appVisualStateShowElementHint && !this.gameClickMeNudgeHasBeenShown && this.appSettingsCurrentGameMode.starttime - this.gameCurrentTimer >= 25000 && this.gameCurrentTimer % 1000 === 0) {
            this.appVisualStateShowElementHint = true;
            this.gameCurrentHintText = 'Remember to click the Me piece to check your work and move to the next level.';
            this.gameClickMeNudgeHasBeenShown = true;
          } else if (this.appSettingsInfiniteMode.isSelected && !this.appVisualStateShowElementHint && !this.gameClickMeNudgeHasBeenShown && this.gameCurrentTimer >= 25000 && this.gameCurrentTimer % 10000 === 0) {
            this.appVisualStateShowElementHint = true;
            this.gameCurrentHintText = 'Remember to click the Me piece to check your work and move to the next level.';
            this.gameClickMeNudgeHasBeenShown = true;
          }
        }
        if (this.gameCurrentTimer > 0 || (this.appSettingsInfiniteMode.isSelected && !this.gameCurrentIsGameOver)) {
          if (!this.appSettingsInfiniteMode.isSelected) {
            this.gameCurrentTimer = this.gameCurrentTimer - this.appSettingsModeIntervalIncrement;
          } else {
            this.gameCurrentTimer = parseInt(this.gameCurrentTimer) + parseInt(this.appSettingsModeIntervalIncrement);
          }
        } else {
          if (!this.gameCurrentIsGameOver) {
            this.EndGame();
          }
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
      return hrsstring + minstring + secstring;
    },

    GetMsToHMS(ms) {
      var s = (ms - (ms % 1000)) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;

      var secstring = secs + 's';
      var minstring = mins != 0 ? mins + 'm ' : '';
      var hrsstring = hrs != 0 ? hrs + 'h ' : '';

      return hrsstring + minstring + secstring;
    },

    DateDiffInDays(_date1 = new Date(), _date2 = new Date('7/30/2023')) {
      _number = Math.round((_date1 - _date2) / (1000 * 60 * 60 * 24));
      return _number;
    },

    GetTimeUntilMidnightInMS() {
      var now = new Date();
      var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      var diffInMs = midnight - now;

      return diffInMs;
    },

    GetTimeUntilMidnight() {
      return this.GetMsToHMS(this.GetTimeUntilMidnightInMS());
    },

    AwardCurrency() {
      note('AwardCurrency() called');
      if (this.appSettingsEnableEconomy) {
        this.gameCurrentUpdatedCurrencyDeltas = [];
        if (this.appSettingsEnableEconomy && this.getNormalModeComputed.isSelected) {
          let gemsToAdd = 0;
          if (this.gameCurrentNumberOfClears === this.getCurrentPlayerRank.levels) {
            gemsToAdd = gemsToAdd + 1000;
          }
          for (let index = 0; index < this.gameCurrentNumberOfClears; index++) {
            gemsToAdd = gemsToAdd + 10;
          }
          this.gameCurrentUpdatedCurrencyDeltas.push({ currency: this.userCurrency[0], delta: gemsToAdd });
          this.userCurrency[0].count = this.userCurrency[0].count + gemsToAdd;
          if (this.userCurrency[0].count > this.userCurrency[0].maxCount) {
            this.userCurrency[0].count > this.userCurrency[0].maxCount;
          }
        }
      }
    },

    EndGame() {
      note('EndGame() called');
      let _score = new ScoreObject({
        value: this.gameCurrentTotalScore,
        isDaily: this.gameCurrentIsGameDailyChallenge,
        modeId: this.GetCurrentGameMode().id,
        rankId: this.getCurrentPlayerRank.rank,
        modeName: this.GetCurrentGameMode().name,
        numberOfClears: this.gameCurrentNumberOfClears,
      });
      this.appVisualStateShowPageGameOver = true;

      this.AwardCurrency();

      if (this.getNormalModeComputed.isSelected) {
        _score.totalPossibleClears = this.getCurrentPlayerRank.levels;
        _score.numberOfPerfectClears = this.gameCurrentNumberOfPerfectMatches;
        if (_score.numberOfPerfectClears === _score.totalPossibleClears) {
          this.userNumberOfPerfectBasicGames++;
          this.tempPerfectBasicGames = this.userNumberOfPerfectBasicGames;
          let targetCount = 3;
          this.CreateConfetti();
          if (this.userSettingsUseSoundFX) {
            this.appSettingsWinFX.volume(0.05);
            this.appSettingsWinFX.play();
          }
          if (this.userNumberOfPerfectBasicGames === targetCount) {
            if (this.getCurrentPlayerRank !== this.getLastRank) {
              this.userRank = this.userRank + 1;
              this.SetUserBasedOnRank(this.userRank, true);
              this.userNumberOfPerfectBasicGames = 0;
            }
            if (this.userSettingsUseSoundFX) {
              this.appSettingsLevelUpFX.volume(0.075);
              this.appSettingsLevelUpFX.play();
            }

            this.gameCurrentJustRankedUp = true;
          }
        } else if (this.userSettingsUseHardCoreMode && this.userNumberOfPerfectBasicGames < 3) {
          this.userNumberOfPerfectBasicGames = 0;
          _score.numberOfPerfectClears = 0;
          this.tempPerfectBasicGames = 0;
        }
        if (_score.numberOfPerfectClears !== _score.totalPossibleClears && this.userSettingsUseSoundFX) {
          this.appSettingsSadFX.volume(0.1);
          this.appSettingsSadFX.play();
        }

        localStorage.setItem('userRank', this.userRank);
        localStorage.setItem('userNumberOfPerfectBasicGames', this.userNumberOfPerfectBasicGames);
      }

      if (this.gameCurrentIsGameDailyChallenge) {
        _score.dailyDate = this.gameDailyChallenge.date;
      }

      if (this.GetModeById('normal').isSelected) {
        this.userHighScoresEasy.push(_score);
        if (_score === this.userScoresHighEasyByValue[0] && _score.value !== 0) {
          this.appVisualStateShowNewHighScoreElement = true;
        }
        localStorage.setItem('userHighScoresEasy', JSON.stringify(this.userHighScoresEasy));
      } else if (this.GetModeById('infinite').isSelected) {
        this.userHighScoresInfinite.push(_score);
        localStorage.setItem('userHighScoresInfinite', JSON.stringify(this.userHighScoresInfinite));
      }

      _score.isCurrent = true;
      this.gameLastHighScore = _score;
      this.gameScoreToShare = this.gameLastHighScore;
      this.AddBonusToScore();

      this.gameCurrentLevel.completed = true;
      this.gameCurrentIsGameDailyChallenge = false;
      this.GetDailyChallenge();
      this.CheckForServiceWorkerUpdate();
      this.gameCurrentIsGameOver = true;
      this.gameDailyChallengeHasBeenStarted = false;
      this.appVisualStateShowPageChallenge = false;

      this.HandleOnPageHideEvent(false);
    },

    SetState() {
      this.gameCurrentTimer = 3000;
    },

    // adds the animation of remaining time at the end of a game
    // being reduced to 0 while the score is increased by 1 for each second -
    HandleAddBonusToScoreInterval() {
      let _interval = 1000 / (this.gameCurrentTimer / 1000);
      _interval = _interval > 100 ? 100 : _interval;
      this.appVisualStateIsAddingBonusTime = true;
      this.appSettingsAddBonusToScoreInterval = window.setInterval(function () {
        if (app.gameCurrentTimer > 0) {
          app.gameCurrentTotalScore++;
          app.gameLastHighScore.value = app.gameCurrentTotalScore;
          app.gameCurrentTimer = app.gameCurrentTimer - 1000;
        } else {
          if (app.gameLastHighScore === app.userScoresHighEasyByValue[0]) {
            app.appVisualStateShowNewHighScoreElement = true;
          }
          localStorage.setItem('userHighScoresEasy', JSON.stringify(app.userHighScoresEasy));
          window.clearInterval(app.appSettingsAddBonusToScoreInterval);
          app.appVisualStateIsAddingBonusTime = false;
        }
      }, _interval);
    },

    AddBonusToScore() {
      note('AddBonusToScore() called');
      if (this.gameCurrentTimer > 0 && this.gameLastHighScore.isDaily && this.gameCurrentNumberOfClears === this.gameDailyChallenge.allLevels.length) {
        this.appVisualStateIsAddingBonusTime = true;
        window.setTimeout(this.HandleAddBonusToScoreInterval, 1000);
      }
    },

    CheckIfUserHasScoredDailyChallenge(fromCallback = false) {
      note('CheckIfUserHasScoredDailyChallenge() called');
      this.gameDailyChallengeAlreadyScored = false;
      _today = this.FormatDate(new Date());
      this.userHighScoresEasy.forEach((_score) => {
        if (_score.isDaily && _score.dailyDate !== undefined && this.FormatDate(_score.dailyDate) === _today) {
          this.gameDailyChallengeAlreadyScored = true;
          return;
        }
      });
      return this.gameDailyChallengeAlreadyScored;
    },

    ToggleZenMode() {
      note('ToggleZenMode() called');
      if (this.getCurrentGameModeComputed === this.getInfiniteModeComputed) {
        this.SelectMode(this.getNormalModeComputed);
      } else {
        this.SelectMode(this.getInfiniteModeComputed);
      }
    },

    SetUseHardCoreModeToTrue(event) {
      note('SetUseHardCoreModeToTrue(event) called');
      if (!this.userSettingsUseHardCoreMode) {
        let _confirm = window.confirm('Are you sure you want to enable Hardcore Mode? This will reset your ranks and cannot be undone.');
        if (_confirm) {
          event.stopPropagation();
          event.preventDefault();
          this.userSettingsUseHardCoreMode = true;
          this.SetUserBasedOnRank(0);
          this.userNumberOfPerfectBasicGames = 0;
          this.CreateConfetti();
        }
        localStorage.setItem('userSettingsUseHardCoreMode', this.userSettingsUseHardCoreMode);
      }
    },

    SetUseHardCoreModeToFalse() {
      note('SetUseHardCoreModeToFalse(event) called');
      this.userSettingsUseHardCoreMode = false;
      this.userNumberOfPerfectBasicGames = 0;
      this.SetUserBasedOnRank(0);

      localStorage.setItem('userSettingsUseHardCoreMode', this.userSettingsUseHardCoreMode);
    },

    ToggleUsingHints(event) {
      note('ToggleUsingHints(event) called');
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

    ToggleUsingCats(event) {
      note('ToggleUsingCats(event) called');
      if (event != undefined) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.userSettingsUseCats = !this.userSettingsUseCats;
      localStorage.setItem('userSettingsUseCats', this.userSettingsUseCats);
      this.GetRandomWallpaper();
    },

    ToggleUsingAltPattern(event) {
      note('ToggleUsingAltPattern(event) called');
      if (event != undefined) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.userSettingsUseAltPatterns = !this.userSettingsUseAltPatterns;
      localStorage.setItem('userSettingsUseAltPatterns', this.userSettingsUseAltPatterns);
    },

    ToggleUsingSound(event) {
      note('ToggleUsingSound(event) called');
      event.stopPropagation();
      event.preventDefault();
      this.userSettingsUseSoundFX = !this.userSettingsUseSoundFX;

      localStorage.setItem('userSettingsUseSoundFX', this.userSettingsUseSoundFX);
    },

    TogglePlayingMusic(event) {
      note('TogglePlayingMusic(event) called');
      event.stopPropagation();
      event.preventDefault();
      this.userSettingsPlayMusic = !this.userSettingsPlayMusic;
      if (!this.appSettingsThemeSong.playing() && this.appSettingsThemeSong.state() === 'loaded') {
        this.appSettingsThemeSong.play();
      }

      if (this.userSettingsPlayMusic) {
        this.appSettingsThemeSong.fade(0, this.userSettingsMusicVolume, 1000);
      } else {
        this.appSettingsThemeSong.fade(this.userSettingsMusicVolume, 0, 1000);
      }

      localStorage.setItem('userSettingsPlayMusic', this.userSettingsPlayMusic);
    },

    ToggleUsingDarkMode(event) {
      note('ToggleUsingDarkMode(event) called');
      if (event != undefined) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.userSettingsUseDarkMode = !this.userSettingsUseDarkMode;
      this.SelectTheme(this.GetCurrentTheme());
      document.getElementById('themeColor').content = this.userSettingsUseDarkMode ? '#000000' : '#f0f0f0';
      localStorage.setItem('userSettingsUseDarkMode', this.userSettingsUseDarkMode);
    },

    ToggleGamePause(event, _value) {
      note('ToggleGamePause(event, ' + _value + ') called');
      if (event != undefined) {
        event.stopPropagation();
        event.preventDefault();
      }

      this.gameCurrentIsPaused = _value;
      localStorage.setItem('gameCurrentIsPaused', this.gameCurrentIsPaused);
    },

    ResetModalContentScrollPositions() {
      note('ResetModalContentScrollPositions() called');
      let _contentElements = document.getElementsByTagName('content');
      for (let i = 0; i < _contentElements.length; i++) {
        const element = _contentElements[i];
        element.scroll({ top: 0 });
      }
    },

    ToggleChallenge(event, _value) {
      note('ToggleChallenge(event, value) called');
      if (event != null) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageChallenge = _value;
    },

    ToggleShowStoreOn(event) {
      note('ToggleShowHomeOn(event) called');
      if (this.appSettingsEnableEconomy) {
        event.stopPropagation();
        event.preventDefault();
        this.appVisualStateShowPageManageCurrency = !this.appVisualStateShowPageManageCurrency;
      }
    },

    ToggleShowHomeOn(event) {
      note('ToggleShowHomeOn(event) called');
      event.stopPropagation();
      event.preventDefault();
      this.RemoveConfetti();
      this.appVisualStateShowPageGameOver = false;
      this.appVisualStateShowPageHome = true;
      if (this.usersModeBeforeDailyChallenge !== null) {
        this.SelectMode(this.usersModeBeforeDailyChallenge);
        this.usersModeBeforeDailyChallenge = null;
      }
      if (this.gameCurrentJustRankedUp && this.getCurrentPlayerRank === this.getLastRank && this.userNumberOfPerfectBasicGames >= 3) {
        this.ToggleAchievements(event, true);
      }
      this.gameCurrentJustRankedUp = false;
    },

    ToggleHowToPlay(event, _value) {
      note('ToggleHowToPlay(event, value) called');
      if (event !== undefined) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.ResetModalContentScrollPositions();
      this.appTutorialIsInPlay = true;
    },

    ToggleOOBE(event, _value) {
      note('ToggleOOBE(event, value) called');
      if (event != null) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageOOBE = _value;
    },

    ToggleHighScores(event, _value) {
      note('ToggleHighScores(event, value) called');
      event.stopPropagation();
      event.preventDefault();
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageGameOver = false;
      this.appVisualStateShowPageHome = true;
      this.appVisualStateShowPageHighScores = _value;
    },

    ToggleAchievements(event, _value) {
      note('ToggleAchievements(event, value) called');
      if (event !== undefined && event !== null) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageGameOver = false;
      this.appVisualStateShowPageHome = true;
      this.appVisualStateShowPageAchievements = _value;
    },

    ToggleSettings(event, _value) {
      note('ToggleSettings(event, ' + _value + ') called');
      event.stopPropagation();
      event.preventDefault();
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageSettings = _value;
      this.ToggleGamePause(event, _value);
    },

    ToggleCredits(event, _value) {
      note('ToggleCredits(event, value) called');
      event.stopPropagation();
      event.preventDefault();
      this.ResetModalContentScrollPositions();
      this.appVisualStateShowPageCredits = _value;
    },

    GetUserSettings() {
      note('GetUserSettings() called');

      let _modes = localStorage.getItem('appSettingsModes');
      if (_modes !== undefined && _modes !== null) {
        _modes = JSON.parse(_modes);

        if (_modes.easy != undefined && _modes.easy != null) {
          this.GetModeById('normal').isSelected = _modes.infinite.isSelected;
          this.GetModeById('normal').isSelected = _modes.easy.isSelected;
        } else {
          _modes.forEach((_mode) => {
            this.appSettingsModes.forEach((mode) => {
              if (mode.id === _mode.id) {
                mode.isSelected = _mode.isSelected;
              }
            });
          });
        }
      }

      let _appTutorialUserHasSeen = localStorage.getItem('appTutorialUserHasSeen');
      highlight('setting OOBE tutorial based on local storage');
      if (_appTutorialUserHasSeen) {
        warn(_appTutorialUserHasSeen);
      }
      if (_appTutorialUserHasSeen !== undefined && _appTutorialUserHasSeen !== null) {
        _appTutorialUserHasSeen = JSON.parse(_appTutorialUserHasSeen);
        if (!_appTutorialUserHasSeen) {
          this.ToggleHowToPlay();
        } else {
          this.appTutorialUserHasSeen = true;
        }
      } else {
        this.ToggleHowToPlay();
      }

      let _userRank = localStorage.getItem('userRank');
      note('setting userRank from local storage');
      if (_userRank !== undefined && _userRank !== null && _userRank !== 'undefined') {
        this.SetUserBasedOnRank(parseInt(_userRank));
      } else {
        this.SetUserBasedOnRank(parseInt(0));
      }

      let _userSettingsUseHardCoreMode = localStorage.getItem('userSettingsUseHardCoreMode');
      if (_userSettingsUseHardCoreMode !== undefined && _userSettingsUseHardCoreMode !== null) {
        this.userSettingsUseHardCoreMode = JSON.parse(_userSettingsUseHardCoreMode);
      }

      let _userNumberOfPerfectBasicGames = localStorage.getItem('userNumberOfPerfectBasicGames');
      if (_userNumberOfPerfectBasicGames !== undefined && _userNumberOfPerfectBasicGames !== null) {
        _userNumberOfPerfectBasicGames = JSON.parse(_userNumberOfPerfectBasicGames);
        this.userNumberOfPerfectBasicGames = _userNumberOfPerfectBasicGames;
      }

      let _hints = localStorage.getItem('userSettingsUseHints');
      if (_hints !== undefined && _hints !== null) {
        _hints = JSON.parse(_hints);
        this.userSettingsUseHints = _hints;
      }

      let _userSettingsUseCats = localStorage.getItem('userSettingsUseCats');
      if (_userSettingsUseCats !== undefined && _userSettingsUseCats !== null) {
        _userSettingsUseCats = JSON.parse(_userSettingsUseCats);
        this.userSettingsUseCats = _userSettingsUseCats;
      }

      let _userSettingsUseAltPatterns = localStorage.getItem('userSettingsUseAltPatterns');
      if (_userSettingsUseAltPatterns !== undefined && _userSettingsUseAltPatterns !== null) {
        _userSettingsUseAltPatterns = JSON.parse(_userSettingsUseAltPatterns);
        this.userSettingsUseAltPatterns = _userSettingsUseAltPatterns;
      }

      let _sounds = localStorage.getItem('userSettingsUseSoundFX');
      if (_sounds !== undefined && _sounds !== null) {
        _sounds = JSON.parse(_sounds);
        this.userSettingsUseSoundFX = _sounds;
      }

      let _music = localStorage.getItem('userSettingsPlayMusic');
      if (_music !== undefined && _music !== null) {
        _music = JSON.parse(_music);
        this.userSettingsPlayMusic = _music;
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
      } catch (_error) {
        error('_userSettingsTheme error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _userHighScoresEasy = localStorage.getItem('userHighScoresEasy');
      try {
        if (_userHighScoresEasy !== undefined && _userHighScoresEasy !== null && _userHighScoresEasy !== '[]') {
          _userHighScoresEasy = JSON.parse(_userHighScoresEasy);
          _userHighScoresEasy.forEach((s) => {
            this.userHighScoresEasy.push(
              new ScoreObject({
                modeId: s.modeId == undefined ? '' : s.modeId,
                modeName: s.modeName == undefined ? '' : s.modeName,
                streak: s.streak == undefined ? 0 : s.streak,
                numberOfClears: s.numberOfClears == undefined ? 0 : s.numberOfClears,
                numberOfPerfectClears: s.numberOfPerfectClears == undefined ? 0 : s.numberOfPerfectClears,
                date: new Date(s.date),
                isDaily: s.isDaily,
                rankId: s.rankId,
                value: s.value,
                dailyDate: s.dailyDate != undefined ? new Date(s.dailyDate) : new Date(s.date),
              }),
            );
          });
        }
      } catch (_error) {
        error('_userHighScoresEasy error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentHasAnyPieceEverBeenSelected = localStorage.getItem('gameCurrentHasAnyPieceEverBeenSelected');
      try {
        if (_gameCurrentHasAnyPieceEverBeenSelected !== undefined && _gameCurrentHasAnyPieceEverBeenSelected !== null) {
          this.gameCurrentHasAnyPieceEverBeenSelected = JSON.parse(_gameCurrentHasAnyPieceEverBeenSelected);
        }
      } catch (_error) {
        error('_gameCurrentHasAnyPieceEverBeenSelected error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameLikenessNudgeHasBeenShown = localStorage.getItem('gameLikenessNudgeHasBeenShown');
      try {
        if (_gameLikenessNudgeHasBeenShown !== undefined && _gameLikenessNudgeHasBeenShown !== null) {
          this.gameLikenessNudgeHasBeenShown = JSON.parse(_gameLikenessNudgeHasBeenShown) === true;
        }
      } catch (_error) {
        error('_gameLikenessNudgeHasBeenShown error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameClickMeNudgeHasBeenShown = localStorage.getItem('gameClickMeNudgeHasBeenShown');
      try {
        if (_gameClickMeNudgeHasBeenShown !== undefined && _gameClickMeNudgeHasBeenShown !== null) {
          this.gameClickMeNudgeHasBeenShown = JSON.parse(_gameClickMeNudgeHasBeenShown) === true;
        }
      } catch (_error) {
        error('_gameClickMeNudgeHasBeenShown error: ' + _error);
        _gameDataCorrupt = true;
      }
    },

    ClearAllUserScores() {
      note('ClearAllUserScores() called');
      let _confirm = window.confirm('Are you sure you want to clear all of your scores?');
      if (_confirm) {
        this.appVisualStateShowNotification = false;
        this.gameLastHighScore = new ScoreObject({});
        this.gameScoreToShare = new ScoreObject({});
        this.userHighScoresEasy = [];
        this.userHighScoresInfinite = [];
        this.gameDailyChallenge.allLevels = [];
        this.gameCurrentIsGameDailyChallenge = false;
        this.userNumberOfPerfectBasicGames = 0;
        localStorage.setItem('userNumberOfPerfectBasicGames', this.userNumberOfPerfectBasicGames);
        localStorage.setItem('userHighScoresEasy', JSON.stringify(this.userHighScoresEasy));
        localStorage.setItem('userHighScoresInfinite', JSON.stringify(this.userHighScoresInfinite));

        this.GetDailyChallenge();
      }
    },

    RestoreCurrentGame() {
      note('RestoreCurrentGame() called');
      let _gameDataCorrupt = false;

      let _appSettingsModeIntervalIncrement = localStorage.getItem('appSettingsModeIntervalIncrement');
      try {
        if (_appSettingsModeIntervalIncrement !== undefined && _appSettingsModeIntervalIncrement !== null) {
          this.appSettingsModeIntervalIncrement = _appSettingsModeIntervalIncrement;
        }
      } catch (_error) {
        error('_appSettingsModeIntervalIncrement error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _appSettingsPieceSize = localStorage.getItem('appSettingsPieceSize');
      try {
        if (_appSettingsPieceSize !== undefined && _appSettingsPieceSize !== null) {
          this.appSettingsPieceSize = _appSettingsPieceSize;
        }
      } catch (_error) {
        error('_appSettingsPieceSize error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _appSettingsTotalNumberOfBoardPieces = localStorage.getItem('appSettingsTotalNumberOfBoardPieces');
      try {
        if (_appSettingsTotalNumberOfBoardPieces !== undefined && _appSettingsTotalNumberOfBoardPieces !== null) {
          this.appSettingsTotalNumberOfBoardPieces = _appSettingsTotalNumberOfBoardPieces;
        }
      } catch (_error) {
        error('_appSettingsTotalNumberOfBoardPieces error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _appSettingsBoardGridSize = localStorage.getItem('appSettingsBoardGridSize');
      try {
        if (_appSettingsBoardGridSize !== undefined && _appSettingsBoardGridSize !== null) {
          this.appSettingsBoardGridSize = _appSettingsBoardGridSize;
        }
      } catch (_error) {
        error('_appSettingsBoardGridSize error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _appVisualStateShowPageHome = localStorage.getItem('appVisualStateShowPageHome');
      try {
        if (_appVisualStateShowPageHome !== undefined && _appVisualStateShowPageHome !== null) {
          this.appVisualStateShowPageHome = JSON.parse(_appVisualStateShowPageHome);
        }
      } catch (_error) {
        error('_appVisualStateShowPageHome error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _appVisualStateShowPageHowToPlay = localStorage.getItem('appVisualStateShowPageHowToPlay');
      try {
        if (_appVisualStateShowPageHowToPlay !== undefined && _appVisualStateShowPageHowToPlay !== null) {
          this.appVisualStateShowPageHowToPlay = JSON.parse(_appVisualStateShowPageHowToPlay);
        }
      } catch (_error) {
        error('_appVisualStateShowPageHowToPlay error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _appVisualStateShowPageSettings = localStorage.getItem('appVisualStateShowPageSettings');
      try {
        if (_appVisualStateShowPageSettings !== undefined && _appVisualStateShowPageSettings !== null) {
          this.appVisualStateShowPageSettings = JSON.parse(_appVisualStateShowPageSettings);
        }
      } catch (_error) {
        error('_appVisualStateShowPageSettings error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _appVisualStateShowElementHint = localStorage.getItem('appVisualStateShowElementHint');
      try {
        if (_appVisualStateShowElementHint !== undefined && _appVisualStateShowElementHint !== null) {
          this.appVisualStateShowElementHint = JSON.parse(_appVisualStateShowElementHint);
        }
      } catch (_error) {
        error('_appVisualStateShowElementHint error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _appVisualStateShowElementFlyaway = localStorage.getItem('appVisualStateShowElementFlyaway');
      try {
        if (_appVisualStateShowElementFlyaway !== undefined && _appVisualStateShowElementFlyaway !== null) {
          this.appVisualStateShowElementFlyaway = JSON.parse(_appVisualStateShowElementFlyaway);
        }
      } catch (_error) {
        error('_appVisualStateShowElementFlyaway error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentIsPaused = localStorage.getItem('gameCurrentIsPaused');
      try {
        if (_gameCurrentIsPaused !== undefined && _gameCurrentIsPaused !== null) {
          _gameCurrentIsPaused = JSON.parse(_gameCurrentIsPaused);
          this.gameCurrentIsPaused = _gameCurrentIsPaused;
        }
      } catch (_error) {
        error('_gameCurrentIsPaused error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameDailyChallenge = localStorage.getItem('gameDailyChallenge');
      try {
        if (_gameDailyChallenge !== undefined && _gameDailyChallenge !== null) {
          _gameDailyChallenge = JSON.parse(_gameDailyChallenge);
          _letAllLevels = new AllLevelsObject({ date: new Date(_gameDailyChallenge.date) });
          _gameDailyChallenge.allLevels.forEach((level) => {
            let _level = new SingleLevelObject({ me: level.me, completed: level.completed });
            level.board.forEach((piece) => {
              _level.board.push(new PieceObject(piece));
            });
            _letAllLevels.allLevels.push(_level);
          });
          this.gameDailyChallenge = _letAllLevels;
        }
      } catch (_error) {
        error('_gameDailyChallenge error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentIsGameDailyChallenge = localStorage.getItem('gameCurrentIsGameDailyChallenge');
      try {
        if (_gameCurrentIsGameDailyChallenge !== undefined && _gameCurrentIsGameDailyChallenge !== null) {
          _gameCurrentIsGameDailyChallenge = JSON.parse(_gameCurrentIsGameDailyChallenge);
          this.gameCurrentIsGameDailyChallenge = _gameCurrentIsGameDailyChallenge;
        }
      } catch (_error) {
        error('_gameCurrentIsGameDailyChallenge error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameDailyChallengeHasBeenStarted = localStorage.getItem('gameDailyChallengeHasBeenStarted');
      try {
        if (_gameDailyChallengeHasBeenStarted !== undefined && _gameDailyChallengeHasBeenStarted !== null) {
          _gameDailyChallengeHasBeenStarted = JSON.parse(_gameDailyChallengeHasBeenStarted);
          this.gameDailyChallengeHasBeenStarted = _gameDailyChallengeHasBeenStarted;
        }
      } catch (_error) {
        error('_gameDailyChallengeHasBeenStarted error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentAllLevels = localStorage.getItem('gameCurrentAllLevels');
      try {
        if (_gameCurrentAllLevels !== undefined && _gameCurrentAllLevels !== null) {
          _gameCurrentAllLevels = JSON.parse(_gameCurrentAllLevels);
          this.gameCurrentAllLevels = _gameCurrentAllLevels;
        }
      } catch (_error) {
        error('_gameCurrentAllLevels error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentLevel = localStorage.getItem('gameCurrentLevel');
      try {
        if (_gameCurrentLevel !== undefined && _gameCurrentLevel !== null) {
          _gameCurrentLevel = JSON.parse(_gameCurrentLevel);
          let _level = new SingleLevelObject({ me: _gameCurrentLevel.me, completed: _gameCurrentLevel.completed });
          if (this.gameCurrentIsGameDailyChallenge) {
            for (let i = 0; i < this.gameDailyChallenge.allLevels.length; i++) {
              const dclevel = this.gameDailyChallenge.allLevels[i];
              if (!dclevel.completed) {
                _level = dclevel;
                break;
              }
            }
          } else {
            _gameCurrentLevel.board.forEach((piece) => {
              _level.board.push(new PieceObject(piece));
            });
          }
          this.gameCurrentLevel = _level;
        }
      } catch (_error) {
        error('_gameCurrentLevel error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentMePiece = localStorage.getItem('gameCurrentMePiece');
      try {
        if (_gameCurrentMePiece !== undefined && _gameCurrentMePiece !== null) {
          _gameCurrentMePiece = JSON.parse(_gameCurrentMePiece);
          this.gameCurrentMePiece = new PieceObject(_gameCurrentMePiece);
        }
      } catch (_error) {
        error('_gameCurrentMePiece error: ' + _error);
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
      } catch (_error) {
        error('_gameCurrentBoardPieces error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentStartingTime = localStorage.getItem('gameCurrentStartingTime');
      try {
        if (_gameCurrentStartingTime !== undefined && _gameCurrentStartingTime !== null) {
          this.gameCurrentStartingTime = _gameCurrentStartingTime;
        }
      } catch (_error) {
        error('_gameCurrentStartingTime error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentTimer = localStorage.getItem('gameCurrentTimer');
      try {
        if (_gameCurrentTimer !== undefined && _gameCurrentTimer !== null) {
          this.gameCurrentTimer = _gameCurrentTimer;
        }
      } catch (_error) {
        error('_gameCurrentTimer error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentNumberOfClears = localStorage.getItem('gameCurrentNumberOfClears');
      try {
        if (_gameCurrentNumberOfClears !== undefined && _gameCurrentNumberOfClears !== null) {
          this.gameCurrentNumberOfClears = _gameCurrentNumberOfClears;
        }
      } catch (_error) {
        error('_gameCurrentNumberOfClears error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentNumberOfPerfectMatches = localStorage.getItem('gameCurrentNumberOfPerfectMatches');
      try {
        if (_gameCurrentNumberOfPerfectMatches !== undefined && _gameCurrentNumberOfPerfectMatches !== null) {
          this.gameCurrentNumberOfPerfectMatches = _gameCurrentNumberOfPerfectMatches;
        }
      } catch (_error) {
        error('_gameCurrentNumberOfPerfectMatches error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentIsUserGuessWrong = localStorage.getItem('gameCurrentIsUserGuessWrong');
      try {
        if (_gameCurrentIsUserGuessWrong !== undefined && _gameCurrentIsUserGuessWrong !== null) {
          this.gameCurrentIsUserGuessWrong = JSON.parse(_gameCurrentIsUserGuessWrong);
        }
      } catch (_error) {
        error('_gameCurrentIsUserGuessWrong error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentNumberOfFails = localStorage.getItem('gameCurrentNumberOfFails');
      try {
        if (_gameCurrentNumberOfFails !== undefined && _gameCurrentNumberOfFails !== null) {
          this.gameCurrentNumberOfFails = _gameCurrentNumberOfFails;
        }
      } catch (_error) {
        error('_gameCurrentNumberOfFails error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentNumberOfMisses = localStorage.getItem('gameCurrentNumberOfMisses');
      try {
        if (_gameCurrentNumberOfMisses !== undefined && _gameCurrentNumberOfMisses !== null) {
          this.gameCurrentNumberOfMisses = _gameCurrentNumberOfMisses;
        }
      } catch (_error) {
        error('_gameCurrentNumberOfMisses error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentHintText = localStorage.getItem('gameCurrentHintText');
      try {
        if (_gameCurrentHintText !== undefined && _gameCurrentHintText !== null) {
          this.gameCurrentHintText = _gameCurrentHintText;
        }
      } catch (_error) {
        error('_gameCurrentHintText error: ' + _error);
        _gameDataCorrupt = true;
      }

      let _gameCurrentTotalScore = localStorage.getItem('gameCurrentTotalScore');
      try {
        if (_gameCurrentTotalScore !== undefined && _gameCurrentTotalScore !== null) {
          this.gameCurrentTotalScore = parseInt(_gameCurrentTotalScore);
        }
      } catch (_error) {
        error('_gameCurrentTotalScore error: ' + _error);
        _gameDataCorrupt = true;
      }

      this.CheckIfUserHasScoredDailyChallenge();

      if (_gameDataCorrupt) {
        this.gameCurrentIsGameOver = true;
        this.NewGame();
      }
    },

    GetRandomWallpaper() {
      note('GetRandomWallpaper() called');

      this.currentWallpaper = this.wallpaperNames[getRandomInt(0, this.wallpaperNames.length)];
      document.getElementsByTagName('wallpaper')[0].className = this.currentWallpaper;
    },

    InitializeGame() {
      announce('Game Initialized');
      this.AdjustPieceSizeBasedOnViewport();
      this.CheckIfGameIsInNativeAppWebView();
      this.CheckForMobile();
      this.GetRandomWallpaper();

      let _onemoretime = localStorage.getItem('onemoretime');
      try {
        if (_onemoretime !== undefined && _onemoretime !== null) {
          _onemoretime = JSON.parse(_onemoretime);
          if (_onemoretime) {
            localStorage.setItem('onemoretime', false);
          }
        }
      } catch (_error) {
        error('_onemoretime error: ' + _error);
      }

      let _storedVersion = localStorage.getItem('storedVersion');
      try {
        if (_storedVersion !== undefined && _storedVersion !== null) {
          this.storedVersion = _storedVersion;
        }
      } catch (_error) {
        _storedVersion = null;
      }

      let _userCurrency = localStorage.getItem('userCurrency');
      try {
        if (_userCurrency !== undefined && _userCurrency !== null) {
          let currencies = JSON.parse(_userCurrency);

          this.userCurrency.forEach((currency) => {
            let match = currencies.find((jcurr) => jcurr.id === currency.id);
            currency.count = match.count;
          });
        }
      } catch (_error) {
        error('_userCurrency error: ' + _error);
      }

      let _userSettingsActionItems = localStorage.getItem('userSettingsActionItems');
      try {
        if (_userSettingsActionItems !== undefined && _userSettingsActionItems !== null) {
          let items = JSON.parse(_userSettingsActionItems);
          this.userSettingsActionItems.forEach((actionitem) => {
            let match = items.find((item) => item.id === actionitem.id);
            actionitem.count = match.count;
          });
        }
      } catch (_error) {
        error('_userSettingsActionItems error: ' + _error);
      }

      let _gameCurrentIsGameOver = localStorage.getItem('gameCurrentIsGameOver');
      try {
        if (_gameCurrentIsGameOver !== undefined && _gameCurrentIsGameOver !== null) {
          this.gameCurrentIsGameOver = JSON.parse(_gameCurrentIsGameOver);
        }
      } catch (_error) {
        this.gameCurrentIsGameOver = true;
      }

      this.GetUserSettings();

      if (!this.gameCurrentIsGameOver) {
        this.RestoreCurrentGame();
      }

      this.appSettingsInfiniteMode = this.appSettingsInfiniteMode === null ? this.GetModeById('infinite') : this.appSettingsInfiniteMode;
      this.appSettingsCurrentGameMode = this.appSettingsCurrentGameMode === null ? this.GetCurrentGameMode() : this.appSettingsCurrentGameMode;
      this.updateInterval = window.setInterval(this.UpdateApp, this.appSettingsModeIntervalIncrement);
    },

    HandleOnPageHideEvent(_clearInterval = true) {
      if (!this.appIsBeingReset) {
        if (_clearInterval) {
          window.clearInterval(this.updateInterval);
        }

        if (this.appSettingsSaveSettings) {
          localStorage.setItem('storedVersion', this.currentVersion);
          localStorage.setItem('appSettingsModes', JSON.stringify(this.appSettingsModes));
          localStorage.setItem('appSettingsModeIntervalIncrement', this.appSettingsModeIntervalIncrement);
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
          localStorage.setItem('gameLikenessNudgeHasBeenShown', JSON.stringify(this.gameLikenessNudgeHasBeenShown));
          localStorage.setItem('gameClickMeNudgeHasBeenShown', JSON.stringify(this.gameClickMeNudgeHasBeenShown));
          localStorage.setItem('userHighScoresEasy', JSON.stringify(this.userHighScoresEasy));
          localStorage.setItem('userSettingsUseCats', this.userSettingsUseCats);
          localStorage.setItem('userSettingsUseAltPatterns', this.userSettingsUseAltPatterns);
          localStorage.setItem('userSettingsUseHints', this.userSettingsUseHints);
          localStorage.setItem('userSettingsUseSoundFX', this.userSettingsUseSoundFX);
          localStorage.setItem('userSettingsPlayMusic', this.userSettingsPlayMusic);
          localStorage.setItem('userSettingsUseDarkMode', this.userSettingsUseDarkMode);
          localStorage.setItem('userRank', this.userRank);
          localStorage.setItem('userNumberOfPerfectBasicGames', this.userNumberOfPerfectBasicGames);
          if (this.appSettingsEnableEconomy) {
            localStorage.setItem('userCurrency', JSON.stringify(this.userCurrency));
            localStorage.setItem('userSettingsActionItems', JSON.stringify(this.userSettingsActionItems));
          }
        }
      }
    },

    ChangeTutorialPiecesToCats(_text) {
      let _outgoing = _text.replace('pieces', 'cats');
      return this.userSettingsUseCats ? _outgoing : _text;
    },

    HandleActionItemClick(_item) {
      note('HandleActionItemClick() called');

      if (this.appSettingsEnableEconomy) {
        if (_item.count > 0) {
          _item.count--;
          switch (_item.id) {
            case 1:
              this.IdentifyMismatches();
              break;

            case 2:
              this.ResetLevel();
              break;

            case 3:
              this.AddTimeBonus(10000);
              break;

            case 4:
              this.ClearLevel();
              break;

            case 5:
              this.AddTimeBonus(30000);
              break;

            default:
              break;
          }
          localStorage.setItem('userSettingsActionItems', JSON.stringify(this.userSettingsActionItems));
        }
      }
    },

    IdentifyMismatches() {
      note('IdentifyMismatches() called');
      let _mismatchFound = false;
      this.gameCurrentBoardPieces.forEach((piece) => {
        piece.nudge = false;
        if (!_mismatchFound && ((piece.isMatch && !piece.isSelected) || (!piece.isMatch && piece.isSelected))) {
          piece.nudge = true;
          _mismatchFound = true;
        }
      });
    },

    ResetLevel() {
      note('ResetLevel() called');
      this.gameCurrentBoardPieces.forEach((piece) => {
        piece.isSelected = false;
        piece.nudge = false;
      });
      this.gameCurrentNumberOfMisses = 0;
    },

    AddTimeBonus(_amount = 3000) {
      note('AddTimeBonus() called');
      this.appSettingsCurrentGameMode.bonustime = _amount;
      this.gameCurrentTimer = this.gameCurrentTimer + this.appSettingsCurrentGameMode.bonustime;
      if (this.appSettingsCurrentGameMode.bonustime > 0) {
        this.appVisualStateShowElementFlyaway = true;
        window.setTimeout(function () {
          app.appVisualStateShowElementFlyaway = false;
        }, 100);
      }
    },

    ClearLevel() {
      note('ClearLevel() called');
      this.ResetLevel();
      this.gameCurrentBoardPieces.forEach((piece) => {
        piece.isSelected = piece.isMatch;
      });
      this.CheckBoard();
    },

    AdjustItemCount(event, _currency, _item, _amount) {
      note('AdjustItemCount() called');
      event.stopPropagation();
      event.preventDefault();
      let count = _item.count + _amount;
      let adjustAmount = _currency.count + _item.cost * -1 * _amount;
      if (adjustAmount >= 0 && count >= 0 && count <= _item.maxCount) {
        _currency.count = adjustAmount;
        _item.count = count;
      }

      localStorage.setItem('userCurrency', JSON.stringify(this.userCurrency));
      localStorage.setItem('userSettingsActionItems', JSON.stringify(this.userSettingsActionItems));
    },

    HandleSkipTutorial() {
      note('HandleSkipTutorial() called');
      this.userTutorialCheckCount = 0;
      this.appTutorialIsInPlay = false;
      this.appTutorialCurrentStepIndex = 0;
      this.appTutorialUserHasSeen = true;
      localStorage.setItem('appTutorialUserHasSeen', true);
    },

    HandleDoneTutorial() {
      note('HandleDoneTutorial() called');
      if (!this.appTutorialUserHasSeen) {
        this.RestartGame();
      }
      this.HandleSkipTutorial();
    },

    HandleTutorialNext() {
      note('HandleTutorialNext() called');
      this.appTutorialCurrentStepIndex++;
    },

    HandleTutorialBack() {
      note('HandleTutorialBack() called');
      if (this.appTutorialCurrentStepIndex > 0) {
        this.appTutorialCurrentStepIndex--;
      }
    },

    HandleTutorialCheck() {
      note('HandleTutorialCheck() called');
      if (this.appTutorialCurrentStepIndex > 3) {
        this.userTutorialCheckCount++;
        let _perfectMatch = true;
        this.appTutorialBoardPieces.board.forEach((piece, i) => {
          if ((i < 4 && !piece.isSelected) || (i >= 4 && piece.isSelected)) {
            _perfectMatch = false;
          }
        });
        if (_perfectMatch) {
          this.appTutorialBoardPieces.board.forEach((piece, i) => {
            piece.isSelected = false;
          });
          this.HandleTutorialNext();
        } else {
          if (this.userTutorialCheckCount > 2) {
            this.appTutorialBoardPieces.board.forEach((piece, i) => {
              piece.isSelected = piece.isMatch;
            });
          }
          this.gameCurrentIsUserGuessWrong = true;
          window.setTimeout(function () {
            app.gameCurrentIsUserGuessWrong = false;
          }, 500);
        }
      }
      log('this.userTutorialCheckCount = ' + this.userTutorialCheckCount);
    },

    HandleOnPageShowEvent() {
      note('HandleOnPageShowEvent() called');
      this.appVisualStateShowGameOverContent = true;
      this.appSettingsInfiniteMode = this.appSettingsInfiniteMode === null ? this.GetModeById('infinite') : this.appSettingsInfiniteMode;
      this.appSettingsCurrentGameMode = this.appSettingsCurrentGameMode === null ? this.GetCurrentGameMode() : this.appSettingsCurrentGameMode;
      window.clearInterval(this.updateInterval);
      this.updateInterval = window.setInterval(this.UpdateApp, this.appSettingsModeIntervalIncrement);
      this.GetDailyChallenge();
      this.CheckForServiceWorkerUpdate();
    },

    HandleTouchApp() {
      note('HandleTouchApp() called');
      if (!this.appSettingsThemeSong.playing() && this.appSettingsThemeSong.state() === 'loaded' && !this.appTutorialIsInPlay && this.userSettingsPlayMusic) {
        this.appSettingsThemeSong.volume(0);
        this.appSettingsThemeSong.play();
        this.appSettingsThemeSong.fade(0, this.userSettingsMusicVolume, 1000);
      }
    },

    CheckForServiceWorkerUpdate() {
      note('CheckForServiceWorkerUpdate() called');
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
          for (let registration of registrations) {
            registration.update();
          }
        });
      }
    },

    CheckIfGameIsInNativeAppWebView() {
      note('CheckIfGameIsInNativeAppWebView() called');
      this.isInNativeAppWebView = document.cookie.match(/^(.*;)?\s*app-platform\s*=\s*[^;]+(.*)?$/) !== null;
      if (!this.isInNativeAppWebView) {
        this.isInNativeAppWebView = window.location.search.indexOf('googleplay') !== -1;
      }
      return this.isInNativeAppWebView;
    },

    CheckLocalStorageSize() {
      var _lsTotal = 0,
        _xLen,
        _x;
      for (_x in localStorage) {
        if (!localStorage.hasOwnProperty(_x)) {
          continue;
        }
        _xLen = (localStorage[_x].length + _x.length) * 2;
        _lsTotal += _xLen;
      }
      return 'Total = ' + (_lsTotal / 1024).toFixed(2) + ' KB';
    },

    HandleOnVisibilityChange(event) {
      note('HandleOnVisibilityChange() called');
      this.appVisualStateShowGameOverContent = true;
      this.HandleOnPageHideEvent();

      if (!document.hidden) {
        log('document visible');
        const { ctx } = Howler;
        if (ctx && !document.hidden) {
          setTimeout(() => {
            ctx.resume();
          }, 100);
        }
        if (this.userSettingsPlayMusic) {
          this.appSettingsThemeSong.fade(0, this.userSettingsMusicVolume, 1000);
        }
      } else {
        if (this.userSettingsPlayMusic) {
          this.appSettingsThemeSong.fade(this.userSettingsMusicVolume, 0, 1000);
        }
        if (this.splashBoard) {
          this.splashBoard = false;
          this.EndGame();
          this.HandleOnResizeEvent();
        }
      }

      this.CheckIfGameIsInNativeAppWebView();
      this.GetDailyChallenge();
      this.CheckForServiceWorkerUpdate();

      window.clearInterval(this.updateInterval);
      this.updateInterval = window.setInterval(this.UpdateApp, this.appSettingsModeIntervalIncrement);
    },

    AdjustPieceSizeBasedOnViewport() {
      if (!this.splashBoard) {
        this.appSettingsPieceSize = window.innerWidth < 450 ? (window.innerWidth - 60) / this.appSettingsBoardGridSize + 'px' : 400 / this.appSettingsBoardGridSize + 'px';
        this.documentCssRoot.style.setProperty('--pieceSize', this.appSettingsPieceSize);
        this.appSettingsTotalNumberOfBoardPieces = window.innerHeight < 234 ? 12 : 16;
      }
    },

    async GetDailyChallenge() {
      note('GetDailyChallenge() 2 called');
      let today = new Date();
      if (!this.gameCurrentIsGameDailyChallenge && (this.gameDailyChallenge.allLevels.length === 0 || this.GetMonthAndDay(this.gameDailyChallenge.date) !== this.GetMonthAndDay(today))) {
        this.gameDailyChallenge = new AllLevelsObject({});
        let seed = parseInt(today.toLocaleDateString('en-UK').replace(/\//g, ''));
        constructAllLevels(this.GenerateNumbers(seed), this.gameDailyChallenge);
      }
      app.CheckIfUserHasScoredDailyChallenge(true);
    },

    GenerateNumbers(seed) {
      // Set the seed for the random number generator
      // var random = require('seedrandom');
      var rng = new Math.seedrandom(seed);
      // Generate a series of 51-digit numbers
      var numbers = [];
      for (var i = 0; i < parseInt(this.getCurrentPlayerRank.levels); i++) {
        // Change this to generate more or fewer numbers
        var number = '';
        for (var j = 0; j < 51; j++) {
          var digit;
          if (j % 3 == 2) {
            digit = Math.floor(rng() * 4) + 1;
          } else {
            digit = Math.floor(rng() * 3) + 1;
          }
          number += digit.toString();
        }
        numbers += number;
      }
      return numbers;
    },

    FillBoardWithPieces(size = this.appSettingsPieceSize) {
      if (UseDebug) {
        let numbers = this.GenerateNumbers();
        this.HandleSkipTutorial();
        this.SelectMode(this.getInfiniteModeComputed);
        this.RestartGame();
        this.documentCssRoot.style.setProperty('--pieceSize', size);
        let _level = constructLevel(numbers, true);
        this.gameCurrentBoardPieces = _level.board;
        this.splashBoard = true;
        document.getElementsByTagName('wallpaper')[0].style.backgroundColor = 'black';
        document.getElementsByTagName('wallpaper')[0].style.opacity = 0.8;
      }
    },

    StartDailyChallenge() {
      note('StartDailyChallenge() called');
      this.usersModeBeforeDailyChallenge = this.getCurrentGameModeComputed;
      this.SelectMode(this.GetModeById('normal'));
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

    GetMonthAndDay(_date) {
      const date = new Date(_date);
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      return `${month} ${day}`;
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
      note('HandleKeyUp(event) called');
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
        case 'c':
          this.ToggleUsingCats();
          break;
        case 'p':
          this.ToggleUsingAltPattern();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          if (!this.appTutorialIsInPlay && !this.gameCurrentIsGameOver && !this.appVisualStateShowPageChallenge) {
            this.CheckBoard();
          } else if (!this.gameCurrentIsGameOver && this.appVisualStateShowPageChallenge) {
            this.EndGame();
          } else if (this.appTutorialIsInPlay) {
            if (this.appTutorialCurrentStepIndex < this.appTutorialSteps.length - 1) {
              this.HandleTutorialNext();
            } else if (this.gameCurrentIsGameOver) {
              this.HandleSkipTutorial();
            }
          }
          break;
        case 'Escape':
          this.ClearEphemeralVisualStates();
          break;
      }
    },

    HandleKeyDown(event) {
      switch (event.key) {
        case ' ':
        case 'Enter':
          event.preventDefault();
          break;
      }
    },

    ClearEphemeralVisualStates() {
      note('ClearEphemeralVisualStates() called');
      this.RemoveConfetti();
      this.gameConfettiCount = 0;
      this.appVisualStateShowNotification = false;
      this.appVisualStateShowElementHint = false;
      this.appVisualStateShowPageManageCurrency = false;
      this.tempPerfectBasicGames = this.userNumberOfPerfectBasicGames;
      if (this.gameCurrentIsGameOver) {
        this.appVisualStateShowPageHome = true;
      }
      if (this.appTutorialIsInPlay) {
        this.HandleSkipTutorial();
      }
      this.appVisualStateShowGameOverContent = true;
      this.appVisualStateShowPageSettings = false;
      this.appVisualStateShowPageHighScores = false;
      this.appVisualStateShowPageAchievements = false;
      this.appVisualStateShowPageHowToPlay = false;
      this.appVisualStateShowPageCredits = false;
      this.appVisualStateShowPageChallenge = false;
      this.appVisualStateShowElementHint = false;
      this.appVisualStateShowPageGameOver = false;
    },

    HandleUpdateAppButtonClick() {
      note('HandleUpdateAppButtonClick() called');
      this.newVersionAvailable = false;
      if (this.serviceWorker !== '') {
        this.serviceWorker.postMessage({ action: 'skipWaiting' });
      } else {
        window.location.reload(true);
      }
    },

    HandleServiceWorkerRegistration() {
      note('HandleServiceWorkerRegistration() called');
      if ('serviceWorker' in navigator) {
        // Register the service worker
        navigator.serviceWorker.register('./sw.js').then((reg) => {
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
    window.addEventListener('keydown', this.HandleKeyDown);
    window.addEventListener('pageshow', this.HandleOnPageShowEvent);
    window.addEventListener('visibilitychange', this.HandleOnVisibilityChange);
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
    userScoresHighEasyByValue: function () {
      note('userScoresHighEasyByValue() called');
      function compare(a, b) {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;
        return 0;
      }
      return this.userHighScoresEasy
        .filter((obj) => !obj.isDaily)
        .sort(compare)
        .flat()
        .slice(0, this.appSettingsNumberOfHighScoresShown);
    },

    userScoresHighDailyByDate: function () {
      note('userScoresHighDailyByDate() called');
      function compare(a, b) {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      }
      return this.userHighScoresEasy
        .filter((obj) => obj.isDaily)
        .sort(compare)
        .flat()
        .slice(0, this.appSettingsNumberOfHighScoresShown);
    },

    userScoresHighInfiniteByValue: function () {
      note('userScoresHighInfiniteByValue() called');
      function compare(a, b) {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;
        return 0;
      }
      return this.userHighScoresInfinite.sort(compare).flat().slice(0, this.appSettingsNumberOfHighScoresShown);
    },

    userScoresHighDailyByValue: function () {
      note('userScoresHighDailyByValue() called');
      function compare(a, b) {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;
        return 0;
      }
      return this.userHighScoresEasy
        .filter((obj) => obj.isDaily)
        .sort(compare)
        .flat()
        .slice(0, this.appSettingsNumberOfHighScoresShown);
    },

    userHasDoneTodaysDailyChallenge: function () {
      const today = new Date().toDateString();
      return this.userHighScoresEasy.some((obj) => new Date(obj.dailyDate).toDateString() === today && obj.isDaily);
    },

    getCurrentGameModeComputed: function () {
      note('getCurrentGameModeComputed() called');
      return this.GetCurrentGameMode();
    },

    getInfiniteModeComputed: function () {
      note('getInfiniteModeComputed() called');
      return this.GetModeById('infinite');
    },

    getNormalModeComputed: function () {
      note('getNormalModeComputed() called');
      return this.GetModeById('normal');
    },

    getCurrentPlayerRank: function () {
      note('getCurrentPlayerRank() called');
      return this.allPlayerRanks.find((r) => r.rank === this.userRank);
    },

    getLastHighScoreRank: function () {
      note('getLastHighScoreRank() called');
      return this.GetRankById(this.gameLastHighScore.rankId);
    },

    getNextPlayerRank: function () {
      note('getNextPlayerRank() called');
      return this.allPlayerRanks.find((r) => r.rank === parseInt(this.userRank + 1));
    },

    getLastRank: function () {
      note('getLastRank() called');
      return this.allPlayerRanks[this.allPlayerRanks.length - 1];
    },

    getGameOverTitle: function () {
      note('getGameOverTitle() called');
      let title = '';
      if (this.getNormalModeComputed.isSelected) {
        title = 'Game over';
        if (this.gameLastHighScore.numberOfPerfectClears === this.gameLastHighScore.totalPossibleClears) {
          title = 'PERFECT!';
          if (this.gameCurrentJustRankedUp && this.userNumberOfPerfectBasicGames < 3) {
            title = "<span class='ranktext'>" + this.getCurrentPlayerRank.name + ' unlocked!!</span>';
          }
        }
      } else {
        title = this.gameLastHighScore.numberOfClears > 0 ? 'Success' : 'No worry';
      }
      return title;
    },

    getGameOverSubtitle: function () {
      note('getGameOverSubtitle() called');
      let message = '';
      if (this.getNormalModeComputed.isSelected) {
        if (this.gameLastHighScore.isDaily && !this.appVisualStateShowNewHighScoreElement) {
          message = 'Daily - ' + this.GetMonthAndDay(this.gameLastHighScore.dailyDate);
        } else if (!this.userSettingsUseHardCoreMode && this.userNumberOfPerfectBasicGames >= 3) {
          message = 'Hardcore Mode Unlocked!';
        } else if (!this.gameLastHighScore.isDaily && !this.appVisualStateShowNewHighScoreElement) {
          message = this.gameLastHighScore.numberOfPerfectClears === this.gameLastHighScore.totalPossibleClears ? 'Very nicely done.' : 'Better luck next time!';
        }
      } else {
        message = this.gameLastHighScore.numberOfClears > 0 ? 'You are present and connected.' : 'There will always be time.';
      }
      return message;
    },

    getHomePageRankSubcredit: function () {
      note('getHomePageRankSubcredit() called');
      let subcredit = '';
      if (!this.userSettingsUseHardCoreMode && this.userNumberOfPerfectBasicGames < 3 && this.getNextPlayerRank !== undefined) {
        subcredit = 'Next rank: &rdquo;' + this.getNextPlayerRank.name + '&ldquo;';
      } else if (!this.userSettingsUseHardCoreMode && this.userNumberOfPerfectBasicGames < 3 && this.getNextPlayerRank === undefined) {
        subcredit = 'The next rank is a mystery!';
      } else if (!this.userSettingsUseHardCoreMode && this.userNumberOfPerfectBasicGames >= 3) {
        subcredit = 'Hardcore Mode Unlocked!';
      } else if (this.userSettingsUseHardCoreMode && this.userNumberOfPerfectBasicGames < 3 && this.getNextPlayerRank !== undefined) {
        subcredit = 'Next Hardcore rank: &rdquo;' + this.getNextPlayerRank.name + '&ldquo;';
      }
      return subcredit;
    },

    getRankPageSubcredt: function () {
      note('getRankPageSubcredt() called');
      let subcredit = '';
      if (!this.userSettingsUseHardCoreMode && this.userNumberOfPerfectBasicGames < 3) {
        subcredit = 'Get 3 perfect games to unlock the next rank. Perfect games are only earned when every level in that game is cleared on the <b>first</b> attempt.';
      } else if (!this.userSettingsUseHardCoreMode && this.userRank === this.getLastRank.rank && this.userNumberOfPerfectBasicGames >= 3) {
        subcredit = "Amazing! You've done at least 3 perfect games as a <b>" + this.getLastRank.name + '</b> But if you truly want a challenge, enable Hardcore mode and start over.';
      } else if (this.userSettingsUseHardCoreMode && this.userRank < this.getLastRank.rank) {
        subcredit = 'Get 3 perfect games in a row to unlock the next rank. Perfect games are only earned when every level in that game is cleared on the <b>first</b> attempt.';
      } else if (this.userSettingsUseHardCoreMode && this.userRank === this.getLastRank.rank && this.userNumberOfPerfectBasicGames < 3) {
        subcredit = 'Wow! It takes some serious skill to achieve the <b>' + this.getLastRank.name + '</b> rank while in Hardcore Mode.';
      } else if (this.userSettingsUseHardCoreMode && this.userRank === this.getLastRank.rank && this.userNumberOfPerfectBasicGames >= 3) {
        subcredit = this.appSettingsHardcoreFinishedEmoji + ' You are beyond impressive: <br /><b>' + this.getLastRank.name + '</b> rank while in Hardcore Mode with at least 3 consecutive perfect games. <br />They should sing songs about you!';
      }
      return subcredit;
    },

    getNextRankRequirementsText: function () {
      note('getRankPageSubcredt() called');
      let text = '';
      if (this.userRank !== this.getLastRank.rank) {
        text = 'Just ' + (3 - this.userNumberOfPerfectBasicGames) + ' more perfect ' + (this.userNumberOfPerfectBasicGames === 2 ? 'game' : 'games') + ' till the next Rank';
      } else if (!this.userSettingsUseHardCoreMode && this.userRank === this.getLastRank.rank && this.userNumberOfPerfectBasicGames < 3) {
        text = 'Just ' + (3 - this.userNumberOfPerfectBasicGames) + ' more perfect ' + (this.userNumberOfPerfectBasicGames === 2 ? 'game' : 'games');
      }
      return text;
    },

    getCurrencies: function () {
      note('getCurrencies() called');
      return this.userCurrency.filter((currency) => currency.isEnabled);
    },

    getFirstTwoItemsSortedByOrder: function () {
      note('getFirstTwoItemsSortedByOrder() called');
      return [this.userSettingsActionItems[0], this.userSettingsActionItems[1]];
    },

    getSecondTwoItemsSortedByOrder: function () {
      note('getSecondTwoItemsSortedByOrder() called');
      return [this.userSettingsActionItems[2], this.userSettingsActionItems[3]];
    },

    getItemsSortedByCost: function () {
      note('getItemsSortedByCost() called');
      function compare(a, b) {
        if (a.cost > b.cost) return 1;
        if (a.cost < b.cost) return -1;
        return 0;
      }
      return this.userSettingsActionItems.sort(compare);
    },
  },
});
