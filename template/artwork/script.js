const MIN_ZOOM = 1;
const MAX_ZOOM = 10;

export default function initArtwork(artworkId, seriesArtworksData) {
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
    const seriesId = searchParams.get("series");

    if (seriesId) {
        const seriesArtworks = seriesArtworksData[seriesId];
        if (seriesArtworks) {
            const index = seriesArtworks.indexOf(artworkId);

            seriesArtworkIndexContainer.classList.remove("d-none");
            seriesArtworkIndex.textContent = index+1;
            seriesArtworkCount.textContent = seriesArtworks.length;

            const seriesArtworkLeftId = seriesArtworks[index-1];
            if (seriesArtworkLeftId) {
                artworkControlLeftElement.href = `/artworks/${seriesArtworkLeftId}/?series=${seriesId}`;
                artworkControlLeftElement.classList.remove("disabled");
            } else {
                artworkControlLeftElement.classList.add("disabled");
            }

            const seriesArtworkRightId = seriesArtworks[index+1];
            if (seriesArtworkRightId) {
                artworkControlRightElement.href = `/artworks/${seriesArtworkRightId}/?series=${seriesId}`;
                artworkControlRightElement.classList.remove("disabled");
            } else {
                artworkControlRightElement.classList.add("disabled");
            }
        }
    }

    artworkCloseButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (seriesId) {
            window.location.href = `/series/${seriesId}#${artworkId}`
        } else {
            window.location.href = event.target.href;
        }
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