export default function initHome() {
    const fadeHomeSections = document.querySelectorAll(".home-section-container.fade");

    for (const fadeHomeSection of fadeHomeSections) {
        fadeHomeSection.style.marginBottom = "-100vh";
    }
}