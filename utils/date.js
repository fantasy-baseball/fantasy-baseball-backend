const format = require("date-fns/format");

const formatDate = (date, setting) => (format(date, setting));

module.exports = formatDate;
