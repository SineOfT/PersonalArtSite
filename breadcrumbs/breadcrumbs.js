const fs = require("fs");
const path = require("path");

const breadcrumbsHtml = fs.readFileSync(path.join(__dirname, "/breadcrumbs.html"));
const backHtml = fs.readFileSync(path.join(__dirname, "/back.html"));

function getBreadcrumbsHtml(breadcrumbs) {
    const backsHtml = breadcrumbs
        .map((breadcrumb) => {
            return backHtml.toString()
                .replaceAll("%__BACK_HREF__%", breadcrumb["href"])
                .replaceAll("%__BACK_TITLE__%", breadcrumb["title"]);
        })
        .join("\n");
    const updatedBreadcrumbsHtml = breadcrumbsHtml.toString()
        .replaceAll("%__BREADCRUMBS_BACKS__%", backsHtml);
    return updatedBreadcrumbsHtml;
}

module.exports = getBreadcrumbsHtml;