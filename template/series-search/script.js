import {
    getSearchFromSearchParams, getSectionsFromSearchParams,
    initSearch, initSearchInput, initSectionCheckboxes,
} from "/scripts/search-functions.js";
import { updateSeriesList } from "/scripts/series-list.js";

let {
    search: searchData,
    sections: sectionsData,
} = getSeriesSearchParams();

export default function initSeriesSearch(seriesData) {
    const searchForm = document.getElementById("search-form");
    const seriesCountDisplay = document.querySelector(".series-count");

    const updateSeries = ({ search, sections }) => {
        if (search != null) { searchData = search; }
        if (sections != null) { sectionsData = sections; }

        const seriesCount = updateSeriesList(seriesData, {
            search: searchData,
            sections: sectionsData,
        });
        seriesCountDisplay.textContent = seriesCount;
    }

    initSearch(searchForm, updateSeries);
    initSearchInput(searchForm, updateSeries);
    initSectionCheckboxes(searchForm, updateSeries);
}

export function getSeriesSearchParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const search = getSearchFromSearchParams(searchParams);
    const sections = getSectionsFromSearchParams(searchParams);
    return { search, sections };
}

export function filterSeriesData(seriesData,
    { search, sections }
) {
    let filteredSeriesData = [...seriesData];

    if (search != null && search != "") {
        const searchRegex = search.split(" ").map(word => new RegExp(`.*${word}.*`, "i"));
        filteredSeriesData = filteredSeriesData.filter(([_seriesId, series]) => {
            const seriesString = series.title + series.description + series.tags;
            return searchRegex.every(regex => regex.test(seriesString));
        });
    }

    if (sections.length > 0) {
        filteredSeriesData = filteredSeriesData.filter(([_seriesId, series]) => {
            return sections.includes(series.section);
        });
    }

    const filteredSeriesIds = filteredSeriesData.map(([artworkId, _]) => artworkId);

    return filteredSeriesIds;
}