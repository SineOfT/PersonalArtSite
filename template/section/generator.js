const fs = require("fs");
const path = require("path");
const generateBreadcrumbs = require("../breadcrumbs/generator");
const generateSeriesList = require("../series-list/generator");
const generateSite = require("../site/generator");

const sectionHtml = fs.readFileSync(path.join(__dirname, "/section.html"));

function generateSectionSites(sectionsData, seriesData, artworksData) {
    return Object.entries(sectionsData).map(([sectionId, section]) => {
        const sectionSeriesList = section["series"] ?? [];
        const seriesScroll = sectionSeriesList.map((seriesId) => {
            const series = seriesData[seriesId];
            return {
                sectionId: seriesId,
                hashId: seriesId,
                title: series["title"],
                transition: false
            };
        });
        
        const updatedSectionSeriesListHtml = generateSeriesList(sectionSeriesList, seriesData, artworksData);

        const sectionBreadcrumbs = generateBreadcrumbs([
            { "href": `/#${sectionId}`, "title": "Home" }
        ]);

        const updatedSectionHtml = sectionHtml.toString()
            .replaceAll("%__SECTION_SERIES_LIST__%", updatedSectionSeriesListHtml)
            .replaceAll("%__SECTION_BREADCRUMBS__%", sectionBreadcrumbs)
            .replaceAll("%__SECTION_TITLE__%", section["title"]);

        const updatedSectionSite = generateSite(updatedSectionHtml, seriesScroll);

        return { id: sectionId, html: updatedSectionSite };
    });
}

module.exports = generateSectionSites;