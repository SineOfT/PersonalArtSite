import { updateArtworksList } from "/scripts/artworks-list.js";
import { cmpDate, getDateFromDateObj, getDateFromDateString } from "/scripts/util.js";

export default function initArtworksSearch(artworksData) {
    const jsDisabledDisplay = document.querySelector(".js-disabled-display");
    const searchForm = document.getElementById("search-form");
    const searchInput = searchForm.querySelector(".search-input");
    const excludeSketchesCheck = searchForm.querySelector(".exclude-sketches-check");
    const sectionCheckboxes = searchForm.querySelector(".section-checkboxes");
    const seriesCheckboxes = searchForm.querySelector(".series-checkboxes");
    const dateRangeSelect = searchForm.querySelector(".date-range-select");
    const dateFromToSelectContainer = searchForm.querySelector(".date-from-to-select-container");
    const dateFromSelect = searchForm.querySelector(".date-from-select");
    const dateToSelect = searchForm.querySelector(".date-to-select");

    const artworkCountDisplay = document.querySelector(".artwork-count");
    const artworkCountPluralDisplay = document.querySelector(".artwork-count-plural");

    jsDisabledDisplay.classList.add("d-none");
    searchForm.classList.remove("v-none");

    const { search, excludeSketches, sections, series, dateRange, dateFrom, dateTo } = getSearchParams();
    if (search) searchInput.value = search;
    if (excludeSketches) excludeSketchesCheck.setAttribute("checked", true);
    sections?.forEach(sections => sectionCheckboxes.querySelector(`[name="sections"][value="${sections}"]`)?.setAttribute("checked", true))
    series?.forEach(series => seriesCheckboxes.querySelector(`[name="series"][value="${series}"]`)?.setAttribute("checked", true))
    if (dateRange) dateRangeSelect.value = dateRange;
    if (dateRange === "range") { dateFromToSelectContainer.classList.remove("v-none"); }
    else                       { dateFromToSelectContainer.classList.add("v-none"); }
    if (dateFrom) dateFromSelect.value = dateFrom;
    if (dateTo) dateToSelect.value = dateTo;

    searchForm.querySelectorAll("input, select").forEach(input => input.addEventListener("input", () => {
        const search = searchInput.value;
        const excludeSketches = excludeSketchesCheck.checked;
        const sections = [...sectionCheckboxes.querySelectorAll(`[name="sections"]`)]
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const series = [...seriesCheckboxes.querySelectorAll(`[name="series"]`)]
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const dateRange = dateRangeSelect.value;
        const dateFrom = dateFromSelect.value;
        const dateTo = dateToSelect.value;

        const artworkCount = updateArtworksList(artworksData,
            { search, excludeSketches, sections, series, dateRange, dateFrom, dateTo });

        artworkCountDisplay.textContent = artworkCount;
        if (artworkCount === 1) {
            artworkCountPluralDisplay.textContent = "";
        } else {
            artworkCountPluralDisplay.textContent = "s";
        }
    }));

    dateRangeSelect.addEventListener("input", e => {
        if (e.target.value === "range") {
            dateFromToSelectContainer.classList.remove("v-none");
        } else {
            dateFromToSelectContainer.classList.add("v-none");
        }
    });
}

export function getSearchParams() {
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("search")?.trim();
    const excludeSketches = searchParams.get("exclude-sketches");
    const sections = searchParams.getAll("sections");
    const series = searchParams.getAll("series");
    const dateRange = searchParams.get("date-range");
    const dateFrom = searchParams.get("date-from");
    const dateTo = searchParams.get("date-to");
    return { search, excludeSketches, sections, series, dateRange, dateFrom, dateTo };
}

export function filterArtworksData(artworksData,
    { search, excludeSketches, sections, series, dateRange, dateFrom, dateTo }
) {
    let filteredArtworksData = [...artworksData];

    if (sections.length > 0) {
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => sections.includes(artwork.section));
    }

    if (series.length > 0) {
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => artwork.series.some(s => series.includes(s)));
    }

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
