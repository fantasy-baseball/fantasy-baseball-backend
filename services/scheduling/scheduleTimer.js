const schedule = require("node-schedule-tz");

const prepareGameTime = new schedule.RecurrenceRule();
prepareGameTime.dayOfWeek = [0, new schedule.Range(2, 6)];
prepareGameTime.hour = 4;
prepareGameTime.minute = 0;
prepareGameTime.tz = "Asia/Seoul";

exports.prepareGameTime = prepareGameTime;

const weekdayOpenGameTime = new schedule.RecurrenceRule();
weekdayOpenGameTime.dayOfWeek = [new schedule.Range(1, 5)];
weekdayOpenGameTime.hour = 18;
weekdayOpenGameTime.minute = 30;
weekdayOpenGameTime.tz = "Asia/Seoul";

exports.weekdayOpenGameTime = weekdayOpenGameTime;

const saturdayOpenGameTime = new schedule.RecurrenceRule();
saturdayOpenGameTime.dayOfWeek = [6];
saturdayOpenGameTime.hour = 17;
saturdayOpenGameTime.minute = 0;
saturdayOpenGameTime.tz = "Asia/Seoul";

exports.saturdayOpenGameTime = saturdayOpenGameTime;

const sundayOpenGameTime = new schedule.RecurrenceRule();
sundayOpenGameTime.dayOfWeek = [0];
sundayOpenGameTime.hour = 14;
sundayOpenGameTime.minute = 0;
sundayOpenGameTime.tz = "Asia/Seoul";

exports.sundayOpenGameTime = sundayOpenGameTime;
