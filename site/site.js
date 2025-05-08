const fs = require("fs");
const path = require("path");

const indexHtml = fs.readFileSync(path.join(__dirname, "/site.html"));

function getSiteHtml(mainHtml, scrollHtml) {
    const updatedIndexHtml = indexHtml.toString()
        .replaceAll("%__SITE_MAIN__%", mainHtml)
        .replaceAll("%__SITE_SCROLL__%", scrollHtml);
    return updatedIndexHtml
}

module.exports = getSiteHtml;