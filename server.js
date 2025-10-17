const fs = require("fs");
const path = require("path");

const generateTemplate = require("./template/generator");
const generateHomeSite = require("./template/home/generator");
const generateSectionSites = require("./template/section/generator");
const generateSeriesSites = require("./template/series/generator");
const generateArtworkSites = require("./template/artwork/generator");
const generateSeriesSearch = require("./template/series-search/generator");
const generateArtworksSearch = require("./template/artworks-search/generator");
const generateError = require("./template/error/generator");

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
    const outPathname    = path.join(__dirname, "public", pathname);
    fs.cpSync(sourcePathname, outPathname, { recursive: true });
}

function copyTemplateFiles(extension, filename, outDirname) {
    const templateDirPathname = path.join(__dirname, "/template");
    const outDirPathname = path.join(__dirname, "public", outDirname);
    
    const templateFiles = fs.readdirSync(templateDirPathname);
    templateFiles.forEach((templateFile) => {
        const templateFilePathanme = path.join(templateDirPathname, templateFile);
        const stats = fs.statSync(templateFilePathanme);
        if (!stats.isDirectory()) { return; }

        const templateFileEntries = fs.readdirSync(templateFilePathanme);
        templateFileEntries.forEach((templateFileEntry) => {
            if (templateFileEntry === `${filename}.${extension}`) {
                fs.cpSync(
                    path.join(templateFilePathanme, templateFileEntry),
                    path.join(outDirPathname, `${templateFile}.${extension}`),
                    { recursive: true }
                );
            }
        });
    });
}

function writeGeneratedHtml({ html, styles }, pathname, filename) {
    const dirPathname = path.join(__dirname, "public", pathname);
    fs.mkdirSync(dirPathname, { recursive: true });
    fs.writeFile(
        path.join(dirPathname, filename),
        generateTemplate(html, styles),
        (err) => { if (err) { throw err; } }
    );
}

function writeGeneratedHtmlDirectory(htmlStyles, pathname) {
    writeGeneratedHtml(htmlStyles, pathname, "index.html");
}

function writeGeneratedHtmlList(htmlList, pathname) {
    htmlList.forEach(({ id, html, styles }) => {
        writeGeneratedHtmlDirectory({ html, styles }, path.join(pathname, id));
    });
}


clearGeneratedDirectory();

copyDirectory("/assets");
copyDirectory("/styles");
copyTemplateFiles("css", "style", "/styles");
copyDirectory("/scripts");
copyTemplateFiles("js", "script", "/scripts");

writeGeneratedHtmlDirectory(generateHomeSite(sectionOrderData, sectionsData, artworksData, scrollBehaviorData), "");
writeGeneratedHtmlList(generateSectionSites(sectionsData, seriesData, artworksData), "/sections");
writeGeneratedHtmlDirectory(generateSeriesSearch(seriesData, artworksData), "/series");
writeGeneratedHtmlList(generateSeriesSites(sectionsData, seriesData, artworksData), "/series");
writeGeneratedHtmlDirectory(generateArtworksSearch(artworksData), "/artworks");
writeGeneratedHtmlList(generateArtworkSites(seriesData, artworksData), "/artworks");
writeGeneratedHtml(generateError(), "", "404.html");