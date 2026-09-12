import {
    getSearchFromSearchParams, getExcludeSkechesFromSearchParams,
    getSectionsFromSearchParams, getSeriesFromSearchParams, getDateRangeFromSearchParams,
    initSearch, initSearchInput, initExcludeSketchesCheck,
    initSectionCheckboxes, initSeriesCheckboxes, initDateRangeSelect,
} from "/scripts/search-functions.js";
import { updateArtworksList } from "/scripts/artworks-list.js";
import { cmpDate, getDateFromDateObj, getDateFromDateString } from "/scripts/util.js";

const searchParams = new URLSearchParams(window.location.search);
let searchData = getSearchFromSearchParams(searchParams);
let excludeSketchesData = getExcludeSkechesFromSearchParams(searchParams);
let sectionsData = getSectionsFromSearchParams(searchParams);
let seriesData = getSeriesFromSearchParams(searchParams);
let {
    dateRange: dateRangeData,
    dateFrom: dateFromData,
    dateTo: dateToData,
} = getDateRangeFromSearchParams(searchParams);

export default function initArtworksSearch(artworksData) {
    const searchForm = document.getElementById("search-form");
    const artworkCountDisplay = document.querySelector(".artwork-count");
    const artworkCountPluralDisplay = document.querySelector(".artwork-count-plural");

    const updateArtworks = (searchParams) => {
        const artworkCount = updateArtworksList(artworksData, searchParams);

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

export function filterArtworksData(artworksData,
    { search, excludeSketches, sections, series, dateRange, dateFrom, dateTo }
) {
    if (search != null) { searchData = search; }
    if (excludeSketches != null) { excludeSketchesData = excludeSketches; }
    if (sections != null) { sectionsData = sections; }
    if (series != null) { seriesData = series; }
    if (dateRange != null) { dateRangeData = dateRange; }
    if (dateFrom != null) { dateFromData = dateFrom; }
    if (dateTo != null) { dateToData = dateTo; }

    let filteredArtworksData = [...artworksData];

    if (sectionsData.length > 0) {
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => sectionsData.includes(artwork.section));
    }

    if (seriesData.length > 0) {
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => artwork.series.some(s => seriesData.includes(s)));
    }

    if (searchData != null && searchData != "") {
        const searchRegex = searchData.split(" ").map(word => new RegExp(`.*${word}.*`, "i"));
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => {
            const artworkString = artwork.title + artwork.description + artwork.tags;
            return searchRegex.every(regex => regex.test(artworkString));
        });
    }

    if (excludeSketchesData) {
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => !artwork.sketch);
    }

    if (dateRangeData === "last-month") {
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) =>
            cmpDate(artwork.date, getDateFromDateObj(lastMonthDate)) >= 0);

    } else if (dateRangeData === "last-6-months") {
        const lastSixMonthsDate = new Date();
        lastSixMonthsDate.setMonth(lastSixMonthsDate.getMonth() - 6);
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) =>
            cmpDate(artwork.date, getDateFromDateObj(lastSixMonthsDate)) >= 0);

    } else if (dateRangeData === "last-year") {
        const lastYearDate = new Date();
        lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) =>
            cmpDate(artwork.date, getDateFromDateObj(lastYearDate)) >= 0);

    } else if (dateRangeData === "range") {
        if (dateFromData && dateToData) {
            filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) =>
                cmpDate(artwork.date, getDateFromDateString(dateFromData)) >= 0
             && cmpDate(artwork.date, getDateFromDateString(dateToData))   <= 0)
        }
    }

    const filteredArtworkIds = filteredArtworksData.map(([artworkId, _]) => artworkId);

    return filteredArtworkIds;
}
