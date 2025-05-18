const fs = require("fs");
const path = require("path");
const { getDateSpan } = require("../utility");

const seriesListHtml = fs.readFileSync(path.join(__dirname, "/series-list.html"));
const listSeriesHtml = fs.readFileSync(path.join(__dirname, "/list-series.html"));

function generateSeriesList(seriesList, seriesData, artworksData) {
    const updatedListSeries = seriesList
        .map((seriesId, index) => {
            const series = seriesData[seriesId];
            if (!series) { return ""; }
            return listSeriesHtml.toString()
                .replaceAll("%__SERIES_ID__%", seriesId)
                .replaceAll("%__SERIES_INDEX__%", index)
                .replaceAll("%__SERIES_TITLE", series["title"])
                .replaceAll("%__SERIES_COUNT__%", series["artworks"]?.length ?? 0)
                .replaceAll("%__SERIES_DATE_SPAN__%", getDateSpan(series["date-span"]))
                .replaceAll("%__SERIES_DESCRIPTION__%", series["description"])
                .replaceAll("%__SERIES_THUMBNAIL__%", artworksData[series["thumbnail"]]?.["main"] ?? "not-found.png");
        })
        .join("\n");
    
    const updatedSeriesList = seriesListHtml.toString()
        .replaceAll("%__SERIES_LIST__%", updatedListSeries);

    return updatedSeriesList;
}

module.exports = generateSeriesList;