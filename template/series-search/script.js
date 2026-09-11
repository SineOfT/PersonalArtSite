import {
    getSearchFromSearchParams, getSectionsFromSearchParams,
    initSearch, initSearchInput, initSectionCheckboxes,
} from "/scripts/search-functions.js";
import { updateSeriesList } from "/scripts/series-list.js";

const searchParams = new URLSearchParams(window.location.search);
let searchData = getSearchFromSearchParams(searchParams);
let sectionsData = getSectionsFromSearchParams(searchParams);

export default function initSeriesSearch(seriesData) {
    const seriesCountDisplay = document.querySelector(".series-count");

    const updateSeries = (searchParams) => {
        const seriesCount = updateSeriesList(seriesData, searchParams);
        seriesCountDisplay.textContent = seriesCount;
    }

    const searchForm = document.getElementById("search-form");

    initSearch(searchForm, updateSeries);
    initSearchInput(searchForm, updateSeries);
    initSectionCheckboxes(searchForm, updateSeries);
}

export function filterSeriesData(seriesData,
    { search, sections }
) {
    if (search != null) { searchData = search; }
    if (sections != null) { sectionsData = sections; }

    let filteredSeriesData = [...seriesData];

    if (searchData != null && searchData != "") {
        const searchRegex = searchData.split(" ").map(word => new RegExp(`.*${word}.*`, "i"));
        filteredSeriesData = filteredSeriesData.filter(([_seriesId, series]) => {
            const seriesString = series.title + series.description + series.tags;
            return searchRegex.every(regex => regex.test(seriesString));
        });
    }

    if (sectionsData.length > 0) {
        filteredSeriesData = filteredSeriesData.filter(([_seriesId, series]) => {
            return sectionsData.includes(series.section);
        });
    }

    const filteredSeriesIds = filteredSeriesData.map(([artworkId, _]) => artworkId);

    return filteredSeriesIds;
}