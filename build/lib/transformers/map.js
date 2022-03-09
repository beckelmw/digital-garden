import { visit } from "unist-util-visit";
import { h } from "hastscript";

export default () => {
  return (ast, file) => {
    const url = file.data.meta.url;
    visit(
      ast,
      (x) => x.tagName === "wb-map",
      (node) => {
        file.data.meta = file.data.meta || {};
        file.data.meta.hasMap = true;
        node.tagName = "wb-map";
        node.properties.accessToken = process.env.MAP_TILER_ACCESS_TOKEN;

        if (!node.properties.url) {
          node.properties.url = `${url}.geojson`;
        }

        if (url === "/hikes") {
          node.children = [
            h("template", { slot: "popup" }, [
              h("h2", [h("a", { href: "{url}" }, ["{title}"])]),
              h("div", [h("strong", ["{type}"])]),
              h("div", ["{distance} / {elevationGain}"]),
            ]),
          ];
        }
      }
    );
  };
};
