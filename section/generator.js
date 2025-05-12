const fs = require("fs");
const path = require("path");
const { getYearSpan } = require("../server/utility");
const generateBreadcrumbs = require("../breadcrumbs/generator");
const generateSite = require("../site/generator");

const sectionHtml = fs.readFileSync(path.join(__dirname, "/section.html"));
const seriesHtml = fs.readFileSync(path.join(__dirname, "/series.html"));

function generateSectionSites(sectionsData, seriesData, artworksData) {
    return Object.entries(sectionsData).map(([sectionId, section]) => {
        const seriesArr = section["series"] ?? [];
        const seriesScroll = seriesArr.map((seriesId) => ({
            sectionId: seriesId,
            hashId: seriesId,
            screenFr: 0.5,
            anchor: 0.5,
            transition: false
        }));
        
        const updatedSeriesHtml = seriesArr
            .map((seriesId, index) => {
                const series = seriesData[seriesId];
                if (!series) { return ""; }
                return seriesHtml.toString()
                    .replaceAll("%__SERIES_ID__%", seriesId)
                    .replaceAll("%__SERIES_INDEX__%", index)
                    .replaceAll("%__SERIES_TITLE", series["title"])
                    .replaceAll("%__SERIES_COUNT__%", series["artworks"]?.length ?? 0)
                    .replaceAll("%__SERIES_YEARSPAN__%", getYearSpan(series["start-year"], series["end-year"]))
                    .replaceAll("%__SERIES_DESCRIPTION__%", series["description"])
                    .replaceAll("%__SERIES_THUMBNAIL__%", artworksData[series["thumbnail"]]?.["main"] ?? "not-found.png");
            })
            .join("\n");

        const updatedSectionHtml = sectionHtml.toString()
            .replaceAll("%__SECTION_SERIES__%", updatedSeriesHtml)
            .replaceAll("%__SECTION_TITLE__%", section["title"]);

        const sectionBreadcrumbs = generateBreadcrumbs([
            { "href": `/#${sectionId}`, "title": "Home" }
        ]);

        const updatedSectionSite = generateSite(sectionBreadcrumbs + updatedSectionHtml, seriesScroll);

        return { id: sectionId, html: updatedSectionSite };
    });
}

module.exports = generateSectionSites;