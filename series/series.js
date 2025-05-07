const fs = require("fs");
const path = require("path");
const { getDate } = require("../server/utility");
const getFocusArtworkHtml = require("../focus-artwork/focus-artwork");
const getBreadcrumbsHtml = require("../breadcrumbs/breadcrumbs");

const seriesHtml = fs.readFileSync(path.join(__dirname, "/series.html"));
const artworkHtml = fs.readFileSync(path.join(__dirname, "/artwork.html"));

function getSeriesHtml(seriesId, sectionsData, seriesData, artworksData) {
    const series = seriesData[seriesId];
    if (!series) { return ""; }
    const [sectionId, section] = Object.entries(sectionsData)
        .find(([_sectionId, section]) => section["series"].includes(seriesId));
    const artworksArr = series["artworks"] ?? [];
    const updatedArtworksHtml = artworksArr
        .map((artworkId) => {
            const artwork = artworksData[artworkId];
            if (!artwork) { return ""; }
            return artworkHtml.toString()
                .replaceAll("%__ARTWORK_ID__%", artworkId)
                .replaceAll("%__ARTWORK_IMAGE__%", artwork["main"])
                .replaceAll("%__ARTWORK_TITLE__%", artwork["title"])
                .replaceAll("%__ARTWORK_DATE__%", getDate(artwork["year"], artwork["month"], artwork["day"]))
                .replaceAll("%__ARTWORK_DESCRIPTION__%", artwork["description"]);
        })
        .join("\n");
    const updatedSeriesHtml =
        getFocusArtworkHtml(artworksData) +
        getBreadcrumbsHtml([
            { "href": `/#${sectionId}`, "title": "Home" },
            ...(sectionId ? [{ "href": `/section/${sectionId}`, "title": section["title"] }] : [])
        ]) +
        seriesHtml.toString()
            .replaceAll("%__SERIES_ARTWORKS__%", updatedArtworksHtml)
            .replaceAll("%__SERIES_TITLE__%", series["title"]);
    return updatedSeriesHtml;
}

module.exports = getSeriesHtml;