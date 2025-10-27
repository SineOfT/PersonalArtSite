import { filterArtworksData } from "/scripts/artworks-search.js";

const MIN_ZOOM = 1;
const MAX_ZOOM = 10;

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

    const filteredArtworksData = filterArtworksData(artworksData);
    const filteredArtworkIds = filteredArtworksData.map(([artworkId, _artwork]) => artworkId);

    const index = filteredArtworkIds.indexOf(artworkId);

    seriesArtworkIndexContainer.classList.remove("d-none");
    seriesArtworkIndex.textContent = index+1;
    seriesArtworkCount.textContent = filteredArtworksData.length;

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

    let zoom = 1;
    const updateZoom = () => {
        artworkControlZoomDisplayElement.textContent = `${Math.round(zoom * 100)}%`;
        artworkElement.style.setProperty("--zoom", zoom);
    }

    if (zoom < MAX_ZOOM) {
        artworkControlZoomInElement.classList.remove("disabled");
    }
    artworkControlZoomInElement.addEventListener("click", () => {
        zoom++;
        if (zoom >= MAX_ZOOM) {
            zoom = MAX_ZOOM;
            artworkControlZoomInElement.classList.add("disabled");
        }
        artworkControlZoomOutElement.classList.remove("disabled");
        updateZoom();
    });

    if (zoom > MIN_ZOOM) {
        artworkControlZoomOutElement.classList.remove("disabled");
    }
    artworkControlZoomOutElement.addEventListener("click", () => {
        zoom--;
        if (zoom <= MIN_ZOOM) {
            zoom = MIN_ZOOM;
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