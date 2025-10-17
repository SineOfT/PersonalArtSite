const fs = require("fs");
const path = require("path");

const templateHtml = fs.readFileSync(path.join(__dirname, "/template.html"));

function generateTemplate(html, styles) {
    const styleLinks = styles
        .map(style => `<link rel="stylesheet" href="/styles/${style}.css" />`)
        .join("\n");
    return templateHtml.toString()
        .replaceAll("%__SITE__%", html)
        .replaceAll("%__STYLES__%", styleLinks);
}

module.exports = generateTemplate;