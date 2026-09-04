export default function initSite() {
    const header = document.getElementById("header");
    const headerContainer = header.querySelector(".header-container");

    headerContainer.addEventListener("mouseenter", () => {
        header.classList.add("hover");
    });

    header.addEventListener("mouseleave", () => {
        header.classList.remove("hover");
    });
}