class ScoreObject {
  constructor(spec) {
    this.date = spec.date == undefined ? new Date() : spec.date;
    this.isCurrent = spec.isCurrent == undefined ? false : spec.isCurrent;
    this.value = spec.value;
  }
}
