const fs = require("fs");
const path = require("path");
const { getDate } = require("../utility");
const generateArtworkThumbnail = require("../artwork-thumbnail/generator");

const artworksListHtml = fs.readFileSync(path.join(__dirname, "/artworks-list.html"));
const listArtworkHtml = fs.readFileSync(path.join(__dirname, "/list-artwork.html"));
const artworkParentHtml = fs.readFileSync(path.join(__dirname, "/artwork-parent.html"));

function generateArtworksList(seriesData, artworksData, searchParams, isInSeriesData) {
    let artworkStyles = [];
    const sortedArtworksData = [...artworksData.entries()];
    if (isInSeriesData?.["ordered"]) sortedArtworksData.reverse();
    const updatedListArtworksHtml = sortedArtworksData
        .map(([artworkId, artwork]) => {
            const { html: artworkThumbnail, styles: thisArtworkStyles } =
                generateArtworkThumbnail(artworkId, artwork);
            if (artworkStyles.length === 0) { artworkStyles = thisArtworkStyles; }

            let updatedArtworkParent = "";
            if (isInSeriesData == null) {
                updatedArtworkParent = artworkParentHtml.toString()
                    .replaceAll("%__PARENT_PATH__%", `/series/${artwork.series[0]}/`)
                    .replaceAll("%__PARENT_TITLE__%", artwork["series-title"]);
            } else if (artwork["parent-artwork"] != null) {
                updatedArtworkParent = artworkParentHtml.toString()
                    .replaceAll("%__PARENT_PATH__%", `/artworks/${artwork["parent-artwork"]}/${searchParams ?? ""}`)
                    .replaceAll("%__PARENT_TITLE__%", artwork["parent-title"]);
            }

            const artworkMedium = artwork["medium"] || artwork["section-title"];
            const artworkDimensions = artwork["dimensions"] ? ` &mdash; ${artwork["dimensions"]}` : "";

            return listArtworkHtml.toString()
                .replaceAll("%__ARTWORK_THUMBNAIL__%", artworkThumbnail)
                .replaceAll("%__ARTWORK_ID__%", artworkId)
                .replaceAll("%__ARTWORK_TITLE__%", artwork["title"])
                .replaceAll("%__ARTWORK_PARENT__%", updatedArtworkParent)
                .replaceAll("%__ARTWORK_MEDIUM__%", artworkMedium)
                .replaceAll("%__ARTWORK_DIMENSIONS__%", artworkDimensions)
                .replaceAll("%__ARTWORK_DATE__%", getDate(artwork["date"]))
                .replaceAll("%__ARTWORK_DESCRIPTION__%", artwork["description"])
                .replaceAll("%__SECTION_ID__%", artwork["section"])
                .replaceAll("%__SEARCH_PARAMS__%", searchParams ?? "");
        })
        .join("\n");
    
    const updatedArtworksList = artworksListHtml.toString()
        .replaceAll("%__ARTWORKS_DATA__%", JSON.stringify([...artworksData.entries()]).replaceAll("'", "\\'"))
        .replaceAll("%__ARTWORKS_LIST__%", updatedListArtworksHtml);
    
    return {
        html: updatedArtworksList,
        styles: [...artworkStyles, "artworks-list"]
    };
}

module.exports = generateArtworksList;