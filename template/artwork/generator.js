const fs = require("fs");
const path = require("path");
const { getDate } = require("../utility");

const artworkHtml = fs.readFileSync(path.join(__dirname, "/artwork.html"));
const layerHtml = fs.readFileSync(path.join(__dirname, "/layer.html"));
const layerImg = fs.readFileSync(path.join(__dirname, "/layer-img.html"));
const layerVideo = fs.readFileSync(path.join(__dirname, "/layer-video.html"));

function generateArtworkSites(artworksData) {
    return [...artworksData.entries()].map(([artworkId, artwork], artworkIndex) => {

        const layerCount = artwork["layer-count"];
        const updatedLayersHtml = Array.from(
            { length: layerCount },
            (_, index) => {
                const note = artwork["notes"]?.[index.toString()];
                const noteAttr = note ? `data-note="${note}"` : "";
                const isVideo = (artwork["animated"] && index === 0);
                const updatedLayerMediaContentHtml = isVideo
                    ? layerVideo.toString()
                        .replaceAll("%__LAYER_MEDIA__%", `${artworkId}/${index}.mp4`)
                    : layerImg.toString()
                        .replaceAll("%__LAYER_MEDIA__%", `${artworkId}/${index}.webp`);
                return layerHtml.toString()
                    .replaceAll("%__LAYER_MEDIA_CONTENT__%", updatedLayerMediaContentHtml)
                    .replaceAll("%__LAYER_MEDIA_ATTRS__%", noteAttr)
                    .replaceAll("%__LAYER_ID__%", index)
                    .replaceAll("%__LAYER_CURR__%", index + 1)
                    .replaceAll("%__LAYER_COUNT__%", layerCount)
                    .replaceAll("%__LAYER_UP__%", index - 1)
                    .replaceAll("%__LAYER_DOWN__%", index + 1)
                    .replaceAll("%__LAYER_UP_CLASS__%", index <= 0 ? "disabled" : "hidden")
                    .replaceAll("%__LAYER_DOWN_CLASS__%", index >= layerCount - 1 ? "disabled" : "hidden");
            }
        ).join("\n");

        const artworkLeftId  = [...artworksData.keys()][artworkIndex-1] ?? "";
        const artworkRightId = [...artworksData.keys()][artworkIndex+1] ?? "";
        let updatedArtworkHtml = artworkHtml.toString()
            .replaceAll("%__ARTWORKS_DATA__%", JSON.stringify([...artworksData.entries()]).replaceAll("'", "\\'"))
            .replaceAll("%__ARTWORK_ID__%", artworkId)
            .replaceAll("%__ARTWORK_TITLE__%", artwork["title"])
            .replaceAll("%__ARTWORK_DATE__%", getDate(artwork["date"]))
            .replaceAll("%__ARTWORK_LAYERS__%", updatedLayersHtml)
            .replaceAll("%__ARTWORK_LEFT_ID__%",  artworkLeftId)
            .replaceAll("%__ARTWORK_RIGHT_ID__%", artworkRightId)
            .replaceAll("%__ARTWORK_LEFT_CLASS__%",  artworkLeftId  ? "" : "disabled")
            .replaceAll("%__ARTWORK_RIGHT_CLASS__%", artworkRightId ? "" : "disabled");

        return {
            id: artworkId,
            html: updatedArtworkHtml,
            styles: ["artwork"],
            title: artwork["title"],
        };
    });
}

module.exports = generateArtworkSites;