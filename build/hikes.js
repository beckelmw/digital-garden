import { writeFile, readFile } from "fs/promises";
import getFiles from "./lib/get-files.js";
import getMarkdown from "./lib/get-markdown.js";
import hikesReadme from "./lib/hikes-readme.js";
import hikesGeojson from "./lib/hikes-geojson.js";
import kvPut from "./lib/kv-put.js";

const files = await getFiles("hikes/**/*.md");
const markdown = await getMarkdown(files);
const meta = markdown.map((x) => x.meta);
const hikes = meta.filter((x) => x.latitude && x.longitude);

// Create the readme.md
const md = await hikesReadme(hikes);
await writeFile("./hikes/readme.md", md);

// Create hikes.geojson
const geojson = await hikesGeojson(hikes);
await writeFile("./hikes/hikes.geojson", JSON.stringify(geojson, null, 2));

// Create combined geojson file and upload to cloudflare kv
const geoJsonFiles = await getFiles("hikes/**/*.geojson");
const combined = Object.fromEntries(
  await Promise.all(
    geoJsonFiles.map(async (file) => {
      const content = await readFile(file, "utf-8");
      return [`/${file}`, JSON.parse(content)];
    })
  )
);
//console.log(JSON.stringify(combined, null, 2));
await kvPut("geojson.json", { body: JSON.stringify(combined) });
