const headerContent = document.querySelector("#header .header-content");
const footerContent = document.querySelector("#footer .footer-content");

let prevHeaderContentHeight = NaN;
const updateHeaderHeight = () => {
    const currHeaderContentHeight = headerContent.getBoundingClientRect().height;
    if (currHeaderContentHeight !== prevHeaderContentHeight) {
        document.documentElement.style.setProperty("--site-header-height", `calc(${currHeaderContentHeight}px + 2rem)`);
        prevHeaderContentHeight = currHeaderContentHeight;
    }
}
updateHeaderHeight();

let prevFooterContentHeight = NaN;
const updateFooterHeight = () => {
    const currFooterContentHeight = footerContent.getBoundingClientRect().height;
    if (currFooterContentHeight !== prevFooterContentHeight) {
        document.documentElement.style.setProperty("--site-footer-height", `calc(${currFooterContentHeight}px + 2rem)`);
    }
}
updateFooterHeight();

const animations = localStorage.getItem("animations");
if (animations === "minimal") {
    document.documentElement.classList.add("minimal-animations");
    document.documentElement.classList.add("reduced-animations");
} else if (animations === "reduced") {
    document.documentElement.classList.add("reduced-animations");
}

document.addEventListener("DOMContentLoaded", () => requestAnimationFrame(() => {    
    const header = document.getElementById("header");
    const headerContainer = header.querySelector(".header-container");
    const headerToggleBtn = document.getElementById("header-toggle-button");
    const toggleAnimationsBtn = header.querySelector(".toggle-animations-btn");

    headerContainer.addEventListener("mouseenter", () => {
        header.classList.add("hover");
    });

    header.addEventListener("mouseleave", () => {
        header.classList.remove("hover");
    });

    headerToggleBtn.addEventListener("input", () => {
        if (!headerToggleBtn.checked) {
            headerToggleBtn.blur();
            header.classList.remove("hover");
        }
    });

    const headerContentResizeObserver = new ResizeObserver(updateHeaderHeight);
    headerContentResizeObserver.observe(headerContent);

    const footerContentResizeObserver = new ResizeObserver(updateFooterHeight);
    footerContentResizeObserver.observe(footerContent);

    toggleAnimationsBtn.addEventListener("click", () => {
        const animations = localStorage.getItem("animations");
        if (animations === "minimal") {
            localStorage.removeItem("animations");
        } else if (animations === "reduced") {
            localStorage.setItem("animations", "minimal");
        } else {
            localStorage.setItem("animations", "reduced");
        }
        window.location.reload();
    });

}), { once: true });