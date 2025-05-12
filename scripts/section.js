export default function initSections() {
    const sectionSeriesElements = document.getElementsByClassName("section-series-container");

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
}