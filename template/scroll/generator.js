const fs = require("fs");
const path = require("path");

const scrollHtml = fs.readFileSync(path.join(__dirname, "/scroll.html"));
const scrollAnchorHtml = fs.readFileSync(path.join(__dirname, "/scroll-anchor.html"));

function generateScroll(scrollData) {
    const updatedScrollAnchorsHtml = scrollData
        .map(({ sectionId, hashId, title }) => {
            return scrollAnchorHtml.toString()
                .replaceAll("%__SECTION_ID__%", sectionId)
                .replaceAll("%__SECTION_HASH__%", hashId)
                .replaceAll("%__SECTION_TITLE__%", title);
        })
        .join("\n");
    const updatedScrollHtml = scrollHtml.toString()
        .replaceAll("%__SCROLL_ANCHORS__%", updatedScrollAnchorsHtml)
        .replaceAll("%__SCROLL_DATA__%", JSON.stringify(scrollData));

    return updatedScrollHtml;
}

module.exports = generateScroll;