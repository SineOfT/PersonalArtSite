const fs = require("fs");
const path = require("path");

const templateHtml = fs.readFileSync(path.join(__dirname, "/template.html"));

function generateTemplate(html, styles, title) {
    const styleLinks = styles
        .map(style => `<link rel="stylesheet" href="/styles/${style}.css" />`)
        .join("\n");
    return templateHtml.toString()
        .replaceAll("%__SITE__%", html)
        .replaceAll("%__STYLES__%", styleLinks)
        .replaceAll("%__TITLE__%", (!title || title === "Home") ? "Shyuu's Art" : `${title} - Shyuu's Art`);
}

module.exports = generateTemplate;