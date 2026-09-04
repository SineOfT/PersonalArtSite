const header = document.getElementById("header");
const headerContainer = header.querySelector(".header-container");
const headerContent = header.querySelector(".header-content");

headerContainer.addEventListener("mouseenter", () => {
    header.classList.add("hover");
});

header.addEventListener("mouseleave", () => {
    header.classList.remove("hover");
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