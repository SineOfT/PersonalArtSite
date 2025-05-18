const fs = require("fs");
const path = require("path");
const generateArtworksList = require("../artworks-list/generator");
const generateSite = require("../site/generator");
const { cmpDate } = require("../utility");

const artworksSearchHtml = fs.readFileSync(path.join(__dirname, "/artworks-search.html"));

function generateArtworksSearch(artworksData) {
    let artworksListEntries = Object.entries(artworksData);
    artworksListEntries.sort(([_aId, a], [_bId, b]) => cmpDate(a["date"], b["date"]));
    const artworksList = artworksListEntries.map(([artworkId, _]) => artworkId);
    const updatedArtworksListHtml = generateArtworksList(artworksList, "", artworksData);

    const updatedArtworkSearchHtml = artworksSearchHtml.toString()
        .replace("%__ARTWORKS_LIST__%", updatedArtworksListHtml);

    const updatedArtworksSearchSite = generateSite(updatedArtworkSearchHtml, []);

    return updatedArtworksSearchSite;
}

module.exports = generateArtworksSearch;