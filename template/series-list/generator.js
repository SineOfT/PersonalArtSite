const fs = require("fs");
const path = require("path");
const { getDateSpan } = require("../utility");
const generateArtworkThumbnail = require("../artwork-thumbnail/generator");

const seriesListHtml = fs.readFileSync(path.join(__dirname, "/series-list.html"));
const listSeriesHtml = fs.readFileSync(path.join(__dirname, "/list-series.html"));

function generateSeriesList(seriesList, seriesData, artworksData) {
    let artworkStyles = [];
    const updatedListSeries = seriesList
        .map((seriesId, index) => {
            const series = seriesData.get(seriesId);
            if (!series) {
                console.warn(`Series ${seriesId} not found`);
                return "";
            }

            const artworkId = series["thumbnail"];
            const { html: seriesThumbnail, styles: thisArtworkStyles } =
                generateArtworkThumbnail(artworkId, artworksData.get(artworkId));

            if (artworkStyles.length === 0) { artworkStyles = thisArtworkStyles; }

            return listSeriesHtml.toString()
                .replaceAll("%__SERIES_ID__%", seriesId)
                .replaceAll("%__SERIES_INDEX__%", index)
                .replaceAll("%__SERIES_TITLE", series["title"])
                .replaceAll("%__SERIES_COUNT__%", series["artworks"]?.length ?? 0)
                .replaceAll("%__SERIES_DATE_SPAN__%", getDateSpan(series["date-span"]))
                .replaceAll("%__SERIES_DESCRIPTION__%", series["description"])
                .replaceAll("%__SERIES_THUMBNAIL__%", seriesThumbnail);
        })
        .join("\n");
    
    const updatedSeriesList = seriesListHtml.toString()
        .replaceAll("%__SERIES_LIST__%", updatedListSeries);

    return {
        html: updatedSeriesList,
        styles: [...artworkStyles, "transition", "series-list"]
    };
}

module.exports = generateSeriesList;