import { writeFile } from "fs/promises";
import recipesReadme from "./lib/recipes-readme.js";
import getFiles from "./lib/get-files.js";
import getMarkdown from "./lib/get-markdown.js";

const files = await getFiles("recipes/**/*.md");
const markdown = await getMarkdown(files);
const meta = markdown.map((x) => x.meta);
const recipes = meta.filter((x) => x.cuisine);

// Create the readme.md
const md = await recipesReadme(recipes);
await writeFile("./recipes/readme.md", md);
