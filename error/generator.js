const fs = require("fs");
const path = require("path");

const generateScrollSite = require("../scroll/generator");

const errorHtml = fs.readFileSync(path.join(__dirname, "/error.html"));

function generateError() {
    return generateScrollSite(errorHtml, []);
}

module.exports = generateError;