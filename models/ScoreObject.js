class ScoreObject {
  constructor(spec) {
    this.date = spec.date === undefined ? new Date() : spec.date;
    this.modeId = spec.modeId === undefined ? '' : spec.modeId;
    this.modeName = spec.modeName === undefined ? '' : spec.modeName;
    this.numberOfClears = spec.numberOfClears === undefined ? 0 : spec.numberOfClears;
    this.numberOfPerfectClears = spec.numberOfPerfectClears === undefined ? 0 : spec.numberOfPerfectClears;
    this.totalPossibleClears = spec.totalPossibleClears === undefined ? -1 : spec.totalPossibleClears;
    this.dailyDate = spec.dailyDate === undefined ? new Date() : spec.dailyDate;
    this.isCurrent = spec.isCurrent === undefined ? false : spec.isCurrent;
    this.isDaily = spec.isDaily === undefined ? false : spec.isDaily;
    this.value = spec.value === undefined ? -1 : spec.value;
    this.streak = spec.streak === undefined ? 0 : spec.streak;
  }
}
