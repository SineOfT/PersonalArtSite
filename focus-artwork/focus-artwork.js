const fs = require("fs");
const path = require("path");

const focusArtworkHtml = fs.readFileSync(path.join(__dirname, "/focus-artwork.html"));

function getFocusArtworkHtml(artworksData) {
    const updatedFocusArtworkHtml =  focusArtworkHtml.toString()
        .replaceAll("%__ARTWORKS_DATA__%", JSON.stringify(artworksData));
    return updatedFocusArtworkHtml;
}

module.exports = getFocusArtworkHtml;