const fs = require("fs");
const path = require("path");

const artworkImageHtml = fs.readFileSync(path.join(__dirname, "/artwork-thumbnail.html"));

function generateArtworkThumbnail(artwork) {
    let position = "";

    if (artwork["position"]) {
        const { x, y } = artwork["position"];
        position = `${x ? `--x: ${x}` : ""} ${y ? `--y: ${y}` : ""}`;
    }

    return {
        html: artworkImageHtml.toString()
            .replaceAll("%__ARTWORK_IMAGE__%", artwork["thumbnail"] ?? "not-found.jpg")
            .replaceAll("%__ARTWORK_CLASS__%", artwork["censor"] ? "censor" : "")
            .replaceAll("%__ARTWORK_CSS_VARIABLES__%", position),
        styles: ["artwork-thumbnail"]
    };
}

module.exports = generateArtworkThumbnail;