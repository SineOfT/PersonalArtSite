const fs = require("fs");
const path = require("path");

const artworkImageHtml = fs.readFileSync(path.join(__dirname, "/artwork-thumbnail.html"));

function generateArtworkThumbnail(artworkId, artwork = { }) {
    let cssVariables = "";

    const scale = artwork["scale"];
    const { x, y } = artwork["position"] || { };
    cssVariables = `${
        scale != null ? `--scale: ${scale};` : ""} ${
        x != null ? `--x: ${x};` : ""} ${
        y != null ? `--y: ${y};` : ""}`;

    return {
        html: artworkImageHtml.toString()
            .replaceAll("%__ARTWORK_IMAGE__%",
                artworkId.endsWith(".webp") ? artworkId : `${artworkId}/thumbnail.webp`)
            .replaceAll("%__ARTWORK_CLASS__%", artwork["censor"] ? "censor" : "")
            .replaceAll("%__ARTWORK_CSS_VARIABLES__%", cssVariables),
        styles: ["artwork-thumbnail"]
    };
}

module.exports = generateArtworkThumbnail;