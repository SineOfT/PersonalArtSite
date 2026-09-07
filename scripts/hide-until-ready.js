document.body.classList.add("v-none");

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove("v-none");
}, { once: true });