export default function initFragAnchors() {
    function updateFragAnchors() {
        const fragAnchorElements = document.getElementsByClassName("frag-anchor");
        const screenHeight = window.innerHeight;

        for (const fragAnchorElement of fragAnchorElements) {
            configureFragAnchorOffset(fragAnchorElement);
        }

        function configureFragAnchorOffset(element) {
            const { screenFr, anchor } = element.dataset;
            const viewportOffset = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            const paddingTop = parseFloat(style.paddingTop);
            const height = viewportOffset.height - paddingTop;
            const fragAnchorOffset = screenHeight * screenFr - height * anchor;
            if (fragAnchorOffset !== 0) {
                element.style.paddingTop = `${fragAnchorOffset}px`;
                element.style.marginTop = `-${fragAnchorOffset}px`;
                element.style.pointerEvents = "none";
                for (const child of element.children) {
                    child.style.pointerEvents = "auto";
                }
            }
        }
    }

    updateFragAnchors();
    window.addEventListener("resize", () => { updateFragAnchors(); });
}

export function scrollToFrag() {
    if (window.scrollY !== 0) { return; }
    const frag = new URL(window.location.href).hash;
    if (!frag) { return; }
    const fragElement = document.querySelector(frag);
    const fragElementRect = fragElement.getBoundingClientRect();
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, fragElementRect.y, { behavior: "instant" });
    document.documentElement.style.scrollBehavior = "smooth";
}