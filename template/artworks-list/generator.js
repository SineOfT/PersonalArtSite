const fs = require("fs");
const path = require("path");
const { getDate } = require("../utility");
const generateArtworkThumbnail = require("../artwork-thumbnail/generator");

const artworksListHtml = fs.readFileSync(path.join(__dirname, "/artworks-list.html"));
const listArtworkHtml = fs.readFileSync(path.join(__dirname, "/list-artwork.html"));
const artworkParentHtml = fs.readFileSync(path.join(__dirname, "/artwork-parent.html"));

function generateArtworksList(seriesData, artworksData, searchParams, isInSeries) {
    let artworkStyles = [];
    const sortedArtworksData = [...artworksData.entries()];
    if (isInSeries) sortedArtworksData.reverse();
    const updatedListArtworksHtml = sortedArtworksData
        .map(([artworkId, artwork]) => {
            const { html: artworkThumbnail, styles: thisArtworkStyles } =
                generateArtworkThumbnail(artworkId, artwork);
            if (artworkStyles.length === 0) { artworkStyles = thisArtworkStyles; }

            let updatedArtworkParent = "";
            if (!isInSeries) {
                const seriesId = artwork.series[0];
                const seriesTitle = seriesData.get(seriesId)?.["title"];
                updatedArtworkParent = artworkParentHtml.toString()
                    .replaceAll("%__PARENT_PATH__%", `/series/${seriesId}/`)
                    .replaceAll("%__PARENT_TITLE__%", seriesTitle);

            } else if (isInSeries && artwork["parent-artwork"] != null) {
                const parentId = artwork["parent-artwork"];
                const parentTitle = artworksData.get(parentId)?.["title"];
                updatedArtworkParent= artworkParentHtml.toString()
                    .replaceAll("%__PARENT_PATH__%", `/artworks/${parentId}/${searchParams ?? ""}`)
                    .replaceAll("%__PARENT_TITLE__%", parentTitle);
            }

            return listArtworkHtml.toString()
                .replaceAll("%__ARTWORK_THUMBNAIL__%", artworkThumbnail)
                .replaceAll("%__ARTWORK_ID__%", artworkId)
                .replaceAll("%__ARTWORK_TITLE__%", artwork["title"])
                .replaceAll("%__ARTWORK_PARENT__%", updatedArtworkParent)
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