import getFiles from "./lib/get-files.js";
import getMarkdown from "./lib/get-markdown.js";
import kvPut from "./lib/kv-put.js";

const files = await getFiles("**/*.md");
const mdFiles = await getMarkdown(files);

const data = mdFiles.map(({ markdown, meta }) => {
  return {
    title: meta.title,
    text: markdown,
    url: meta.url,
  };
});

const json = JSON.stringify(data);
await kvPut("search.json", { body: json });
