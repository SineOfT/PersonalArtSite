
export function initSearch(form) {
    const jsDisabledDisplay = document.querySelector(".js-disabled-display");

    const artworkCountDisplay = document.querySelector(".artwork-count");
    const artworkCountPluralDisplay = document.querySelector(".artwork-count-plural");

    jsDisabledDisplay.classList.add("d-none");
    form.classList.remove("v-none");
}

export const getSearchFromSearchParams = (searchParams) => searchParams.get("search")?.trim();
export function initSearchInput(form, update) {
    const searchInput = form.querySelector(".search-input");
    
    const searchParams = new URLSearchParams(window.location.search);
    const search = getSearchFromSearchParams(searchParams);
    
    if (search) searchInput.value = search;

    searchInput.addEventListener("input", () => {
        const search = searchInput.value;
        update({ search });
    });
}

export const getExcludeSkechesFromSearchParams = (searchParams) => searchParams.get("exclude-sketches");
export function initExcludeSketchesCheck(form, update) {
    const excludeSketchesCheck = form.querySelector(".exclude-sketches-check");
    
    const searchParams = new URLSearchParams(window.location.search);
    const excludeSketches = getExcludeSkechesFromSearchParams(searchParams);
    console.log(excludeSketches);

    if (excludeSketches) excludeSketchesCheck.setAttribute("checked", true);
    
    excludeSketchesCheck.addEventListener("input", () => {
        const excludeSketches = excludeSketchesCheck.checked;
        update({ excludeSketches });
    });
}

export const getSectionsFromSearchParams = (searchParams) => searchParams.getAll("sections");
export function initSectionCheckboxes(form, update) {
    const sectionCheckboxes = form.querySelector(".section-checkboxes");
    const sectionCheckboxArray = [...sectionCheckboxes.querySelectorAll("input[name='sections']")];

    const searchParams = new URLSearchParams(window.location.search);
    const sections = getSearchFromSearchParams(searchParams);
    
    sectionCheckboxArray.forEach((checkbox) => {
        if (sections?.includes(checkbox.value)) {
            checkbox.setAttribute("checked", true);
        }
    });

    sectionCheckboxArray.forEach((checkbox) => {
        checkbox.addEventListener("input", () => {
            const sections = sectionCheckboxArray
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);
            update({ sections });
        });
    });
}

export const getSeriesFromSearchParams = (searchParams) => searchParams.getAll("series");
export function initSeriesCheckboxes(form) {
    const seriesCheckboxes = form.querySelector(".series-checkboxes");
    const seriesCheckboxArray = [...seriesCheckboxes.querySelectorAll("input[name='series']")]

    const searchParams = new URLSearchParams(window.location.search);
    const series = getSeriesFromSearchParams(searchParams);
    
    seriesCheckboxArray.forEach((checkbox) => {
        if (series?.includes(checkbox.value)) {
            checkbox.setAttribute("checked", true);
        }
    });

    seriesCheckboxArray.forEach((checkbox) => {
        checkbox.addEventListener("input", () => {
            const series = seriesCheckboxArray
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);
            update({ series });
        });
    });
}

export const getDateRangeFromSearchParams = (searchParams) => ({
    dateRange: searchParams.get("date-range"),
    dateFrom: searchParams.get("date-from"),
    dateTo: searchParams.get("date-to"),
});
export function initDateRangeSelect(form, update) {
    const dateRangeSelect = form.querySelector(".date-range-select");
    const dateFromToSelectContainer = form.querySelector(".date-from-to-select-container");
    const dateFromSelect = form.querySelector(".date-from-select");
    const dateToSelect = form.querySelector(".date-to-select");
    
    const searchParams = new URLSearchParams(window.location.search);
    const { dateRange, dateFrom, dateTo } = getDateRangeFromSearchParams(searchParams);
    
    if (dateRange) dateRangeSelect.value = dateRange;
    if (dateRange === "range") { dateFromToSelectContainer.classList.remove("v-none"); }
    if (dateFrom) dateFromSelect.value = dateFrom;
    if (dateTo) dateToSelect.value = dateTo;

    dateRangeSelect.addEventListener("input", (e) => {
        if (e.target.value === "range") {
            dateFromToSelectContainer.classList.remove("v-none");
        } else {
            dateFromToSelectContainer.classList.add("v-none");
        }

        const dateRange = dateRangeSelect.value;
        update({ dateRange });
    });

    dateFromSelect.addEventListener("input", () => {
        const dateFrom = dateFromSelect.value;
        update({ dateFrom });
    });

    dateToSelect.addEventListener("input", () => {
        const dateTo = dateToSelect.value;
        update({ dateTo });
    });
}