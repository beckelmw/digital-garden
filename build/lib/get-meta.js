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

export default async (files) => {
  const result = [];

  for (const f of files) {
    const content = await readFile(f);
    const { meta } = await convert(content);

    result.push({
      ...meta,
    });
  }

  return result;
};