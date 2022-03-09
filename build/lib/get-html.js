import { readFile } from "fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";
import frontmatter from "./transformers/frontmatter.js";
import processImageList from "./transformers/process-image-list.js";
import map from "./transformers/map.js";
import removeExtensions from "./transformers/remove-extensions.js";

async function convert(content) {
  const { value: html, data } = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(frontmatter)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // What allows raw html to work
    .use(processImageList)
    .use(map)
    .use(removeExtensions)
    .use(rehypeMinifyWhitespace)
    .use(rehypeStringify)
    .process(content);

  return { html, meta: data.meta };
}

async function process(file) {
  const content = await readFile(file);
  const { html, meta } = await convert(content);
  return { html, meta };
}

export default async (files) => {
  return await Promise.all(files.map(process));
};
