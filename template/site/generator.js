const fs = require("fs");
const path = require("path");

const generateScroll = require("../scroll/generator");

const siteHtml = fs.readFileSync(path.join(__dirname, "/site.html"));

function generateSite(mainHtml, scrollData) {
    const { html: scrollHtml, styles: scrollStyles } = generateScroll(scrollData);
    const updatedSiteHtml = siteHtml.toString()
        .replaceAll("%__SITE_MAIN__%", mainHtml)
        .replaceAll("%__SITE_SCROLL__%", scrollHtml);
    
    return {
        html: updatedSiteHtml,
        styles: [...scrollStyles, "site"]
    };
}

module.exports = generateSite;