/// <reference path="../helpers/console-enhancer.js" />
/// <reference path="../models/PieceObject.js" />

class TutorialStepObject {
  constructor(spec) {
    this.title = spec.title == undefined ? 'Title' : spec.title;
    this.description = spec.description == undefined ? 'Description' : spec.description;
    this.unreveal = spec.unreveal == undefined ? false : spec.unreveal;
    this.partial = spec.partial == undefined ? false : spec.partial;
    this.describe = spec.describe == undefined ? false : spec.describe;
    this.checkBoard = spec.checkBoard == undefined ? false : spec.checkBoard;
  }
}

var TutorialSteps = [
  new TutorialStepObject({
    title: 'Hi! This is Me.',
    description: 'I live inside this button.',
    unreveal: true,
  }),
  new TutorialStepObject({
    title: 'This is still Me.',
    description: 'I change every level.',
    unreveal: true,
  }),
  new TutorialStepObject({
    title: 'This is a level.',
    description: 'Some of these pieces are "like" Me.',
  }),
  new TutorialStepObject({
    title: 'These 4 are like me!',
    description: 'They are the only ones that share <b>at least 2</b> of my attributes: color, shape, or pattern.',
    partial: true,
    describe: true,
  }),
  new TutorialStepObject({
    title: 'So now what?',
    description: 'Select all of the pieces like Me and then click Me to clear the level. Hit <b>BACK</b> if you get stuck.',
    checkBoard: true,
  }),
  new TutorialStepObject({
    title: "That's it!",
    description: 'Clear as many levels as possible before the clock runs out. Perfect clears add bonus time.',
    unreveal: true,
  }),
  // new TutorialStepObject({
  //   title: 'One last thing...',
  //   description: 'Check out the settings for different colors and options. You can also pause a game by tapping the timer.',
  //   unreveal: true,
  // }),
];
