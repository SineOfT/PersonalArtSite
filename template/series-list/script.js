document.addEventListener("DOMContentLoaded", () => {
    if (document.documentElement.classList.contains("minimal-animations")) { return; }
    if (window.scrollY !== 0) { return; }

    const sectionSeriesElements = document.getElementsByClassName("list-series-container");

    for (const sectionSeriesElement of sectionSeriesElements) {
        sectionSeriesElement.classList.add("slide", "hide");
    }

    document.body.offsetHeight; // force redraw

    for (const sectionSeriesElement of sectionSeriesElements) {
        sectionSeriesElement.classList.add("slide-transition");
    }

    document.body.offsetHeight; // force redraw

    for (const sectionSeriesElement of sectionSeriesElements) {
        sectionSeriesElement.classList.remove("hide");
    }
}, { once: true });