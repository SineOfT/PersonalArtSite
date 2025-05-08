const fs = require("fs");
const path = require("path");

const homeHtml = fs.readFileSync(path.join(__dirname, "/home.html"));
const sectionHtml = fs.readFileSync(path.join(__dirname, "/section.html"));

function getHomeHtml(sectionOrderData, sectionsData, artworksData, scrollBehaviorData) {
    const updatedSectionsHtml = sectionOrderData
        .map((id) => {
            const section = sectionsData[id];
            if (!section) { return ""; }
            return sectionHtml.toString()
                .replaceAll("%__SECTION_ID__%", id)
                .replaceAll("%__SECTION_TITLE__%", section["title"])
                .replaceAll("%__SECTION_DESCRIPTION__%", section["description"])
                .replaceAll("%__SECTION_THUMBNAIL_0__%", artworksData[section["thumbnail-0"]]?.["main"] ?? "not-found.png")
                .replaceAll("%__SECTION_THUMBNAIL_1__%", artworksData[section["thumbnail-1"]]?.["main"] ?? "not-found.png")
                .replaceAll("%__SECTION_THUMBNAIL_2__%", artworksData[section["thumbnail-2"]]?.["main"] ?? "not-found.png")
                .replaceAll("%__SECTION_THUMBNAIL_3__%", artworksData[section["thumbnail-3"]]?.["main"] ?? "not-found.png")
                .replaceAll("%__SECTION_THUMBNAIL_4__%", artworksData[section["thumbnail-4"]]?.["main"] ?? "not-found.png");
        })
        .join("\n");
    const html = homeHtml.toString().replaceAll("%__HOME_SECTIONS__%", updatedSectionsHtml);
    return { html, scrollData: scrollBehaviorData };
}

module.exports = getHomeHtml;