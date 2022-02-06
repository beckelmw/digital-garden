---
title: Mutating Unist AST
category: code
status: seedling
---

Great example https://css-tricks.com/how-to-modify-nodes-in-an-abstract-syntax-tree/

The code below will change a list of images into a grid of images.

```
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

