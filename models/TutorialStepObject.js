/// <reference path="../helpers/console-enhancer.js" />
/// <reference path="../models/PieceObject.js" />

class TutorialStepObject {
  constructor(spec) {
    this.title = spec.title == undefined ? 'Title' : spec.title;
    this.description = spec.description == undefined ? 'Description' : spec.description;
  }
}

var TutorialSteps = [
  new TutorialStepObject({
    title: 'Hi! This is Me.',
    description: 'I live inside this button.',
  }),
  new TutorialStepObject({
    title: 'This is still Me.',
    description: 'I change every level.',
  }),
  new TutorialStepObject({
    title: 'This is a level.',
    description: 'Some of these pieces are "like" Me.',
  }),
  new TutorialStepObject({
    title: 'These pieces are like me!',
    description: 'They share <b>at least 2</b> of my attributes: pattern and shape, shape and color, or color and pattern.',
  }),
  new TutorialStepObject({
    title: 'So now what?',
    description: 'Select all of the pieces like Me and then <br >click Me to clear the level.',
  }),
  new TutorialStepObject({
    title: "That's it!",
    description: "Then a new level with a new Me will start. Every game you'll get 3 minutes to clear as many levels as possible. Perfect clears add bonus time.",
  }),
];
