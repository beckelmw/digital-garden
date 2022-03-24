import getFiles from "./lib/get-files.js";
import getMarkdown from "./lib/get-markdown.js";
import kvPut from "./lib/kv-put.js";

const files = await getFiles("**/*.md");
const mdFiles = await getMarkdown(files);

const urls = mdFiles
  .map(({ meta }) => {
    return `${process.env.SITE_BASE_URL}${meta.url}`.replace(/\/$/, "");
  })
  .join("\n");

await kvPut("sitemap.txt", { body: urls });
