const ASSET_DIR = "../assets"
const badges = require(`${ASSET_DIR}/data/badges.json`);
const fs = require("fs");
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const path = require("path");

async function load(badges) {
    const downloadFile = (async (url, fileName) => {
        const res = await fetch(url);
        const destination = path.resolve(`${ASSET_DIR}/badges`, fileName);
        const fileStream = fs.createWriteStream(destination, { flags: 'w' });
        await finished(Readable.fromWeb(res.body).pipe(fileStream));
    });

    const exceptions = { "Charge P": "Charge P O", "HP Drain": "HP Drain badge" };
    const digits = Math.floor(Math.log(Math.max(...badges.map(({ id }) => id))) / Math.LN10) + 1;


    for (let { id, name } of badges) {
        console.log(`Downloading ${name}`);

        name = exceptions[name] ?? name;
        const urlName = "File:" + name.replace(",", "").replace(" ", "_") + "_PMTTYDNS_icon.png";
        const url = `https://www.mariowiki.com/${urlName}`;

        const regExp = /href="(https:\/\/www\.mariowiki\.com\/images\/\w+\/\w+\/[a-zA-Z_.-]+_PMTTYDNS_icon\.png)"/;
        const pageData = await fetch(url).then((r) => r.text());
        const matches = pageData.match(regExp);
        if (!matches) {
            console.log("[FAILED] No matching URL scrapped from page");
        }
        else {
            fileUrl = matches[1];
            id = `${id}`.padStart(digits, '0');
            await downloadFile(fileUrl, `${id}.png`);
            console.log(`[SUCCESS] Downloaded from ${fileUrl} to ${id}.png`);
        }
    }
}

load(badges);
