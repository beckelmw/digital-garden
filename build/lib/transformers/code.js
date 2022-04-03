import { visit } from "unist-util-visit";

export default () => {
  return (ast, file) => {
    visit(
      ast,
      (x) => x.tagName === "code",
      () => {
        file.data.meta = file.data.meta || {};
        file.data.meta.hasCode = true;
      }
    );
  };
};
