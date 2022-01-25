---
title: Creating a digital garden with Github, Markdown and Cloudflare Workers
created: 2022-01-21
category: code
---
# Creating a digital garden with Github, Markdown and a Cloudflare Worker

> Rather than presenting a set of polished articles, displayed in reverse chronological order, these sites act more like free form, work-in-progress wikis. - https://maggieappleton.com/garden-history.

So, here it is. How I started my digital garden using Github, Markdown and a Cloudflare worker.

## Reasoning
- Markdown
  - Easy to write and transport anywhere in the future
  - Github flavored markdown even better
- Github
  - Content doesn't live on my machine
  - Versioned via git
  - Existing API which 304s when content hasn't changed
  - Can edit content from an iPad
- Cloudflare worker
  - Easy setup
  - Served from the edge
  - Based on web standards

## Setting up a Cloudflare worker

### ESBuild

This is my build.js file for the worker:

```
import * as esbuild from "esbuild";

const mode = process.env.NODE_ENV?.toLowerCase() ?? "development";

console.log(`[Worker] Running esbuild in ${mode} mode`);

esbuild.build({
  entryPoints: ["./src/index.js"],
  bundle: true,
  sourcemap: true,
  format: "esm",
  conditions: ["worker"], // https://esbuild.github.io/api/#how-conditions-work
  minify: mode === "production",
  define: {
    "process.env.NODE_ENV": `"${mode}"`,
  },
  outfile: "dist/index.mjs", // .mjs is important for Cloudflare
});

```

### Miniflare

[Miniflare](https://miniflare.dev/) allows you to work with Cloudflare workers locally. Within package.json miniflare is started with some KV settings a command to run the build script above.

```
"scripts": {
    "dev": "concurrently \"npm:dev:*\"",
    "dev:worker": "miniflare --kv CONTENT --kv-persist --build-command \"node ./build.js\" --watch --debug"
}
```

#### Environment variables

Miniflare will pickup the variables you define in a `.env` file automatically. When you deploy your worker to Cloudflare you will have to set the environment variables your worker expects using their [wrangler cli](https://developers.cloudflare.com/workers/cli-wrangler/commands#put) tool.

### Getting content from the Github API

#### Caching fetched content with Workers KV

When you make a request for content from the Github API it will return a [304 Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) status code if the content hasn't changed. You tell it what content you have via an [etag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) in a [If-None-Match](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) header in your request. The nice thing about 304s is they don't count against your API quota.

The flow is:
 - Check KV for cached content
 - If cached content exists, then add If-None-Match header with etag stored with the cached content
 - Make request
 - Check response
    - If status code 304 then bail and return existing cached content
    - If status code 200 then cache new content with etag and then return content to user
    - If status code 404 then delete cached content and return 404 to the user
    - If there is an error return cached content


### Processing markdown with Remark and generating HTML with Rehype

```
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { load as yaml } from "js-yaml";

export default async (markdown) => {
  let meta = {};
  const { value: html } = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(() => {
      return (ast) => {
        visit(
          ast,
          (x) => x.type === "yaml",
          (node, index, parent) => {
            meta = { ...meta, ...yaml(node.value) };
          }
        );
      };
    })
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // What allows raw html to work
    .use(rehypeStringify)
    .process(markdown);

  return { html, meta };
};
```

## TailwindCSS

You cannot currently setup your tailwind config as an ES Module. They have a work around though where they will pickup the config when it ends with a `.cjs`. Here is my `tailwind.config.cjs` file:

```
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
```

I am processing it concurrently along with miniflare using the script below and writing it a location where miniflare will serve it when requested from KV storage.

```
"scripts": {
    "dev": "concurrently \"npm:dev:*\"",
    "dev:worker": "miniflare --kv CONTENT --kv-persist --build-command \"node ./build.js\" --watch --debug",
    "dev:tailwind": "npx tailwindcss -c ./tailwind.config.cjs -i ./src/css/site.css -o .mf/kv/CONTENT/css/site.css --watch"
}
```


