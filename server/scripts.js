const fs = require("fs");
const { getETag } = require("./utility");

async function handleScripts(req, res, pathname) {
    function getScriptPathname(pathname) {
        const [_, dirname, script] = pathname.match(/(.*)(?:\/scripts\/)(.*)(?:.js)/) ?? [];
        return `${dirname}/${script}/init-${script}.js`;
    }
    
    const scriptPathname = getScriptPathname(pathname);
    console.log(scriptPathname);
    
    try {
        const lastModified = await new Promise((resolve, reject) => {
            fs.stat(scriptPathname, (err, stats) => {
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
            fs.readFile(scriptPathname, (err, data) => {
                if (err) { reject(err); return; }

                res.writeHead(200, {
                    "Content-Type": "text/javascript",
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

module.exports = handleScripts;