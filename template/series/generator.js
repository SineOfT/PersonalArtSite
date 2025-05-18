const fs = require("fs");
const path = require("path");
const generateBreadcrumbs = require("../breadcrumbs/generator");
const generateArtworksList = require("../artworks-list/generator");
const generateSite = require("../site/generator");

const seriesHtml = fs.readFileSync(path.join(__dirname, "/series.html"));

function generateSeriesSites(sectionsData, seriesData, artworksData) {
    return Object.entries(seriesData).map(([seriesId, series]) => {    
        const [sectionId, section] = Object.entries(sectionsData)
            .find(([_sectionId, section]) => section["series"].includes(seriesId));
        const seriesArtworksList = series["artworks"] ?? [];
        const updatedSeriesArtworksListHtml = generateArtworksList(seriesArtworksList, `?series=${seriesId}`, artworksData);

        const seriesBreadcrumbs = generateBreadcrumbs([
            { "href": `/#${sectionId}`, "title": "Home" },
            ...(sectionId ? [{ "href": `/sections/${sectionId}#${seriesId}`, "title": section["title"] }] : [])
        ]);

        const updatedSeriesHtml = seriesHtml.toString()
            .replaceAll("%__SERIES_ARTWORKS_LIST__%", updatedSeriesArtworksListHtml)
            .replaceAll("%__SERIES_BREADCRUMBS__%", seriesBreadcrumbs)
            .replaceAll("%__SERIES_TITLE__%", series["title"]);

        const updatedSeriesSite = generateSite(updatedSeriesHtml, []);

        return { id: seriesId, html: updatedSeriesSite };
    });
}

module.exports = generateSeriesSites;