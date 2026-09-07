const fs = require("fs");
const path = require("path");

const generateSite = require("../site/generator");
const { getThumbnail } = require("../utility");

const homeHtml = fs.readFileSync(path.join(__dirname, "/home.html"));
const sectionHtml = fs.readFileSync(path.join(__dirname, "/section.html"));
const sectionThumbnailHtml = fs.readFileSync(path.join(__dirname, "/section-thumbnail.html"));
const homeTextHtml = fs.readFileSync(path.join(__dirname, "../../data/home-text.html"));

function generateHomeSite(sectionOrderData, sectionsData, artworksData, scrollBehaviorData) {
    const updatedSectionsHtml = sectionOrderData
        .map((id) => {
            const section = sectionsData.get(id);
            if (!section) { return ""; }
            const updatedSectionThumbnailsHtml = section["thumbnails"]
                .map((thumbnailObj, i) => {
                    const { thumbnail, cssVariables } = getThumbnail(thumbnailObj);
                    return sectionThumbnailHtml.toString()
                        .replaceAll("%__SECTION_THUMBNAIL__%", thumbnail)
                        .replaceAll("%__SECTION_THUMBNAIL_INDEX__%", i)
                        .replaceAll("%__SECTION_THUMBNAIL_CSS_VARIABLES__%", cssVariables)
                        .replaceAll("%__SECTION_DISPLAY_TYPE__%", section["display-type"])
                })
                .join("\n");
            return sectionHtml.toString()
                .replaceAll("%__SECTION_ID__%", id)
                .replaceAll("%__SECTION_TITLE__%", section["title"])
                .replaceAll("%__SECTION_DESCRIPTION__%", section["description"])
                .replaceAll("%__SECTION_DISPLAY_TYPE__%", section["display-type"])
                .replaceAll("%__SECTION_THUMBNAILS__%", updatedSectionThumbnailsHtml);
        })
        .join("\n");
    const updatedHomeHtml = homeHtml.toString()
        .replaceAll("%__HOME_TEXT__%", homeTextHtml)
        .replaceAll("%__HOME_SECTIONS__%", updatedSectionsHtml);

    const { html: updatedHomeSite, styles: siteStyles } =
        generateSite(updatedHomeHtml, "", scrollBehaviorData);

    return {
        html: updatedHomeSite,
        styles: [...siteStyles, "transition", "home"]
    };
}

module.exports = generateHomeSite;