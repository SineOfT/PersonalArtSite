const fs = require("fs");
const path = require("path");
const { getThumbnailImage, getThumbnailCssVariables } = require("../utility");

const artworkMediaHtml = fs.readFileSync(path.join(__dirname, "/artwork-thumbnail.html"));

function generateArtworkThumbnail(artworkId, artwork = { }) {
    return {
        html: artworkMediaHtml.toString()
            .replaceAll("%__ARTWORK_IMAGE__%", getThumbnailImage(artworkId))
            .replaceAll("%__ARTWORK_CLASS__%", artwork["censor"] ? "censor" : "")
            .replaceAll("%__ARTWORK_CSS_VARIABLES__%", getThumbnailCssVariables(artwork)),
        styles: ["artwork-thumbnail"]
    };
}

module.exports = generateArtworkThumbnail;