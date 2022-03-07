import { globby } from "globby";

export default async (glob = "**/*") => {
  return await globby([glob, "!node_modules"]);
};
