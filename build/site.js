import getFiles from "./lib/get-files.js";
import getHtml from "./lib/get-html.js";
import kvPut from "./lib/kv-put.js";

const files = await getFiles("**/*.md");
const mdFiles = await getHtml(files);

const data = Object.fromEntries(
  mdFiles.map(({ meta, html }) => {
    if (!meta.description && /\/hikes\/.*/.test(meta.url)) {
      meta.description = `Route and pictures from hiking the ${meta.title} near ${meta.location}.`;
    }
    return [meta.url, { ...meta, html }];
  })
);

const json = JSON.stringify(data, null, 2);
//console.log(json);
await kvPut("site.json", { body: json });
