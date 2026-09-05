const header = document.getElementById("header");
const headerContainer = header.querySelector(".header-container");
const headerContent = header.querySelector(".header-content");
const toggleAnimationsBtn = header.querySelector(".toggle-animations-btn");

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


const animations = localStorage.getItem("animations");
if (animations === "minimal") {
    document.documentElement.classList.add("minimal-animations");
    document.documentElement.classList.add("medium-animations");
    toggleAnimationsBtn.textContent = "MINIMAL";
} else if (animations === "medium") {
    document.documentElement.classList.add("medium-animations");
    toggleAnimationsBtn.textContent = "MEDIUM";
} else {
    toggleAnimationsBtn.textContent = "FULL";
}

toggleAnimationsBtn.addEventListener("click", () => {
    const animations = localStorage.getItem("animations");
    if (animations === "minimal") {
        document.documentElement.classList.remove("minimal-animations");
        document.documentElement.classList.remove("medium-animations");
        localStorage.removeItem("animations");
        toggleAnimationsBtn.textContent = "FULL";
    } else if (animations === "medium") {
        document.documentElement.classList.add("minimal-animations");
        localStorage.setItem("animations", "minimal");
        toggleAnimationsBtn.textContent = "MINIMAL";
    } else {
        document.documentElement.classList.add("medium-animations");
        localStorage.setItem("animations", "medium");
        toggleAnimationsBtn.textContent = "MEDIUM";
    }
});