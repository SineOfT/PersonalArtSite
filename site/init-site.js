document.addEventListener("DOMContentLoaded", () => {

    const siteHeader = document.getElementById("header");
    const siteHeaderToggleButton = siteHeader.querySelector(".toggle-button");

    siteHeaderToggleButton.addEventListener("click", () => {
        siteHeader.classList.toggle("open");
    });

}, { once: true });