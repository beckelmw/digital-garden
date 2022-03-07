import buildTable from "./build-table.js";
import groupBy from "./group-by.js";
import { pipe, sortBy, prop } from "ramda";

export default async (hikes) => {
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
    mapData,
    sortBy(prop("Name")),
    groupBy("Location"),
    buildMarkdownTables
  )(hikes);

  const md = `---
title: Hiking
url: /hikes
---

<wb-map url="/hikes/hikes.geojson"></wb-map>

${tables}

`;

  return md;
};
