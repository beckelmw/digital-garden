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
