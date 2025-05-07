const crypto = require("crypto");

function getETag(lastModified) {
    return crypto.hash("sha256", lastModified.toString()).toString("hex");
}

function getYearSpan(startYear, endYear) {
    if (startYear === endYear) {
        return `${startYear}`;
    }
    if (endYear === "") {
        return `${startYear} &ndash; Current`;
    }
    return `${startYear} &ndash; ${endYear}`;
}

function getDate(year, month, day) {
    const monthString = month ? (
        month === 1  ?  " January"
      : month === 2  ? " February"
      : month === 3  ? " March"
      : month === 4  ? " April"
      : month === 5  ? " May"
      : month === 6  ? " June"
      : month === 7  ? " July"
      : month === 8  ? " August"
      : month === 9  ? " September"
      : month === 10 ? " October"
      : month === 11 ? " November"
      : month === 12 ? " December"
      : ""
    ) : "";
    const dayString = day ? ` ${day}` : "";

    return `${year}${monthString}${dayString}`;
}

module.exports = {
    getETag,
    getYearSpan,
    getDate
};