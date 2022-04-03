---
title: Mutating Unist AST
category: code
url: /code/mutating-unist-ast
status: seedling
description: Example of mutating a Unist Abstract Syntax Tree (AST).
---

Great example https://css-tricks.com/how-to-modify-nodes-in-an-abstract-syntax-tree/

The code below will change a list of images into a grid of images.

```js
import { selectAll } from "unist-util-select";
import { visit } from "unist-util-visit";

export default () => {
  return (ast) => {
    visit(
      ast,
      (x) => x.tagName === "ul",
      (node) => {
        const images = selectAll("element", node).filter(
          (y) => y.tagName === "img"
        );
        if (images.length) {
          node.tagName = "div";
          node.properties["class"] =
            "grid grid-col-1 md:grid-col-3 lg:grid-cols-4";
          node.children = images;
        }
      }
    );
  };
};
```

## Wrapping an element

For the code examples on this site I needed to wrap the `pre > code` tags in a `div` with the class `not-prose` so that they could be highlighted correctly using [highlightjs](https://highlightjs.org/) via [remark-highlight](https://github.com/remarkjs/remark-highlight.js). This is because I am using the [typography plugin](https://tailwindcss.com/docs/typography-plugin#undoing-typography-styles) from tailwindcss.

```js
import { visit } from "unist-util-visit";
import { h } from "hastscript";

export default () => {
  return (ast, file) => {
    visit(
      ast,
      (x) =>
        x.tagName === "pre" && x.children.some((n) => n.tagName === "code"),

      (node, idx, parent) => {
        file.data.meta = file.data.meta || {};
        file.data.meta.hasCode = true;

        parent.children[idx] = h("div", { class: "not-prose" }, [node]);
      }
    );
  };
};
```

The code above turns:

```html
<pre>
  <code>Some code</code>
</pre>
```

into:

```html
<div class="not-prose">
  <pre>
    <code>Some code</code>
  </pre>
</div>
```
