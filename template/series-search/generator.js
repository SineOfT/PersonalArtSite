const fs = require("fs");
const path = require("path");
const generateSeriesList = require("../series-list/generator");
const generateSite = require("../site/generator");

const seriesSearchHtml = fs.readFileSync(path.join(__dirname, "/series-search.html"));

function generateSeriesSearch(sectionsData, seriesData, artworksData) {
    const sectionCheckboxes = [...sectionsData.entries()]
        .map(([sectionId, section]) => `
            <div>
                <input type="checkbox" name="sections" id="${sectionId}-section-checkbox" value=${sectionId} />
                <label for="${sectionId}-section-checkbox">${section.title}</label>
            </div>
        `)
        .join("");
    
    const { html: updatedSeriesListHtml, styles: seriesStyles } =
        generateSeriesList(seriesData, artworksData);
        
    const seriesDataArray = [...seriesData.entries()];
    const updatedSeriesSearchHtml = seriesSearchHtml.toString()
        .replaceAll("%__SERIES_LIST__%", updatedSeriesListHtml)
        .replaceAll("%__SERIES_COUNT__%", seriesDataArray.length)
        .replaceAll("%__SERIES_DATA__%", JSON.stringify(seriesDataArray))
        .replaceAll("%__SECTIONS_CHECKBOXES__%", sectionCheckboxes);

    const { html: updatedSeriesSearchSite, styles: siteStyles } =
        generateSite(updatedSeriesSearchHtml, "", []);

    return {
        html: updatedSeriesSearchSite,
        styles: [...siteStyles, ...seriesStyles],
        title: "Series Search",
    };
}

module.exports = generateSeriesSearch;