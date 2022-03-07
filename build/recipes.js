import { writeFile } from "fs/promises";
import recipesReadme from "./lib/recipes-readme.js";
import getFiles from "./lib/get-files.js";
import getMeta from "./lib/get-meta.js";

const files = await getFiles("recipes/**/*.md");
const meta = await getMeta(files);
const recipes = meta.filter((x) => x.cuisine);

// Create the readme.md
const md = await recipesReadme(recipes);
await writeFile("./recipes/readme.md", md);
