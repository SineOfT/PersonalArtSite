const fs = require("fs");
const path = require("path");
const { getYearSpan } = require("../server/utility");
const getBreadcrumbsHtml = require("../breadcrumbs/breadcrumbs");

const sectionHtml = fs.readFileSync(path.join(__dirname, "/section.html"));
const seriesHtml = fs.readFileSync(path.join(__dirname, "/series.html"));

function getSectionHtml(sectionId, sectionsData, seriesData, artworksData) {
    const section = sectionsData[sectionId];
    if (!section) { return ""; }
    const seriesArr = section["series"] ?? [];
    const updatedSeriesHtml = seriesArr
        .map((seriesId) => {
            const series = seriesData[seriesId];
            if (!series) { return ""; }
            return seriesHtml.toString()
                .replaceAll("%__SERIES_ID__%", seriesId)
                .replaceAll("%__SERIES_TITLE", series["title"])
                .replaceAll("%__SERIES_COUNT__%", series["artworks"]?.length ?? 0)
                .replaceAll("%__SERIES_YEARSPAN__%", getYearSpan(series["start-year"], series["end-year"]))
                .replaceAll("%__SERIES_DESCRIPTION__%", series["description"])
                .replaceAll("%__SERIES_THUMBNAIL__%", artworksData[series["thumbnail"]]?.["main"] ?? "not-found.png");
        })
        .join("\n");
    const updatedSectionHtml = 
        getBreadcrumbsHtml([
            { "href": `/#${sectionId}`, "title": "Home" }
        ]) +
        sectionHtml.toString()
            .replaceAll("%__SECTION_SERIES__%", updatedSeriesHtml)
            .replaceAll("%__SECTION_TITLE__%", section["title"]);
    return updatedSectionHtml;
}

module.exports = getSectionHtml;