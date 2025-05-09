const fs = require("fs");
const path = require("path");
const { getDate } = require("../server/utility");
const generateFocusArtwork = require("../focus-artwork/generator");
const generateBreadcrumbs = require("../breadcrumbs/generator");
const generateScrollSite = require("../scroll/generator");

const seriesHtml = fs.readFileSync(path.join(__dirname, "/series.html"));
const artworkHtml = fs.readFileSync(path.join(__dirname, "/artwork.html"));

function generateSeriesSites(sectionsData, seriesData, artworksData) {
    return Object.entries(seriesData).map(([seriesId, series]) => {    
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
        
        const updatedSeriesHtml = seriesHtml.toString()
            .replaceAll("%__SERIES_ARTWORKS__%", updatedArtworksHtml)
            .replaceAll("%__SERIES_TITLE__%", series["title"]);

        const seriesBreadcrumbs = generateBreadcrumbs([
            { "href": `/#${sectionId}`, "title": "Home" },
            ...(sectionId ? [{ "href": `/section/${sectionId}`, "title": section["title"] }] : [])
        ]);

        const focusArtwork = generateFocusArtwork(artworksData);

        const updatedSeriesSite = generateScrollSite(seriesBreadcrumbs + updatedSeriesHtml + focusArtwork, []);

        return { id: seriesId, html: updatedSeriesSite };
    });
}

module.exports = generateSeriesSites;