---
title: Creating a digital garden with Github, Markdown and a Cloudflare Worker
created: 2022-01-21
category: code
status: seedling
url: /code/creating-a-digital-garden-with-github-markdown-and-cloudflare-workers
description: Explanation of how I created my digital garden using Markdown, Github and a Cloudflare Worker.
---

> Rather than presenting a set of polished articles, displayed in reverse chronological order, these sites act more like free form, work-in-progress wikis.
— https://maggieappleton.com/garden-history

So, here it is. How I started my digital garden using Github, Markdown and a Cloudflare worker.

## Reasoning

- Markdown
  - Easy to write and transport anywhere in the future
  - [Github flavored markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) is even better
- [Github](https://github.com)
  - Content doesn't live on my machine
  - Versioned via git
  - Can edit content from an iPad if I wanted via [github web editor](https://docs.github.com/en/codespaces/the-githubdev-web-based-editor)
  - Another developer could contribute or correct my mistakes via a pull request
- [Cloudflare worker](https://developers.cloudflare.com/workers/)
  - Easy setup
  - Served from the edge
  - Based on web standards
  - Inexpensive

## Overview

My digital garden has two repositories. The first [repo](https://github.com/beckelmw/digital-garden) contains my content such as markdown and geojson and a build process to convert the markdown to html. The [build scripts](https://github.com/beckelmw/digital-garden/tree/main/build) are executed via a [github action](https://github.com/beckelmw/digital-garden/blob/main/.github/workflows/build.yml) each time a file is committed to the repository which matches the glob `*/**.md`. The build process also uploads the latest html generated to the [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/) store for my site. With this process, I avoid having the worker transform the markdown to html on each request.

The second [repo](https://github.com/beckelmw/beckelman.org) contains my cloudflare worker which serves the html and geojson from the KV store as well as some other assets.

### Processing markdown with Remark and generating HTML with Rehype

```js
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
```

## Setting up a Cloudflare worker

### ESBuild

This is my build.js file for the worker using [ESBuild's programmatic api](https://esbuild.github.io/getting-started/):

```js
import * as esbuild from "esbuild";
import { transform as tempura } from "tempura/esbuild";

const mode = process.env.MODE?.toLowerCase() ?? "development";

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
  plugins: [
    tempura(),
  ],
});

```

### Miniflare

[Miniflare](https://miniflare.dev/) allows you to work with Cloudflare workers locally. This is my wrangler.toml with miniflare settings.

```toml
compatibility_date = "2021-11-12"
name = "beckelman-org"
type = "javascript"
workers_dev = true

kv_namespaces = [
  {binding = "CONTENT", id = "<my-id>"},
]

[build]
command = "npm run build"

[build.upload]
format = "modules"
main = "index.mjs"

[miniflare]
watch = true
build_watch_dirs = ["src", ".mf/kv/CONTENT/css"]
live_reload = true
kv_persist = true

```

Miniflare is started as a dev script:
```json
"scripts": {
    "dev": "concurrently \"npm:dev:*\"",
    "dev:worker": "miniflare"
}
```

#### Environment variables

Miniflare will pickup the variables you define in a [.env](https://miniflare.dev/core/variables-secrets) file automatically. When you deploy your worker to Cloudflare you will need to set the environment variables your worker expects using their [wrangler cli](https://developers.cloudflare.com/workers/cli-wrangler/commands#put) tool.

## TailwindCSS

You cannot currently setup your tailwind config as an ES Module. They have a [work around though where they will pickup the config](https://github.com/tailwindlabs/tailwindcss/pull/3181) when it ends with a `.cjs`. Here is my `tailwind.config.cjs` file:

```js
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
```

I am processing it concurrently along with miniflare using the script below and writing it a location where miniflare will serve it when requested from KV storage.

```json
"scripts": {
    "dev": "concurrently \"npm:dev:*\"",
    "dev:worker": "miniflare --kv CONTENT --kv-persist --build-command \"node ./build.js\" --watch --debug",
    "dev:tailwind": "npx tailwindcss -c ./tailwind.config.cjs -i ./src/css/site.css -o .mf/kv/CONTENT/css/site.css --watch"
}
```

### Publishing updated CSS

After a build, the css needs to be published to the workers KV store. The command below will upload the file.

```bash
wrangler kv:key put --binding=CONTENT css/site.css ./dist/site.css --path
```
