import getHtml from "./lib/get-html.js";
import getFiles from "./lib/get-files.js";

const files = await getFiles("**/code/*creating*.md");
const mdFiles = await getHtml(files);

console.log(JSON.stringify(mdFiles, null, 2));
