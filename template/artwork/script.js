import { getSearchParams, filterArtworksData } from "/scripts/artworks-search.js";

const ZOOM_VALUES = [1, 2, 3, 4, 5, 7.5, 10, 15, 20, 30, 40, 50];
const MAX_ZOOM_INDEX = ZOOM_VALUES.length-1;

export default function initArtwork(artworkId, artworksData) {
    const artworkElement = document.getElementById("artwork");

    const artworkCloseButton               = artworkElement.querySelector(".close-button");
    const artworkMediaInteract             = artworkElement.querySelector(".artwork-media-interact");
    const artworkMedia                     = artworkElement.querySelector(".artwork-media");
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

    let isHoverActive = true;
    artworkElement.style.setProperty("--is-not-interacting", "100%");

    artworkMediaInteract.addEventListener("mousemove", (event) => {
        if (isHoverActive) {
            artworkElement.style.setProperty("--hover-x", event.offsetX / artworkMediaInteract.offsetWidth);
            artworkElement.style.setProperty("--hover-y", event.offsetY / artworkMediaInteract.offsetHeight);
            artworkElement.style.removeProperty("--is-not-interacting");
        }
    });

    artworkMediaInteract.addEventListener("pointerup", (event) => {
        let hoverX = parseFloat(artworkElement.style.getPropertyValue("--hover-x"));
        let hoverY = parseFloat(artworkElement.style.getPropertyValue("--hover-y"));
        if (isNaN(hoverX) || isNaN(hoverY)) {
            hoverX = 0.5;
            hoverY = 0.5
        }
        const zoom = ZOOM_VALUES[zoomIndex];
        const zoomFactor = zoom === 1 ? 0 : zoom / (zoom - 1);

        const x = (event.offsetX - artworkMediaInteract.offsetWidth /2) / artworkMedia.offsetWidth;
        const y = (event.offsetY - artworkMediaInteract.offsetHeight/2) / artworkMedia.offsetHeight;

        const newHoverX = Math.min(Math.max(hoverX + x * zoomFactor, 0), 1);
        const newHoverY = Math.min(Math.max(hoverY + y * zoomFactor, 0), 1);

        artworkElement.style.setProperty("--hover-x", newHoverX);
        artworkElement.style.setProperty("--hover-y", newHoverY);
        artworkElement.style.removeProperty("--is-not-interacting");

        isHoverActive = false;
    });

    artworkMediaInteract.addEventListener("mouseleave", () => {
        if (isHoverActive) {
            artworkElement.style.removeProperty("--hover-x");
            artworkElement.style.removeProperty("--hover-y");
            artworkElement.style.setProperty("--is-not-interacting", "100%");
        }
    });

    artworkElement.addEventListener("pointerup", (event) => {
        if (event.target === event.currentTarget) {
            artworkElement.style.removeProperty("--hover-x");
            artworkElement.style.removeProperty("--hover-y");
            artworkElement.style.setProperty("--is-not-interacting", "100%");
            isHoverActive = true;
        }
    });
}