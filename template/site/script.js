const header = document.getElementById("header");
const headerContainer = header.querySelector(".header-container");
const headerContent = header.querySelector(".header-content");
const headerToggleBtn = document.getElementById("header-toggle-button");

const footer = document.getElementById("footer");
const footerContent = footer.querySelector(".footer-content");

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

let prevHeaderContentHeight = NaN;
const updateHeaderHeight = () => {
    const currHeaderContentHeight = headerContent.getBoundingClientRect().height;
    if (currHeaderContentHeight !== prevHeaderContentHeight) {
        document.documentElement.style.setProperty("--site-header-height", `calc(${currHeaderContentHeight}px + 2rem)`);
        prevHeaderContentHeight = currHeaderContentHeight;
    }
}
const headerContentResizeObserver = new ResizeObserver(updateHeaderHeight);
headerContentResizeObserver.observe(headerContent);
updateHeaderHeight();

let prevFooterContentHeight = NaN;
const updateFooterHeight = () => {
    const currFooterContentHeight = footerContent.getBoundingClientRect().height;
    if (currFooterContentHeight !== prevFooterContentHeight) {
        document.documentElement.style.setProperty("--site-footer-height", `calc(${currFooterContentHeight}px + 2rem)`);
    }
}
const footerContentResizeObserver = new ResizeObserver(updateFooterHeight);
footerContentResizeObserver.observe(footerContent);
updateFooterHeight();



const animations = localStorage.getItem("animations");
if (animations === "minimal") {
    document.documentElement.classList.add("minimal-animations");
    document.documentElement.classList.add("reduced-animations");
} else if (animations === "reduced") {
    document.documentElement.classList.add("reduced-animations");
}

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