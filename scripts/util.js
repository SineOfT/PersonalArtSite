
export const lerp = (a, b, t) => a * (1-t) + b * t;

export const toURLCase = (string) => string.replaceAll(/([A-Z])/g, '-$1').toLowerCase();

export function getDateSpan(dateSpan) {
    const { ["start-date"]: startDate, ["end-date"]: endDate } = dateSpan;
    const startDateString = getDate(startDate);
    
    if (endDate === "no-range") {
        return startDateString;
    }

    if (endDate === "current") {
        return `${startDateString} &ndash; Current`;
    }

    if (startDate.year === endDate.year) {
        endDate.year = "";
    }

    const endDateString = getDate(endDate);
    return `${startDateString} &ndash; ${endDateString}`
}

export function cmpDateSpan(dateSpanA, dateSpanB) {
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


export function getDate(date) {
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

export function cmpDate(dateA, dateB) {
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

    const cmpDay = cmpNumberOrNull(dateA.day || dateA["approx-day"], dateB.day || dateB["approx-day"]);
    if (cmpDay) { return cmpDay; }

    const cmpOrder = cmpNumberOrNull(dateA.order, dateB.order);
    if (cmpOrder) { return cmpOrder; }

    return 0;
}

export function getDateFromDateObj(dateObj) {
    if (!dateObj) return { };
    return {
        year: dateObj.getFullYear(),
        month: dateObj.getMonth()+1,
        day: dateObj.getDate(),
    }
}

export function getDateFromDateString(dateString) {
    if (!dateString) return { };
    const dateStringParts = dateString.split("-");
    if (dateStringParts.length !== 3) return { };
    const [year, month, day] = dateStringParts;
    return { year, month, day };
}


export function getPositionOnSprite(sprite, [x, y], direction) {
    const bounds = sprite.getBoundingClientRect();
    return [
        direction < 0
            ? bounds.right - bounds.width * x
            : bounds.left  + bounds.width * x,
        bounds.bottom - bounds.height * y,
    ]
};

export function isWithinDistance(pointA, pointB, maxDistance) {
    const distanceX = Math.abs(pointB[0] - pointA[0]);
    const distanceY = Math.abs(pointB[1] - pointA[1]);
    return distanceX < maxDistance && distanceY < maxDistance;
}

export function isWithinProjectionX(pointA, pointB, minDistance, maxDistance, maxSlope, direction) {
    const displacementX = (pointB[0] - pointA[0]) * direction;
    const distanceX = Math.abs(displacementX);
    const distanceY = Math.abs(pointB[1] - pointA[1]);
    const slope = distanceX === 0 ? Infinity : distanceY / distanceX;
    return slope < maxSlope && displacementX >= minDistance && displacementX < maxDistance;
}

export function isWithinProjectionY(pointA, pointB, minDistance, maxDistance, maxSlope, direction) {
    const distanceX = Math.abs(pointB[0] - pointA[0]);
    const displacementY = (pointB[1] - pointA[1]) * direction;
    const distanceY = Math.abs(displacementY);
    const slope = distanceY === 0 ? Infinity : distanceX / distanceY;
    return slope < maxSlope && displacementY >= minDistance && displacementY < maxDistance;
}