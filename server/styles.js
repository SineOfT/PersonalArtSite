const fs = require("fs");
const { getETag } = require("./utility");

async function handleStyles(req, res, pathname) {
    function getStylePathname(pathname) {
        const [_, dirname, style] = pathname.match(/(.*)(?:\/styles\/)(.*)(?:.css)/) ?? [];
        return `${dirname}/${style}/${style}.css`;
    }
    
    const stylePathname = getStylePathname(pathname);
    console.log(stylePathname);
    
    try {
        const lastModified = await new Promise((resolve, reject) => {
            fs.stat(stylePathname, (err, stats) => {
                if (err) { reject(err); return; }
                resolve(stats.mtime);
            });
        });
        const eTag = getETag(lastModified);

        if (Object.hasOwn(req.headers, "if-none-match") && req.headers["if-none-match"] === eTag) {
            res.writeHead(304, {
                "Cache-Control": "no-cache",
                "ETag": eTag
            });
            res.end();
            return;
        }

        await new Promise((resolve, reject) => {
            fs.readFile(stylePathname, (err, data) => {
                if (err) { reject(err); return; }

                res.writeHead(200, {
                    "Content-Type": "text/css",
                    "Cache-Control": "no-cache",
                    "ETag": eTag
                });
                res.end(data);
                resolve();
            });
        });

    } catch (err) {
        console.error(err);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end();
    }
}

module.exports = handleStyles;