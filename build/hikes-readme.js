import { writeFile } from "fs/promises";
import getFiles from "./lib/get-files.js";
import getMeta from "./lib/get-meta.js";
import buildTable from "./lib/build-table.js";
import groupBy from "./lib/group-by.js";
import { pipe, sortBy, prop } from "ramda";

const files = await getFiles("hikes/**/*.md");
const meta = await getMeta(files);
const onlyHikes = (arr) => arr.filter((x) => x.latitude && x.longitude);

const mapData = (arr) =>
  arr.map(
    ({
      title,
      url,
      location,
      type,
      difficulty,
      distance,
      elevationGain,
      fee,
      dogs,
    }) => {
      return {
        Name: `[${title}](${url}.md)`,
        Location: location,
        Type: type,
        Difficulty: difficulty?.toUpperCase(),
        Distance: distance,
        "Elevation Gain": elevationGain,
        Fee: fee ? "Yes" : "No",
        Dogs: dogs ? "Yes" : "No",
      };
    }
  );

const buildMarkdownTables = (sections) =>
  Object.keys(sections)
    .map((section) => `### ${section}\n\n${buildTable(sections[section])}`)
    .join("\n\n");

const tables = pipe(
  onlyHikes,
  mapData,
  sortBy(prop("Name")),
  groupBy("Location"),
  buildMarkdownTables
)(meta);

const md = `---
title: Hiking
url: /hikes
---

<wb-map url="/hikes/hikes.geojson"></wb-map>

${tables}

`;

await writeFile("./hikes/readme.md", md);
