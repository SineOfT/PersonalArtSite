const fs = require("fs");
const path = require("path");
const generateBreadcrumbs = require("../breadcrumbs/generator");
const generateArtworksList = require("../artworks-list/generator");
const generateSite = require("../site/generator");

const seriesHtml = fs.readFileSync(path.join(__dirname, "/series.html"));

function generateSeriesSites(sectionsData, seriesData, artworksData) {
    return [...seriesData.entries()].map(([seriesId, series]) => {
        const section = sectionsData.get(series.section);
        const seriesArtworksData = new Map([...artworksData.entries()]
            .filter(([_artworkId, artwork]) => artwork.series.includes(seriesId)));
        const { html: updatedSeriesArtworksListHtml, styles: artworksStyles } =
            generateArtworksList(
                seriesArtworksData,
                `?series=${seriesId}&reversed&return-url=%2Fseries%2F${seriesId}%2F`,
                true); // first artwork in series first

        const { html: seriesBreadcrumbs, styles: breadcrumbsStyles } = generateBreadcrumbs([
            { "href": `/#${series.section}`, "title": "Home" },
            ...(series.section
                ? [{ "href": `/sections/${series.section}#${seriesId}`, "title": section["title"] }]
                : [])
        ]);

        const updatedSeriesHtml = seriesHtml.toString()
            .replaceAll("%__SERIES_ARTWORK_COUNT__%", seriesArtworksData.size)
            .replaceAll("%__SERIES_ARTWORKS_LIST__%", updatedSeriesArtworksListHtml)
            .replaceAll("%__SERIES_TITLE__%", series["title"]);

        const { html: updatedSeriesSite, styles: siteStyles } =
            generateSite(updatedSeriesHtml, seriesBreadcrumbs, []);

        return {
            id: seriesId,
            html: updatedSeriesSite,
            styles: [...siteStyles, ...breadcrumbsStyles, ...artworksStyles]
        };
    });
}

module.exports = generateSeriesSites;