import { getSearchParams, filterArtworksData } from "/scripts/artworks-search.js";
import { toURLCase } from "/scripts/util.js";

export default function initArtworksList(artworksData) {
    updateArtworksList(artworksData, getSearchParams());
}

export function updateArtworksList(artworksData, searchParams) {
    const listArtworks = document.getElementsByClassName("list-artwork");
    const listArtworkLinks = document.getElementsByClassName("list-artwork-link");

    const filteredArtworkIds = filterArtworksData(artworksData, searchParams);

    for (const listArtwork of listArtworks) {
        if (filteredArtworkIds.includes(listArtwork.id)) {
            listArtwork.classList.remove("d-none");
        } else {
            listArtwork.classList.add("d-none");
        }
    }

    for (const listArtworkLink of listArtworkLinks) {
        listArtworkLink.addEventListener("click", (event) => {
            event.preventDefault();
            let url = new URL(listArtworkLink.href, window.location.origin);

            for (const [name, value] of Object.entries(searchParams)) {
                if (Array.isArray(value)) {
                    value.forEach(v => url.searchParams.append(toURLCase(name), v));
                } else if (value) {
                    url.searchParams.append(toURLCase(name), value);
                }
            }

            window.location.href = url.toString();
        });
    }
}