class ScoreObject {
  constructor(spec) {
    this.date = spec.date == undefined ? new Date() : spec.date;
    this.isCurrent = spec.isCurrent == undefined ? false : spec.isCurrent;
    this.isDaily = spec.isDaily == undefined ? false : spec.isDaily;
    this.value = spec.value;
  }
}
