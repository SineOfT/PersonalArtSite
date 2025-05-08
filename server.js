const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const handleAssets = require("./server/assets");
const handleStyles = require("./server/styles");
const handleScripts = require("./server/scripts");
const getSiteHtml = require("./site/site");
const getHomeHtml = require("./home/home");
const getSectionHtml = require("./section/section");
const getSeriesHtml = require("./series/series");
const getScrollHtml = require("./scroll/scroll");

const pagesData          = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/pages.json")));
const sectionOrderData   = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/section-order.json")));
const sectionsData       = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/sections.json")));
const seriesData         = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/series.json")));
const artworksData       = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/artworks.json")));
const scrollBehaviorData = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/scroll-behavior.json")));


const server = http.createServer(async (req, res) => {

    const { pathname } = url.parse(req.url);
    console.log(pathname);

    if (pathname.startsWith("/assets")) {
        await handleAssets(req, res, path.join(__dirname, pathname));
        return;
    }
    
    if (pathname.startsWith("/styles")) {
        await handleStyles(req, res, path.join(__dirname, pathname));
        return;
    }

    if (pathname.startsWith("/scripts")) {
        await handleScripts(req, res, path.join(__dirname, pathname));
        return;
    }

    res.setHeader("Content-Type", "text/html");

    let html;
    let scrollData = [];


    const pathnameMatch = pagesData.reduce(
        (acc, page) => {
            if (acc) { return acc; }
            const match = pathname.match(new RegExp(page.regex));
            console.log(match);
            if (match) { return match; }
            return false;
        }, 
        false
    );

    console.log(pathnameMatch);

    if (pathname === "/") {
        ({ html, scrollData } = getHomeHtml(sectionOrderData, sectionsData, artworksData, scrollBehaviorData));
        res.statusCode = 200;

    } else if (pathname.startsWith("/section")) {
        const sectionId = pathname.slice(9);
        ({ html, scrollData } = getSectionHtml(sectionId, sectionsData, seriesData, artworksData));
        res.statusCode = 200;

    } else if (pathname.startsWith("/series")) {
        const seriesId = pathname.slice(8);
        ({ html, scrollData } = getSeriesHtml(seriesId, sectionsData, seriesData, artworksData));
        console.log(scrollData);
        res.statusCode = 200;

    } else {
        html = "<h1>Error</h1>";
        res.statusCode = 404;
    }

    // console.log(scrollData);

    const scrollHtml = getScrollHtml(scrollData);
    
    const siteHtml = getSiteHtml(html, scrollHtml);
    res.end(siteHtml);
});

server.listen(3000, "localhost", () => {
    console.log("Server started");
});