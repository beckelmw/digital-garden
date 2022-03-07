import { readFile } from "fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import frontmatter from "./get-frontmatter.js";
import remarkStringify from "remark-stringify";

async function convert(content) {
  const { value: markdown, data } = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(frontmatter)
    .use(remarkStringify)
    .process(content);

  return { markdown, meta: data.meta };
}

async function process(file) {
  const content = await readFile(file);
  const { markdown, meta } = await convert(content);
  return { markdown, meta };
}

export default async (files) => {
  return await Promise.all(files.map(process));
};
