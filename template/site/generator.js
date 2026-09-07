const fs = require("fs");
const path = require("path");

const generateScroll = require("../scroll/generator");

const siteHtml = fs.readFileSync(path.join(__dirname, "/site.html"));
const siteFooterTextHtml = fs.readFileSync(path.join(__dirname, "../../data/footer-text.html"));

function generateSite(mainHtml, breadcrumbsHtml, scrollData) {
    const { html: scrollHtml, styles: scrollStyles } = generateScroll(scrollData);
    const updatedSiteHtml = siteHtml.toString()
        .replaceAll("%__BREADCRUMBS__%", breadcrumbsHtml)
        .replaceAll("%__SITE_MAIN__%", mainHtml)
        .replaceAll("%__SITE_SCROLL__%", scrollHtml)
        .replaceAll("%__SITE_FOOTER_TEXT__%", siteFooterTextHtml);
    
    return {
        html: updatedSiteHtml,
        styles: [...scrollStyles, "site"]
    };
}

module.exports = generateSite;