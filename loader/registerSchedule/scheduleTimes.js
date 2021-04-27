const schedule = require("node-schedule-tz");

const preparationTime = new schedule.RecurrenceRule();
preparationTime.dayOfWeek = [0, new schedule.Range(2, 6)];
preparationTime.hour = 4;
preparationTime.minute = 0;
preparationTime.tz = "Asia/Seoul";

exports.preparationTime = preparationTime;

const weekdayGameOpenTime = new schedule.RecurrenceRule();
weekdayGameOpenTime.dayOfWeek = [new schedule.Range(2, 5)];
weekdayGameOpenTime.hour = 18;
weekdayGameOpenTime.minute = 30;
weekdayGameOpenTime.tz = "Asia/Seoul";

exports.weekdayGameOpenTime = weekdayGameOpenTime;

const saturdayGameOpenTime = new schedule.RecurrenceRule();
saturdayGameOpenTime.dayOfWeek = [6];
saturdayGameOpenTime.hour = 17;
saturdayGameOpenTime.minute = 0;
saturdayGameOpenTime.tz = "Asia/Seoul";

exports.saturdayGameOpenTime = saturdayGameOpenTime;

const sundayGameOpenTime = new schedule.RecurrenceRule();
sundayGameOpenTime.dayOfWeek = [0];
sundayGameOpenTime.hour = 14;
sundayGameOpenTime.minute = 0;
sundayGameOpenTime.tz = "Asia/Seoul";

exports.sundayGameOpenTime = sundayGameOpenTime;
