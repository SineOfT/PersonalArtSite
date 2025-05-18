function getDateSpan(dateSpan) {
    const { ["start-date"]: startDate, ["end-date"]: endDate } = dateSpan;
    const startDateString = getDate(startDate);
    
    if (endDate === "no-range") {
        return startDateString;
    }

    if (endDate === "current") {
        return `${startDateString} &ndash; Current`;
    }

    const endDateString = getDate(endDate);
    return `${startDateString} &ndash; ${endDateString}`
}

function cmpDateSpan(dateSpanA, dateSpanB) {
    const { ["start-date"]: startDateA, ["end-date"]: endDateA } = dateSpanA;
    const { ["start-date"]: startDateB, ["end-date"]: endDateB } = dateSpanB;

    if (endDateA === "current" && endDateB !== "current") { return  1; }
    if (endDateA !== "current" && endDateB === "current") { return -1; }

    const cmpStartDate = cmpDate(startDateA, startDateB);
    if (cmpStartDate) { return cmpStartDate; }

    const cmpEndDate = cmpDate(
        endDateA === "no-range" ? startDateA : endDateA,
        endDateB === "no-range" ? startDateB : endDateB
    );
    if (cmpEndDate) { return cmpEndDate; }

    return 0;
}


function getDate(date) {
    const { year, month, day } = date;
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

function cmpDate(dateA, dateB) {
    function cmpNumberOrNull(a, b) {
        if (!a && !b) { return 0; }
        if (!b) { return -1; }
        if (!a) { return  1; }
        if (a < b) { return  -1; }
        if (a > b) { return   1; }
        return 0;
    }

    const cmpYear = cmpNumberOrNull(dateA.year, dateB.year);
    if (cmpYear) { return cmpYear; }
    
    const cmpMonth = cmpNumberOrNull(dateA.month, dateB.month);
    if (cmpMonth) { return cmpMonth; }

    const cmpDay = cmpNumberOrNull(dateA.day, dateB.day);
    if (cmpDay) { return cmpDay; }

    return 0;
}

module.exports = {
    getDateSpan,
    cmpDateSpan,
    getDate,
    cmpDate
};