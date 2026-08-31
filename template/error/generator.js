const fs = require("fs");
const path = require("path");

const generateSite = require("../site/generator");

const errorHtml = fs.readFileSync(path.join(__dirname, "/error.html"));

function generateError() {
    return generateSite(errorHtml, "", []);
}

module.exports = generateError;