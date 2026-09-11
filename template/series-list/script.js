import { filterSeriesData } from "/scripts/series-search.js";

document.addEventListener("DOMContentLoaded", () => {
    if (document.documentElement.classList.contains("minimal-animations")) { return; }
    if (window.scrollY !== 0) { return; }

    const sectionSeriesElements = document.getElementsByClassName("list-series-container");

    for (const sectionSeriesElement of sectionSeriesElements) {
        sectionSeriesElement.classList.add("slide", "hide");
    }

    document.body.offsetHeight; // force redraw

    for (const sectionSeriesElement of sectionSeriesElements) {
        sectionSeriesElement.classList.add("slide-transition");
    }

    document.body.offsetHeight; // force redraw

    for (const sectionSeriesElement of sectionSeriesElements) {
        sectionSeriesElement.classList.remove("hide");
    }
}, { once: true });

export function updateSeriesList(seriesData, searchParams) {
    const listSeriesArray = document.getElementsByClassName("list-series-container");

    const filteredSeriesIds = filterSeriesData(seriesData, searchParams);

    for (const listSeries of listSeriesArray) {
        if (filteredSeriesIds.includes(listSeries.id)) {
            listSeries.classList.remove("d-none");
        } else {
            listSeries.classList.add("d-none");
        }
    }

    return filteredSeriesIds.length;
}