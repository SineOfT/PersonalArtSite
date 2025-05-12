const fs = require("fs");
const path = require("path");

const templateHtml = fs.readFileSync(path.join(__dirname, "/template.html"));

function generateTemplate(html) {
    return templateHtml.toString()
        .replaceAll("%__SITE__%", html);
}

module.exports = generateTemplate;