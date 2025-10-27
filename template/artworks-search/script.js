export default function initArtworksSearch() {
    const searchForm = document.getElementById("search-form");
    const searchInput = searchForm.querySelector(".search-input");
    const includeSketchesCheck = searchForm.querySelector(".include-sketches-check");
    const sectionCheckboxes = searchForm.querySelector(".section-checkboxes");
    const seriesCheckboxes = searchForm.querySelector(".series-checkboxes");

    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("search")?.trim();
    const sections = searchParams.getAll("sections");
    const series = searchParams.getAll("series");
    const includeSketches = searchParams.get("include-sketches");
    
    if (search) searchInput.value = search;
    if (includeSketches) includeSketchesCheck.setAttribute("checked", true);
    sections?.forEach(sections => sectionCheckboxes.querySelector(`[name="sections"][value="${sections}"]`).setAttribute("checked", true))
    series?.forEach(series => seriesCheckboxes.querySelector(`[name="series"][value="${series}"]`).setAttribute("checked", true))
}

export function filterArtworksData(artworksData) {
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("search")?.trim();
    const sections = searchParams.getAll("sections");
    const series = searchParams.getAll("series");
    const includeSketches = searchParams.get("include-sketches");

    let filteredArtworksData = [...artworksData];

    if (sections.length > 0) {
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => sections.includes(artwork.section));
    }

    if (series.length > 0) {
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => artwork.series.some(s => series.includes(s)));
    }

    if (search != null && search != "") {
        const searchRegex = search.split(" ").map(word => new RegExp(`.*${word}.*`, "i"));
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => {
            const artworkString = artwork.title + artwork.description + artwork.tags;
            return searchRegex.every(regex => regex.test(artworkString));
        });
    }

    if (includeSketches == null) {
        filteredArtworksData = filteredArtworksData.filter(([_artworkId, artwork]) => !artwork.sketch);
    }

    return filteredArtworksData;
}
