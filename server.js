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
const generateSiteMap = require("./template/sitemap/generator");
const { cmpDate, cmpDateSpan } = require("./template/utility");

const sectionOrderData   = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/section-order.json")));
const scrollBehaviorData = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/scroll-behavior.json")));

let sectionsDataArray = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/sections.json")));

let seriesDataArray = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/series.json")));
seriesDataArray.sort(([_aId, a], [_bId, b]) => -cmpDateSpan(a["date-span"], b["date-span"]));

let artworksDataArray = JSON.parse(fs.readFileSync(path.join(__dirname, "/data/artworks.json")));
artworksDataArray.sort(([_aId, a], [_bId, b]) => -cmpDate(a["date"], b["date"]));

sectionsDataArray.forEach(([_sectionId, section]) => {
    let seriesWithKeys = section.series.map(seriesId =>
        [seriesId, seriesDataArray.findIndex(([sId, _s]) => sId === seriesId)]);
    seriesWithKeys.sort(([_aId, aKey], [_bId, bKey]) => aKey - bKey);
    section.series = seriesWithKeys.map(([seriesId, _key]) => seriesId);
});

seriesDataArray.forEach(([seriesId, series]) => {
    let artworksWithKeys = series.artworks.map(artworkId =>
        [artworkId, artworksDataArray.findIndex(([aId, _a]) => aId === artworkId)]);
    artworksWithKeys.sort(([_aId, aKey], [_bId, bKey]) => aKey - bKey);
    series.artworks = artworksWithKeys.map(([artworkId, _key]) => artworkId);
    series.section = sectionsDataArray
        .find(([_sectionId, section]) => section.series.includes(seriesId))
        [0]; // id
});

artworksDataArray.forEach(([artworkId, artwork]) => {
    let artworkSeries = seriesDataArray
        .filter(([_seriesId, series]) => series.artworks.includes(artworkId));
    artwork.series = artworkSeries.map(([seriesId, _series]) => seriesId);
    artwork.section = artworkSeries?.[0]?.[1].section; // section id of first series, since should be all same section
});

const sectionsData = new Map(sectionsDataArray);
const seriesData = new Map(seriesDataArray);
const artworksData = new Map(artworksDataArray);

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

function writeGeneratedHtml({ html, styles, title }, pathname, filename) {
    const dirPathname = path.join(__dirname, "public", pathname);
    fs.mkdirSync(dirPathname, { recursive: true });
    fs.writeFile(
        path.join(dirPathname, filename),
        generateTemplate(html, styles, title),
        (err) => { if (err) { throw err; } }
    );
    const link = path.join("/", pathname, (filename === "index.html") ? "" : filename);
    return { link, title };
}

function writeGeneratedHtmlDirectory(htmlStyles, pathname) {
    return writeGeneratedHtml(htmlStyles, pathname, "index.html");
}

function writeGeneratedHtmlList(htmlList, pathname) {
    return htmlList.map(({ id, html, styles, title }) => (
        writeGeneratedHtmlDirectory({ html, styles, title }, path.join(pathname, id))
    ));
}


clearGeneratedDirectory();

copyDirectory("/assets");
copyDirectory("/styles");
copyTemplateFiles("css", "style", "/styles");
copyDirectory("/scripts");
copyTemplateFiles("js", "script", "/scripts");

const siteLinks = [
    {
        title: "Main",
        links: [
            writeGeneratedHtmlDirectory(generateHomeSite(sectionOrderData, sectionsData, artworksData, scrollBehaviorData), ""),
            { link: "/#page-bottom", title: "Info" },
            writeGeneratedHtml(generateError(), "", "404.html"),
        ],
    },
    {
        title: "Sections",
        links: writeGeneratedHtmlList(generateSectionSites(sectionsData, seriesData, artworksData), "/sections"),
    },
    {
        title: "Series",
        links: [
            writeGeneratedHtmlDirectory(generateSeriesSearch(sectionsData, seriesData, artworksData), "/series"),
            ...writeGeneratedHtmlList(generateSeriesSites(sectionsData, seriesData, artworksData), "/series"),
        ],
    },
    {
        title: "Artworks",
        links: [
            writeGeneratedHtmlDirectory(generateArtworksSearch(sectionsData, seriesData, artworksData), "/artworks"),
            ...writeGeneratedHtmlList(generateArtworkSites(artworksData), "/artworks"),
        ],
    },
];
writeGeneratedHtmlDirectory(...generateSiteMap(siteLinks, "/sitemap"));