const fs = require("fs");
const path = require("path");
const { getDate } = require("../utility");

const artworkHtml = fs.readFileSync(path.join(__dirname, "/artwork.html"));
const layerHtml = fs.readFileSync(path.join(__dirname, "/layer.html"));

function generateArtworkSites(seriesData, artworksData) {
    return Object.entries(artworksData).map(([artworkId, artwork]) => {

        const findSeries = Object.entries(seriesData).reduce(
            (acc, [seriesId, series]) => {
                if (acc) { return acc; }
                const artworks = series["artworks"];
                const index = artworks.indexOf(artworkId);
                if (index >= 0) {
                    return { seriesId, artworks, index };
                }
                return null;
            },
            null
        );

        const layerCount = artwork["layer-count"];

        const updatedLayersHtml = layerCount === 0
            ? layerHtml.toString()
                .replaceAll("%__LAYER_ID__%", 0)
                .replaceAll("%__LAYER_IMAGE__%", artwork["thumbnail"])
                .replaceAll("%__LAYER_CURR__%", 1)
                .replaceAll("%__LAYER_COUNT__%", 1)
                .replaceAll("%__LAYER_UP__%", "")
                .replaceAll("%__LAYER_DOWN__%", "")
                .replaceAll("%__LAYER_UP_CLASS__%", "disabled")
                .replaceAll("%__LAYER_DOWN_CLASS__%", "disabled")
            : Array.from(
                { length: layerCount },
                (_, index) => (
                    layerHtml.toString()
                        .replaceAll("%__LAYER_ID__%", index)
                        .replaceAll("%__LAYER_IMAGE__%", `${artworkId}/${index}.jpg`)
                        .replaceAll("%__LAYER_CURR__%", index + 1)
                        .replaceAll("%__LAYER_COUNT__%", layerCount)
                        .replaceAll("%__LAYER_UP__%", index - 1 || "")
                        .replaceAll("%__LAYER_DOWN__%", index + 1)
                        .replaceAll("%__LAYER_UP_CLASS__%", index <= 0 ? "disabled" : "")
                        .replaceAll("%__LAYER_DOWN_CLASS__%", index >= layerCount - 1 ? "disabled" : "")
                )
            ).join("\n");

        let updatedArtworkHtml = artworkHtml.toString()
            .replaceAll("%__ARTWORK_ID__%", artworkId)
            .replaceAll("%__ARTWORK_TITLE__%", artwork["title"])
            .replaceAll("%__ARTWORK_DATE__%", getDate(artwork["date"]))
            .replaceAll("%__ARTWORK_LAYERS__%", updatedLayersHtml);

        if (findSeries) {
            const { seriesId, artworks, index } = findSeries;
            const artworkLeftId = artworks[index-1] ?? "";
            const artworkRightId = artworks[index+1] ?? "";
            updatedArtworkHtml = updatedArtworkHtml
                .replaceAll("%__SERIES_ID__%", seriesId)
                .replaceAll("%__ARTWORK_INDEX__%", index + 1)
                .replaceAll("%__ARTWORK_COUNT__%", artworks.length)
                .replaceAll("%__ARTWORK_LEFT_ID__%", artworkLeftId)
                .replaceAll("%__ARTWORK_RIGHT_ID__%", artworkRightId)
                .replaceAll("%__ARTWORK_LEFT_CLASS__%", artworkLeftId ? "" : "disabled")
                .replaceAll("%__ARTWORK_RIGHT_CLASS__%", artworkRightId ? "" : "disabled");
        }

        return {
            id: artworkId,
            html: updatedArtworkHtml,
            styles: ["artwork"]
        };
    });
}

module.exports = generateArtworkSites;