const fs = require("fs");
const path = require("path");

const artworkHtml = fs.readFileSync(path.join(__dirname, "/artwork.html"));
const layerHtml = fs.readFileSync(path.join(__dirname, "/layer.html"));

function generateArtworkSites(seriesData, artworksData) {
    return Object.entries(artworksData).map(([artworkId, artwork]) => {    
        const [seriesId, _series] = Object.entries(seriesData)
            .find(([_seriesId, series]) => series["artworks"].includes(artworkId));

        const layerCount = artwork["layer-count"];
        const updatedLayersHtml = Array.from(
            { length: layerCount },
            (_, index) => (
                layerHtml.toString()
                    .replaceAll("%__LAYER_ID__%", index)
                    .replaceAll("%__LAYER_IMAGE__%", `${artworkId}/${index}.png`)
                    .replaceAll("%__LAYER_CURR__%", index + 1)
                    .replaceAll("%__LAYER_COUNT__%", layerCount)
                    .replaceAll("%__LAYER_UP__%", index - 1 || "")
                    .replaceAll("%__LAYER_DOWN__%", index + 1)
                    .replaceAll("%__LAYER_UP_CLASS__%", index <= 0 ? "disabled" : "")
                    .replaceAll("%__LAYER_DOWN_CLASS__%", index >= layerCount - 1 ? "disabled" : "")
            )
        ).join("\n");

        const updatedArtworkHtml = artworkHtml.toString()
            .replaceAll("%__ARTWORK_ID__%", artworkId)
            .replaceAll("%__ARTWORK_TITLE__%", artwork["title"])
            .replaceAll("%__ARTWORK_YEAR__%", artwork["date"]["year"])
            .replaceAll("%__SERIES_ID__%", seriesId)
            .replaceAll("%__ARTWORK_LAYERS__%", updatedLayersHtml);

        return { id: artworkId, html: updatedArtworkHtml };
    });
}

module.exports = generateArtworkSites;