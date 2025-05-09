const fs = require("fs");
const path = require("path");

const siteHtml = fs.readFileSync(path.join(__dirname, "/site.html"));

function generateSite(mainHtml, scrollHtml) {
    const updatedSiteHtml = siteHtml.toString()
        .replaceAll("%__SITE_MAIN__%", mainHtml)
        .replaceAll("%__SITE_SCROLL__%", scrollHtml);
    return updatedSiteHtml;
}

module.exports = generateSite;