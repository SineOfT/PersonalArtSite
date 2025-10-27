const fs = require("fs");
const path = require("path");
const { getDate } = require("../utility");
const generateArtworkThumbnail = require("../artwork-thumbnail/generator");

const artworksListHtml = fs.readFileSync(path.join(__dirname, "/artworks-list.html"));
const listArtworkHtml = fs.readFileSync(path.join(__dirname, "/list-artwork.html"));

function generateArtworksList(artworksData, searchParams) {
    let artworkStyles = [];
    const updatedListArtworksHtml = [...artworksData.entries()]
        .map(([artworkId, artwork]) => {
            const { html: artworkThumbnail, styles: thisArtworkStyles } = generateArtworkThumbnail(artwork);
            if (artworkStyles.length === 0) { artworkStyles = thisArtworkStyles; }

            return listArtworkHtml.toString()
                .replaceAll("%__ARTWORK_THUMBNAIL__%", artworkThumbnail)
                .replaceAll("%__ARTWORK_ID__%", artworkId)
                .replaceAll("%__ARTWORK_TITLE__%", artwork["title"])
                .replaceAll("%__ARTWORK_DATE__%", getDate(artwork["date"]))
                .replaceAll("%__ARTWORK_DESCRIPTION__%", artwork["description"])
                .replaceAll("%__SEARCH_PARAMS__%", searchParams ?? "");
        })
        .join("\n");
    
    const updatedArtworksList = artworksListHtml.toString()
        .replaceAll("%__ARTWORKS_DATA__%", JSON.stringify([...artworksData.entries()]))
        .replaceAll("%__ARTWORKS_LIST__%", updatedListArtworksHtml);
    
    return {
        html: updatedArtworksList,
        styles: [...artworkStyles, "artworks-list"]
    };
}

module.exports = generateArtworksList;