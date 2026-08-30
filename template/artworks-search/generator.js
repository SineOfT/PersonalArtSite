const fs = require("fs");
const path = require("path");
const generateArtworksList = require("../artworks-list/generator");
const generateSite = require("../site/generator");

const artworksSearchHtml = fs.readFileSync(path.join(__dirname, "/artworks-search.html"));

function generateArtworksSearch(sectionsData, seriesData, artworksData) {
    const sectionCheckboxes = [...sectionsData.entries()]
        .map(([sectionId, section]) => `
            <div>
                <input type="checkbox" name="sections" id="${sectionId}-section-checkbox" value=${sectionId} />
                <label for="${sectionId}-section-checkbox">${section.title}</label>
            </div>
        `)
        .join("");
    const seriesCheckboxes = [...seriesData.entries()]
        .map(([seriesId, series]) => `
            <div>
                <input type="checkbox" name="series" id="${seriesId}-series-checkbox" value=${seriesId} />
                <label for="${seriesId}-series-checkbox">${series.title}</label>
            </div>
        `)
        .join("")

    const { html: updatedArtworksListHtml, styles: artworksStyles } =
        generateArtworksList(artworksData);

    const artworksDataArray = [...artworksData.entries()]
    const updatedArtworkSearchHtml = artworksSearchHtml.toString()
        .replaceAll("%__ARTWORKS_LIST__%", updatedArtworksListHtml)
        .replaceAll("%__ARTWORK_COUNT__%", artworksDataArray.length)
        .replaceAll("%__ARTWORK_COUNT_PLURAL__%", artworksDataArray.length === 1 ? "" : "s")
        .replaceAll("%__ARTWORKS_DATA__%", JSON.stringify(artworksDataArray))
        .replaceAll("%__SECTIONS_CHECKBOXES__%", sectionCheckboxes)
        .replaceAll("%__SERIES_CHECKBOXES__%", seriesCheckboxes);

    const { html: updatedArtworksSearchSite, styles: siteStyles } = generateSite(updatedArtworkSearchHtml, []);

    return {
        html: updatedArtworksSearchSite,
        styles: [...siteStyles, ...artworksStyles, "artworks-search"]
    };
}

module.exports = generateArtworksSearch;