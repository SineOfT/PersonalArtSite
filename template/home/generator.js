const fs = require("fs");
const path = require("path");

const generateSite = require("../site/generator");

const homeHtml = fs.readFileSync(path.join(__dirname, "/home.html"));
const sectionHtml = fs.readFileSync(path.join(__dirname, "/section.html"));

function generateHomeSite(sectionOrderData, sectionsData, artworksData, scrollBehaviorData) {
    const updatedSectionsHtml = sectionOrderData
        .map((id) => {
            const section = sectionsData.get(id);
            if (!section) { return ""; }
            return sectionHtml.toString()
                .replaceAll("%__SECTION_ID__%", id)
                .replaceAll("%__SECTION_TITLE__%", section["title"])
                .replaceAll("%__SECTION_DESCRIPTION__%", section["description"])
                .replaceAll("%__SECTION_THUMBNAIL_0__%", `${section["thumbnail-0"]}/thumbnail.webp`)
                .replaceAll("%__SECTION_THUMBNAIL_1__%", `${section["thumbnail-1"]}/thumbnail.webp`)
                .replaceAll("%__SECTION_THUMBNAIL_2__%", `${section["thumbnail-2"]}/thumbnail.webp`)
                .replaceAll("%__SECTION_THUMBNAIL_3__%", `${section["thumbnail-3"]}/thumbnail.webp`)
                .replaceAll("%__SECTION_THUMBNAIL_4__%", `${section["thumbnail-4"]}/thumbnail.webp`);
        })
        .join("\n");
    const updatedHomeHtml = homeHtml.toString()
        .replaceAll("%__HOME_SECTIONS__%", updatedSectionsHtml);

    const { html: updatedHomeSite, styles: siteStyles } =
        generateSite(updatedHomeHtml, "", scrollBehaviorData);

    return {
        html: updatedHomeSite,
        styles: [...siteStyles, "transition", "home"]
    };
}

module.exports = generateHomeSite;