const fs = require("fs");
const path = require("path");
const generateBreadcrumbs = require("../breadcrumbs/generator");
const generateSeriesList = require("../series-list/generator");
const generateSite = require("../site/generator");

const sectionHtml = fs.readFileSync(path.join(__dirname, "/section.html"));

function generateSectionSites(sectionsData, seriesData, artworksData) {
    return [...sectionsData.entries()].map(([sectionId, section]) => {
        const sectionSeriesData = new Map([...seriesData.entries()]
            .filter(([_seriesId, series]) => series["section"] === sectionId));
        const seriesScroll = section["series"].map((seriesId) => {
            const series = seriesData.get(seriesId);
            return {
                sectionId: seriesId,
                hashId: seriesId,
                title: series["title"],
                transition: false,
                color: series["color"]
            };
        });
        
        const { html: updatedSectionSeriesListHtml, styles: seriesStyles } =
            generateSeriesList(sectionSeriesData, artworksData);

        const { html: sectionBreadcrumbs, styles: breadcrumbsStyles } = generateBreadcrumbs([
            { "href": `/#${sectionId}`, "title": "Home" }
        ]);

        const updatedSectionHtml = sectionHtml.toString()
            .replaceAll("%__SECTION_SERIES_LIST__%", updatedSectionSeriesListHtml)
            .replaceAll("%__SECTION_TITLE__%", section["title"]);

        const { html: updatedSectionSite, styles: siteStyles } =
            generateSite(updatedSectionHtml, sectionBreadcrumbs, seriesScroll);

        return {
            id: sectionId,
            html: updatedSectionSite,
            styles: [...siteStyles, ...breadcrumbsStyles, ...seriesStyles],
            title: section["title"],
        };
    });
}

module.exports = generateSectionSites;