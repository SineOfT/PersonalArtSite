const fs = require("fs");
const path = require("path");
const generateBreadcrumbs = require("../breadcrumbs/generator");
const generateSeriesList = require("../series-list/generator");
const generateSite = require("../site/generator");

const sectionHtml = fs.readFileSync(path.join(__dirname, "/section.html"));

function generateSectionSites(sectionsData, seriesData, artworksData) {
    return [...sectionsData.entries()].map(([sectionId, section]) => {
        const sectionSeriesList = section["series"] ?? [];
        const seriesScroll = {
            data: sectionSeriesList.map((seriesId) => {
                const series = seriesData.get(seriesId);
                return {
                    sectionId: seriesId,
                    hashId: seriesId,
                    title: series["title"],
                    transition: false,
                    color: series["color"]
                };
            }),
            excludeTop: true,
        };
        
        const { html: updatedSectionSeriesListHtml, styles: seriesStyles } =
            generateSeriesList(sectionSeriesList, seriesData, artworksData);

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
            styles: [...siteStyles, ...breadcrumbsStyles, ...seriesStyles]
        };
    });
}

module.exports = generateSectionSites;