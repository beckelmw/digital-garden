import buildPointsGeojson from "./build-points-geojson.js";

export default async (hikes) => {
  return buildPointsGeojson(hikes, (props) => ({ ...props }));
};
