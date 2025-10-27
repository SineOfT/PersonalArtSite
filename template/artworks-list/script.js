import { filterArtworksData } from "/scripts/artworks-search.js";

export default function initArtworksList(artworksData) {
    const listArtworks = document.getElementsByClassName("list-artwork");
    const listArtworkLinks = document.getElementsByClassName("list-artwork-link");

    const filteredArtworksData = filterArtworksData(artworksData);
    const filteredArtworkIds = filteredArtworksData.map(([artworkId, _artwork]) => artworkId);

    for (const listArtwork of listArtworks) {
        if (!filteredArtworkIds.includes(listArtwork.id)) {
            listArtwork.classList.add("d-none");
        }
    }

    for (const listArtworkLink of listArtworkLinks) {
        listArtworkLink.addEventListener("click", (event) => {
            event.preventDefault();
            let url = new URL(listArtworkLink.href, window.location.origin);
            for (const [name, value] of new URLSearchParams(window.location.search)) {
                url.searchParams.append(name, value);
            }
            window.location.href = url.toString();
        })
    }
}