const fs = require("fs");
const path = require("path");
const generateSeriesList = require("../series-list/generator");
const generateSite = require("../site/generator");

const seriesSearchHtml = fs.readFileSync(path.join(__dirname, "/series-search.html"));

function generateSeriesSearch(seriesData, artworksData) {
    const seriesList = [...seriesData.keys()];
    const { html: updatedSeriesListHtml, styles: seriesStyles } =
        generateSeriesList(seriesList, seriesData, artworksData);
    
    const updatedSeriesSearchHtml = seriesSearchHtml.toString()
        .replaceAll("%__SERIES_LIST__%", updatedSeriesListHtml);

    const { html: updatedSeriesSearchSite, styles: siteStyles } =
        generateSite(updatedSeriesSearchHtml, "", []);

    return {
        html: updatedSeriesSearchSite,
        styles: [...siteStyles, ...seriesStyles]
    };
}

module.exports = generateSeriesSearch;