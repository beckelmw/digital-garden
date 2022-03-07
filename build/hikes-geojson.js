import { writeFile } from "fs/promises";
import buildPointsGeojson from "./lib/build-points-geojson.js";
import getFiles from "./lib/get-files.js";
import getMeta from "./lib/get-meta.js";

const files = await getFiles("hikes/**/*.md");
const meta = await getMeta(files);
const onlyHikes = meta.filter((x) => x.latitude && x.longitude);

const geoJson = buildPointsGeojson(onlyHikes, (props) => ({ ...props }));

await writeFile("./hikes/hikes.geojson", JSON.stringify(geoJson, null, 2));
