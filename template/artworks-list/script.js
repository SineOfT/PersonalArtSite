import { getArtworkSearchParams, filterArtworksData } from "/scripts/artworks-search.js";
import { toURLCase } from "/scripts/util.js";

let searchParamsData = getArtworkSearchParams();

export default function initArtworksList(artworksData) {
    const artworkCount = updateArtworksList(artworksData, searchParamsData);
    
    const artworkCountDisplay = document.querySelectorAll(".artwork-count");
    for (const display of artworkCountDisplay) {
        display.textContent = artworkCount;
    }
    const artworkCountPluralDisplay = document.querySelectorAll(".artwork-count-plural");
    if (artworkCount === 1) {
        for (const display of artworkCountPluralDisplay) { display.textContent = ""; }
    } else {
        for (const display of artworkCountPluralDisplay) { display.textContent = "s"; }
    }

    document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(() => {
        const listArtworkLinks = document.getElementsByClassName("list-artwork-link");
        for (const listArtworkLink of listArtworkLinks) {
            listArtworkLink.addEventListener("click", (e) => {
                e.preventDefault();
                let url = new URL(listArtworkLink.href, window.location.origin);
                for (const [name, value] of Object.entries(searchParamsData)) {
                    if (Array.isArray(value)) {
                        value.forEach(v => url.searchParams.append(toURLCase(name), v));
                    } else if (value) {
                        url.searchParams.append(toURLCase(name), value);
                    }
                }

                window.location.href = url.toString();
            });
        }

    }), { once: true });
}

export function updateArtworksList(artworksData, searchParams) {
    searchParamsData = searchParams;

    const listArtworks = document.getElementsByClassName("list-artwork");

    const filteredArtworkIds = filterArtworksData(artworksData, searchParamsData);

    for (const listArtwork of listArtworks) {
        if (filteredArtworkIds.includes(listArtwork.id)) {
            listArtwork.classList.remove("d-none");
        } else {
            listArtwork.classList.add("d-none");
        }
    }

    return filteredArtworkIds.length;
}