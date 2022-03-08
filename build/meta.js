import { writeFile } from "fs/promises";
import getFiles from "./lib/get-files.js";
import getMarkdown from "./lib/get-markdown.js";

const files = await getFiles("**/*.md");
const mdFiles = await getMarkdown(files);

const meta = Object.fromEntries(
  mdFiles.map(({ meta }) => {
    return [meta.url, meta];
  })
);
writeFile("./meta.json", JSON.stringify(meta, null, 2));
