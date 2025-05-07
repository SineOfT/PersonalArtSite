const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const handleAssets = require("./server/assets");
const handleStyles = require("./server/styles");
const handleScripts = require("./server/scripts");
const getHomeHtml = require("./home/home");
const getSectionHtml = require("./section/section");
const getSeriesHtml = require("./series/series");

const indexHtml = fs.readFileSync(path.join(__dirname, "index.html"));
const styleCss = fs.readFileSync(path.join(__dirname, "style.css"));

const sectionOrderData   = JSON.parse(fs.readFileSync(path.join(__dirname, "data/section-order.json")));
const sectionsData       = JSON.parse(fs.readFileSync(path.join(__dirname, "data/sections.json")));
const seriesData         = JSON.parse(fs.readFileSync(path.join(__dirname, "data/series.json")));
const artworksData       = JSON.parse(fs.readFileSync(path.join(__dirname, "data/artworks.json")));
const scrollBehaviorData = JSON.parse(fs.readFileSync(path.join(__dirname, "data/scroll-behavior.json")));


const server = http.createServer(async (req, res) => {

    const { pathname } = url.parse(req.url);
    console.log(pathname);

    if (pathname === "/style.css") {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(styleCss);
        return;
    }

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

    if (pathname === "/") {
        const homeHtml = getHomeHtml(sectionOrderData, sectionsData, artworksData, scrollBehaviorData);
        let updatedIndexHtml = indexHtml.toString().replaceAll("%__SITE_MAIN__%", homeHtml);
        res.statusCode = 200;
        res.end(updatedIndexHtml);
        return;
    }

    if (pathname.startsWith("/section")) {
        const sectionId = pathname.slice(9);
        const sectionHtml = getSectionHtml(sectionId, sectionsData, seriesData, artworksData);
        const updatedIndexHtml = indexHtml.toString().replaceAll("%__SITE_MAIN__%", sectionHtml);
        res.statusCode = 200;
        res.end(updatedIndexHtml);
        return;
    }

    if (pathname.startsWith("/series")) {
        const seriesId = pathname.slice(8);
        const seriesHtml = getSeriesHtml(seriesId, sectionsData, seriesData, artworksData);
        const updatedIndexHtml = indexHtml.toString().replaceAll("%__SITE_MAIN__%", seriesHtml);
        res.statusCode = 200;
        res.end(updatedIndexHtml);
        return;
    }

    res.statusCode = 404;
    res.end("<h1>Error</h1>");
});

server.listen(3000, "localhost", () => {
    console.log("Server started");
});