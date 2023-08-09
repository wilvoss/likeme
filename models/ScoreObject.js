class ScoreObject {
  constructor(spec) {
    this.date = spec.date == undefined ? new Date() : spec.date;
    this.dailyDate = spec.dailyDate == undefined ? new Date() : spec.dailyDate;
    this.isCurrent = spec.isCurrent == undefined ? false : spec.isCurrent;
    this.isDaily = spec.isDaily == undefined ? false : spec.isDaily;
    this.value = spec.value;
  }
}
