const schedule = require("node-schedule-tz");

const preparationTime = new schedule.RecurrenceRule();
preparationTime.dayOfWeek = [new schedule.Range(0, 6)];
preparationTime.hour = 4;
preparationTime.minute = 0;
preparationTime.second = 0;
preparationTime.tz = "Asia/Seoul";

exports.preparationTime = preparationTime;

const weekdayGameOpenTime = new schedule.RecurrenceRule();
weekdayGameOpenTime.dayOfWeek = [new schedule.Range(2, 5)];
weekdayGameOpenTime.hour = 18;
weekdayGameOpenTime.minute = 15;
weekdayGameOpenTime.second = 0;
weekdayGameOpenTime.tz = "Asia/Seoul";

exports.weekdayGameOpenTime = weekdayGameOpenTime;

const weekdayGameCloseTime = new schedule.RecurrenceRule();
weekdayGameCloseTime.dayOfWeek = [new schedule.Range(2, 5)];
weekdayGameCloseTime.hour = 19;
weekdayGameCloseTime.minute = 30;
weekdayGameCloseTime.tz = "Asia/Seoul";

exports.weekdayGameCloseTime = weekdayGameCloseTime;

const saturdayGameOpenTime = new schedule.RecurrenceRule();
saturdayGameOpenTime.dayOfWeek = [6];
saturdayGameOpenTime.hour = 16;
saturdayGameOpenTime.minute = 45;
saturdayGameOpenTime.tz = "Asia/Seoul";

exports.saturdayGameOpenTime = saturdayGameOpenTime;

const saturdayGameCloseTime = new schedule.RecurrenceRule();
saturdayGameCloseTime.dayOfWeek = [6];
saturdayGameCloseTime.hour = 18;
saturdayGameCloseTime.minute = 0;
saturdayGameCloseTime.tz = "Asia/Seoul";

exports.saturdayGameCloseTime = saturdayGameCloseTime;

const sundayGameOpenTime = new schedule.RecurrenceRule();
sundayGameOpenTime.dayOfWeek = [0];
sundayGameOpenTime.hour = 16;
sundayGameOpenTime.minute = 45;
sundayGameOpenTime.tz = "Asia/Seoul";

exports.sundayGameOpenTime = sundayGameOpenTime;

const sundayGameCloseTime = new schedule.RecurrenceRule();
sundayGameCloseTime.dayOfWeek = [0];
sundayGameCloseTime.hour = 18;
sundayGameCloseTime.minute = 0;
sundayGameCloseTime.tz = "Asia/Seoul";

exports.sundayGameCloseTime = sundayGameCloseTime;
