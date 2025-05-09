const MIN_ZOOM = 1;
const MAX_ZOOM = 10;

export default function initFocusArtwork(artworksData) {
    const focusArtworkModal = document.getElementById("focus-artwork-modal");
    const focusArtworkModalContainer          = focusArtworkModal.querySelector(".focus-artwork-container");
    const focusArtworkModalCloseButton        = focusArtworkModal.querySelector(".close-button");
    const focusArtworkModalControlZoomIn      = focusArtworkModal.querySelector(".control-zoom-in");
    const focusArtworkModalControlZoomOut     = focusArtworkModal.querySelector(".control-zoom-out");
    const focusArtworkModalControlZoomDisplay = focusArtworkModal.querySelector(".control-zoom-display");
    const focusArtworkModalTitle              = focusArtworkModal.querySelector(".focus-artwork-title");
    const focusArtworkModalYear               = focusArtworkModal.querySelector(".focus-artwork-year");
    const focusArtworkModalImage              = focusArtworkModal.querySelector(".focus-artwork-image");
    
    const focusArtworkButtons = document.getElementsByClassName("focus-artwork-button");

    let zoom = 1;
    const updateZoom = () => {
        focusArtworkModalControlZoomDisplay.textContent = `${Math.round(zoom * 100)}%`;
        focusArtworkModalContainer.style.setProperty("--zoom", zoom);
    } 


    focusArtworkModalCloseButton.addEventListener("click", () => {
        focusArtworkModal.close();
    });

    focusArtworkModalControlZoomIn.addEventListener("click", () => {
        zoom = Math.min(zoom + 1, MAX_ZOOM);
        updateZoom();
    });
    focusArtworkModalControlZoomOut.addEventListener("click", () => {
        zoom = Math.max(zoom - 1, MIN_ZOOM);
        updateZoom();
    });
    updateZoom();

    focusArtworkModalImage.addEventListener("mousemove", (event) => {
        focusArtworkModal.style.setProperty("--hover-x", event.offsetX / focusArtworkModalImage.offsetWidth);
        focusArtworkModal.style.setProperty("--hover-y", event.offsetY / focusArtworkModalImage.offsetHeight);
    });

    for (const focusArtworkButton of focusArtworkButtons) {
        const artworkId = focusArtworkButton.dataset.artworkId;
        const artwork = artworksData[artworkId];
        if (!artwork) { continue; }
        focusArtworkButton.addEventListener("click", () => {
            focusArtworkModalTitle.textContent = artwork["title"];
            focusArtworkModalYear.textContent = artwork["year"];
            focusArtworkModalImage.src = `/assets/artworks/${artwork["main"]}`;
            focusArtworkModal.showModal();
        });
    }
}