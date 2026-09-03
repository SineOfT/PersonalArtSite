const fs = require("fs");
const path = require("path");

const scrollHtml = fs.readFileSync(path.join(__dirname, "/scroll.html"));
const scrollbarSpriteHtml = fs.readFileSync(path.join(__dirname, "/scrollbar-sprite.html"));
const scrollAnchorHtml = fs.readFileSync(path.join(__dirname, "/scroll-anchor.html"));

const SCROLLBAR_SPRITE_COUNT = 300;

function generateScroll(scrollData) {
    const updatedScrollbarSpritesHtml =
        Array.from(
            { length: SCROLLBAR_SPRITE_COUNT},
            (_, index) => (
                scrollbarSpriteHtml.toString()
                    .replaceAll("%__SCROLLBAR_SPRITE_INDEX__%", index)
            )
        )
        .join("\n");
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
        .replaceAll("%__SCROLLBAR_SPRITES__%", updatedScrollbarSpritesHtml)
        .replaceAll("%__SCROLL_ANCHORS__%", updatedScrollAnchorsHtml)
        .replaceAll("%__SCROLL_DATA__%", JSON.stringify(scrollData));

    return {
        html: updatedScrollHtml,
        styles: ["scroll"]
    };
}

module.exports = generateScroll;