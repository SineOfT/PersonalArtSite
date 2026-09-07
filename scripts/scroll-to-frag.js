const frag = new URL(window.location.href).hash;
if (frag && window.scrollY === 0) {
    const fragElement = document.querySelector(frag);
    const fragElementRect = fragElement.getBoundingClientRect();

    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, fragElementRect.y, { behavior: "instant" });
    document.documentElement.style.scrollBehavior = "";
}