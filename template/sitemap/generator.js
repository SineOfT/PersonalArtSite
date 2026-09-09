const fs = require("fs");
const path = require("path");

const sitemapHtml = fs.readFileSync(path.join(__dirname, "/sitemap.html"));
const entriesListHtml = fs.readFileSync(path.join(__dirname, "/entries-list.html"));
const listEntryHtml = fs.readFileSync(path.join(__dirname, "/list-entry.html"));

const SITEMAP_TITLE = "Site Map";

function generateSiteMap(siteLinks, pathname) {
    siteLinks[0].links.push({ link: pathname, title: SITEMAP_TITLE });

    const updatedSiteLinksHtml = siteLinks.map((siteLink) => {
        const { links, title, columnSpan } = siteLink;
        const updatedListEntriesHtml = links.map(({ link, title }) => (
            listEntryHtml.toString()
                .replaceAll("%__ENTRY_LINK__%", link)
                .replaceAll("%__ENTRY_TITLE__%", title || "???")
        ))
        .join("\n");
        return entriesListHtml.toString()
            .replaceAll("%__LIST_TITLE__%", title)
            .replaceAll("%__LIST_ENTRIES__%", updatedListEntriesHtml);
    })
    .join("\n");

    const updatedSiteMapHtml = sitemapHtml.toString()
        .replaceAll("%__SITE_LINKS__%", updatedSiteLinksHtml);

    return [
        {
            html: updatedSiteMapHtml,
            styles: ["sitemap"],
            title: SITEMAP_TITLE,
        },
        pathname,
    ];
}

module.exports = generateSiteMap;