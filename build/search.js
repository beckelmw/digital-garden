import { writeFile } from "fs/promises";
import getFiles from "./lib/get-files.js";
import getMarkdown from "./lib/get-markdown.js";

const files = await getFiles("**/*.md");
const mdFiles = await getMarkdown(files);

const json = mdFiles.map(({ markdown, meta }) => {
  return {
    title: meta.title,
    text: markdown,
    url: meta.url,
  };
});

writeFile("./search.json", JSON.stringify(json));
