import { getSearchParams, filterArtworksData } from "/scripts/artworks-search.js";

const ZOOM_VALUES = [1, 2, 3, 4, 5, 7.5, 10, 15, 20, 30, 40, 50];
const MAX_ZOOM_INDEX = ZOOM_VALUES.length-1;

export default function initArtwork(artworkId, artworksData) {
    const artworkElement = document.getElementById("artwork");

    const artworkCloseButton               = artworkElement.querySelector(".close-button");
    const artworkImageHover                = artworkElement.querySelector(".artwork-image-hover");
    const artworkControlZoomInElement      = artworkElement.querySelector(".control-zoom-in");
    const artworkControlZoomOutElement     = artworkElement.querySelector(".control-zoom-out");
    const artworkControlZoomDisplayElement = artworkElement.querySelector(".control-zoom-display");
    const artworkControlLeftElement        = artworkElement.querySelector(".control-artwork-left");
    const artworkControlRightElement       = artworkElement.querySelector(".control-artwork-right");
    const seriesArtworkIndexContainer      = artworkElement.querySelector(".series-artwork-index-container");
    const seriesArtworkIndex               = artworkElement.querySelector(".series-artwork-index");
    const seriesArtworkCount               = artworkElement.querySelector(".series-artwork-count");

    const searchParams = new URLSearchParams(window.location.search);
    const returnUrl = searchParams.get("return-url");
    const isReversed = searchParams.get("reversed") !== null;

    const filteredArtworkIds = filterArtworksData(artworksData, getSearchParams());
    if (isReversed) filteredArtworkIds.reverse();

    const index = filteredArtworkIds.indexOf(artworkId);

    seriesArtworkIndexContainer.classList.remove("d-none");
    seriesArtworkIndex.textContent = index+1;
    seriesArtworkCount.textContent = filteredArtworkIds.length;

    const seriesArtworkLeftId = filteredArtworkIds[index-1];
    if (seriesArtworkLeftId) {
        artworkControlLeftElement.href = `/artworks/${seriesArtworkLeftId}/${window.location.search}`;
        artworkControlLeftElement.classList.remove("disabled");
    } else {
        artworkControlLeftElement.classList.add("disabled");
    }

    const seriesArtworkRightId = filteredArtworkIds[index+1];
    if (seriesArtworkRightId) {
        artworkControlRightElement.href = `/artworks/${seriesArtworkRightId}/${window.location.search}`;
        artworkControlRightElement.classList.remove("disabled");
    } else {
        artworkControlRightElement.classList.add("disabled");
    }

    artworkCloseButton.addEventListener("click", (event) => {
        event.preventDefault();
        let url;
        if (returnUrl == null) {
            url = new URL(event.target.href, window.location.origin);
            url.hash = artworkId;
            for (const [name, value] of new URLSearchParams(window.location.search)) {
                url.searchParams.append(name, value);
            }
        } else {
            url = new URL(returnUrl, window.location.origin);
            url.hash = artworkId;
        }
        window.location.href = url.toString();
    });

    let zoomIndex = 0;
    const updateZoom = () => {
        const zoom = ZOOM_VALUES[zoomIndex];
        artworkControlZoomDisplayElement.textContent = `${Math.round(zoom * 100)}%`;
        artworkElement.style.setProperty("--zoom", zoom);
    }

    if (zoomIndex < MAX_ZOOM_INDEX) {
        artworkControlZoomInElement.classList.remove("disabled");
    }
    artworkControlZoomInElement.addEventListener("click", () => {
        zoomIndex++;
        if (zoomIndex >= MAX_ZOOM_INDEX) {
            zoomIndex = MAX_ZOOM_INDEX;
            artworkControlZoomInElement.classList.add("disabled");
        }
        artworkControlZoomOutElement.classList.remove("disabled");
        updateZoom();
    });

    if (zoomIndex > 0) {
        artworkControlZoomOutElement.classList.remove("disabled");
    }
    artworkControlZoomOutElement.addEventListener("click", () => {
        zoomIndex--;
        if (zoomIndex <= 0) {
            zoomIndex = 0;
            artworkControlZoomOutElement.classList.add("disabled");
        }
        artworkControlZoomInElement.classList.remove("disabled");
        updateZoom();
    });
    updateZoom();

    artworkImageHover.addEventListener("mousemove", (event) => {
        artworkElement.style.setProperty("--hover-x", event.offsetX / artworkImageHover.offsetWidth);
        artworkElement.style.setProperty("--hover-y", event.offsetY / artworkImageHover.offsetHeight);
    });
}