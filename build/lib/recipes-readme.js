import buildTable from "./build-table.js";
import groupBy from "./group-by.js";
import { pipe, sortBy, prop } from "ramda";

export default async (recipes) => {
  const mapData = (arr) =>
    arr.map(({ title, cuisine, url }) => {
      return {
        Name: `[${title}](${url}.md)`,
        Cuisine: cuisine,
      };
    });

  const buildMarkdownTables = (sections) =>
    Object.keys(sections)
      .map((section) => `### ${section}\n\n${buildTable(sections[section])}`)
      .join("\n\n");

  const tables = pipe(
    mapData,
    sortBy(prop("Name")),
    groupBy("Cuisine"),
    buildMarkdownTables
  )(recipes);

  const md = `---
title: Recipes
url: /recipes
---

${tables}

`;

  return md;
};
