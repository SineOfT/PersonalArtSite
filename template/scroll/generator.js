const fs = require("fs");
const path = require("path");

const scrollHtml = fs.readFileSync(path.join(__dirname, "/scroll.html"));
const scrollAnchorHtml = fs.readFileSync(path.join(__dirname, "/scroll-anchor.html"));

function generateScroll(scrollData) {
    scrollData.unshift({
        sectionId: "page-top",
        hashId: "",
        title: "Top",
        color: "#F94",
        transition: false,
    });
    scrollData.push({
        sectionId: "page-bottom",
        hashId: "page-bottom",
        title: "End",
        color: "#FFF",
        transition: false,
    });

    const updatedScrollAnchorsHtml = scrollData
        .map(({ sectionId, hashId, title, color }) => {
            return scrollAnchorHtml.toString()
                .replaceAll("%__SCROLL_ID__%", sectionId)
                .replaceAll("%__SCROLL_HASH__%", hashId)
                .replaceAll("%__SCROLL_TITLE__%", title)
                .replaceAll("%__SCROLL_COLOR__%", color);
        })
        .join("\n");
    const updatedScrollHtml = scrollHtml.toString()
        .replaceAll("%__SCROLL_ANCHORS__%", updatedScrollAnchorsHtml)
        .replaceAll("%__SCROLL_DATA__%", JSON.stringify(scrollData).replaceAll("'", "\\'"));

    return {
        html: updatedScrollHtml,
        styles: ["scroll"]
    };
}

module.exports = generateScroll;