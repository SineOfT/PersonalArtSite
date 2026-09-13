import {
    getSearchFromSearchParams, getExcludeSkechesFromSearchParams,
    getSectionsFromSearchParams, getSeriesFromSearchParams, getDateRangeFromSearchParams,
    initSearch, initSearchInput, initExcludeSketchesCheck,
    initSectionCheckboxes, initSeriesCheckboxes, initDateRangeSelect,
} from "/scripts/search-functions.js";
import { updateArtworksList } from "/scripts/artworks-list.js";
import { cmpDate, getDateFromDateObj, getDateFromDateString } from "/scripts/util.js";

const searchParams = new URLSearchParams(window.location.search);
let {
    search: searchData,
    excludeSketches: excludeSketchesData,
    sections: sectionsData,
    series: seriesData,
    dateRange: dateRangeData,
    dateFrom: dateFromData,
    dateTo: dateToData,
} = getArtworkSearchParams();

export default function initArtworksSearch(artworksData) {
    const searchForm = document.getElementById("search-form");
    const artworkCountDisplay = document.querySelector(".artwork-count");
    const artworkCountPluralDisplay = document.querySelector(".artwork-count-plural");

    const updateArtworks = (
        { search, excludeSketches, sections, series, dateRange, dateFrom, dateTo }
    ) => {
        if (search != null) { searchData = search; }
        if (excludeSketches != null) { excludeSketchesData = excludeSketches; }
        if (sections != null) { sectionsData = sections; }
        if (series != null) { seriesData = series; }
        if (dateRange != null) { dateRangeData = dateRange; }
        if (dateFrom != null) { dateFromData = dateFrom; }
        if (dateTo != null) { dateToData = dateTo; }

        const artworkCount = updateArtworksList(artworksData, {
            search: searchData,
            excludeSketches: excludeSketchesData,
            sections: sectionsData,
            series: seriesData,
            dateRange: dateRangeData,
            dateFrom: dateFromData,
            dateTo: dateToData,
        });

        artworkCountDisplay.textContent = artworkCount;
        if (artworkCount === 1) {
            artworkCountPluralDisplay.textContent = "";
        } else {
            artworkCountPluralDisplay.textContent = "s";
        }
    };

    initSearch(searchForm);
    initSearchInput(searchForm, updateArtworks);
    initExcludeSketchesCheck(searchForm, updateArtworks);
    initSectionCheckboxes(searchForm, updateArtworks);
    initSeriesCheckboxes(searchForm, updateArtworks);
    initDateRangeSelect(searchForm, updateArtworks);
}

export function getArtworkSearchParams() {
    const searchParams = new URLSearchParams(window.location.search);
    let search = getSearchFromSearchParams(searchParams);
    let excludeSketches = getExcludeSkechesFromSearchParams(searchParams);
    let sections = getSectionsFromSearchParams(searchParams);
    let series = getSeriesFromSearchParams(searchParams);
    let { dateRange, dateFrom, dateTo } = getDateRangeFromSearchParams(searchParams);
    return { search, excludeSketches, sections, series, dateRange, dateFrom, dateTo };
}

export function filterArtworksData(artworksData,
    { search, excludeSketches, sections, series, dateRange, dateFrom, dateTo }
) {
    let filteredArtworksData = [...artworksData];

    if (search != null && search != "") {
        const searchRegex = search.split(" ").map(word => new RegExp(`.*${word}.*`, "i"));
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => {
            const artworkString = artwork.title + artwork.description + artwork.tags;
            return searchRegex.every(regex => regex.test(artworkString));
        });
    }

    if (excludeSketches) {
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => !artwork.sketch);
    }

    if (sections?.length > 0) {
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => sections.includes(artwork.section));
    }

    if (series?.length > 0) {
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => artwork.series.some(s => series.includes(s)));
    }

    if (dateRange === "last-month") {
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) =>
            cmpDate(artwork.date, getDateFromDateObj(lastMonthDate)) >= 0);

    } else if (dateRange === "last-6-months") {
        const lastSixMonthsDate = new Date();
        lastSixMonthsDate.setMonth(lastSixMonthsDate.getMonth() - 6);
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) =>
            cmpDate(artwork.date, getDateFromDateObj(lastSixMonthsDate)) >= 0);

    } else if (dateRange === "last-year") {
        const lastYearDate = new Date();
        lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) =>
            cmpDate(artwork.date, getDateFromDateObj(lastYearDate)) >= 0);

    } else if (dateRange === "range") {
        if (dateFrom && dateTo) {
            filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) =>
                cmpDate(artwork.date, getDateFromDateString(dateFrom)) >= 0
             && cmpDate(artwork.date, getDateFromDateString(dateTo))   <= 0)
        }
    }

    const filteredArtworkIds = filteredArtworksData.map(([artworkId, _]) => artworkId);

    return filteredArtworkIds;
}
