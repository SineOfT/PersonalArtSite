const fs = require("fs");
const path = require("path");
const { getDate } = require("../utility");

const artworksListHtml = fs.readFileSync(path.join(__dirname, "/artworks-list.html"));
const listArtworkHtml = fs.readFileSync(path.join(__dirname, "/list-artwork.html"));

function generateArtworksList(artworksList, searchParams, artworksData) {
    const updatedListArtworksHtml = artworksList
        .map((artworkId) => {
            const artwork = artworksData[artworkId];
            if (!artwork) { return ""; }
            return listArtworkHtml.toString()
                .replaceAll("%__ARTWORK_ID__%", artworkId)
                .replaceAll("%__ARTWORK_IMAGE__%", artwork["main"])
                .replaceAll("%__ARTWORK_TITLE__%", artwork["title"])
                .replaceAll("%__ARTWORK_DATE__%", getDate(artwork["date"]))
                .replaceAll("%__ARTWORK_DESCRIPTION__%", artwork["description"])
                .replaceAll("%__SEARCH_PARAMS__%", searchParams);
        })
        .join("\n");
    
    const updatedArtworksList = artworksListHtml.toString()
        .replaceAll("%__ARTWORKS_LIST__%", updatedListArtworksHtml);
    
    return updatedArtworksList;
}

module.exports = generateArtworksList;