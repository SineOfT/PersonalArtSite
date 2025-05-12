const fs = require("fs");
const path = require("path");

const generateTemplate = require("./template/generator");
const generateHome = require("./home/generator");
const generateSectionSites = require("./section/generator");
const generateSeriesSites = require("./series/generator");
const generateArtworkSites = require("./artwork/generator");
const generateError = require("./error/generator");

const sectionOrderData   = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/section-order.json")));
const sectionsData       = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/sections.json")));
const seriesData         = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/series.json")));
const artworksData       = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/artworks.json")));
const scrollBehaviorData = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/scroll-behavior.json")));

function clearGeneratedDirectory() {
    const dirPathname = path.join(__dirname, "public");
    fs.rmSync(dirPathname, { recursive: true, force: true });
}

function copyDirectory(pathname) {
    const sourcePathname = path.join(__dirname, pathname);
    const destPathname   = path.join(__dirname, "public", pathname);
    fs.cpSync(sourcePathname, destPathname, { recursive: true });
}

function writeGeneratedHtml(html, pathname, filename) {
    const dirPathname = path.join(__dirname, "public", pathname);
    fs.mkdirSync(dirPathname, { recursive: true });
    fs.writeFile(
        path.join(dirPathname, filename),
        generateTemplate(html),
        (err) => { if (err) { throw err; } }
    );
}

function writeGeneratedHtmlDirectory(html, pathname) {
    writeGeneratedHtml(html, pathname, "index.html");
}

function writeGeneratedHtmlList(htmlList, pathname) {
    htmlList.forEach(({ id, html }) => {
        writeGeneratedHtmlDirectory(html, path.join(pathname, id));
    });
}


clearGeneratedDirectory();

copyDirectory("/assets");
copyDirectory("/styles");
copyDirectory("/scripts");

writeGeneratedHtmlDirectory(generateHome(sectionOrderData, sectionsData, artworksData, scrollBehaviorData), "");
writeGeneratedHtmlList(generateSectionSites(sectionsData, seriesData, artworksData), "/section");
writeGeneratedHtmlList(generateSeriesSites(sectionsData, seriesData, artworksData), "/series");
writeGeneratedHtmlList(generateArtworkSites(seriesData, artworksData), "/artwork");
writeGeneratedHtml(generateError(), "", "404.html");