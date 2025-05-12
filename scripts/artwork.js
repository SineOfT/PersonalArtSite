const MIN_ZOOM = 1;
const MAX_ZOOM = 10;

export default function initArtwork() {
    const artworkElement = document.getElementById("artwork");

    const artworkImageHover                = artworkElement.querySelector(".artwork-image-hover");
    const artworkControlZoomInElement      = artworkElement.querySelector(".control-zoom-in");
    const artworkControlZoomOutElement     = artworkElement.querySelector(".control-zoom-out");
    const artworkControlZoomDisplayElement = artworkElement.querySelector(".control-zoom-display");

    let zoom = 1;
    const updateZoom = () => {
        artworkControlZoomDisplayElement.textContent = `${Math.round(zoom * 100)}%`;
        artworkElement.style.setProperty("--zoom", zoom);
    }

    artworkControlZoomInElement.classList.remove("disabled");
    artworkControlZoomInElement.addEventListener("click", () => {
        zoom = Math.min(zoom + 1, MAX_ZOOM);
        updateZoom();
    });
    artworkControlZoomOutElement.classList.remove("disabled");
    artworkControlZoomOutElement.addEventListener("click", () => {
        zoom = Math.max(zoom - 1, MIN_ZOOM);
        updateZoom();
    });
    updateZoom();

    artworkImageHover.addEventListener("mousemove", (event) => {
        artworkElement.style.setProperty("--hover-x", event.offsetX / artworkImageHover.offsetWidth);
        artworkElement.style.setProperty("--hover-y", event.offsetY / artworkImageHover.offsetHeight);
    });
}