const fs = require("fs");
const path = require("path");
const generateSeriesList = require("../series-list/generator");
const generateSite = require("../site/generator");
const { cmpDateSpan } = require("../utility");

const seriesSearchHtml = fs.readFileSync(path.join(__dirname, "/series-search.html"));

function generateSeriesSearch(seriesData, artworksData) {
    let seriesListEntries = Object.entries(seriesData);
    seriesListEntries.sort(([_aId, a], [_bId, b]) => cmpDateSpan(a["date-span"], b["date-span"]));
    const seriesList = seriesListEntries.map(([seriesId, _]) => seriesId);
    const { html: updatedSeriesListHtml, styles: seriesStyles } =
        generateSeriesList(seriesList, seriesData, artworksData);
    
    const updatedSeriesSearchHtml = seriesSearchHtml.toString()
        .replaceAll("%__SERIES_LIST__%", updatedSeriesListHtml);

    const { html: updatedSeriesSearchSite, styles: siteStyles } = generateSite(updatedSeriesSearchHtml, []);

    return {
        html: updatedSeriesSearchSite,
        styles: [...siteStyles, ...seriesStyles]
    };
}

module.exports = generateSeriesSearch;