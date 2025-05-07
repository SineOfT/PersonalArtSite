const fs = require("fs");
const { getETag } = require("./utility");

async function handleAssets(req, res, pathname) {
    try {
        const lastModified = await new Promise((resolve, reject) => {
            fs.stat(pathname, (err, stats) => {
                if (err) { reject(err); return; }
                resolve(stats.mtime);
            });
        });
        const eTag = getETag(lastModified);

        if (Object.hasOwn(req.headers, "if-none-match") && req.headers["if-none-match"] === eTag) {
            res.writeHead(304, {
                "Cache-Control": "max-age=3600",
                "ETag": eTag
            });
            res.end();
            return;
        }

        await new Promise((resolve, reject) => {
            fs.readFile(pathname, (err, data) => {
                if (err) { reject(err); return; }

                const assetExt = pathname.split(".").pop();
                if (assetExt === "png") {
                    res.writeHead(200, {
                        "Content-Type": "text/png",
                        "Cache-Control": "max-age=3600",
                        "ETag": eTag
                    });
                    res.end(data);
                    resolve();
                    return;
                }
                
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end();
                reject(new Error("Unknown file extension"));
            });
        });

    } catch (err) {
        console.error(err);
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end();
    }
}

module.exports = handleAssets;