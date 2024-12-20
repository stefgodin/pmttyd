const ASSET_DIR = "../assets"
const itemLinks = require(`${ASSET_DIR}/data/items.json`);
const fs = require("fs");
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const path = require("path");

async function load(itemLinks) {
    const downloadFile = (async (url, fileName) => {
        const res = await fetch(url);
        const destination = path.resolve(`${ASSET_DIR}/items`, fileName);
        const fileStream = fs.createWriteStream(destination, { flags: 'w' });
        await finished(Readable.fromWeb(res.body).pipe(fileStream));
    });

    const exceptions = { "Stop Watch": "Stopwatch" };
    const digits = Math.floor(Math.log(Math.max(itemLinks.length)) / Math.LN10) + 1;


    let i = 1;
    for (let { name } of itemLinks) {

        name = exceptions[name] ?? name;
        const urlName = "File:" + name.replaceAll(/[,.']|( \(.*\))/g, "").replaceAll(/ /g, "_") + "_PMTTYDNS_icon.png";
        const url = `https://www.mariowiki.com/${urlName}`;

        console.log(`Downloading ${name} (scrapping link ${url})`);

        const regExp = /href="(https:\/\/www\.mariowiki\.com\/images\/\w+\/\w+\/[a-zA-Z0-9_.-]+_PMTTYDNS_icon\.png)"/;
        const pageData = await fetch(url).then((r) => r.text());
        const matches = pageData.match(regExp);
        if (!matches) {
            console.log("[FAILED] No matching URL scrapped from page");
        }
        else {
            fileUrl = matches[1];
            i = `${i}`.padStart(digits, '0');
            await downloadFile(fileUrl, `${i}.png`);
            console.log(`[SUCCESS] Downloaded from ${fileUrl} to ${i}.png`);
        }

        i++;
    }
}

load(itemLinks);
