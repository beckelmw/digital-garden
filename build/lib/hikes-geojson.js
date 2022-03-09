import buildPointsGeojson from "./build-points-geojson.js";

export default async (hikes) => {
  return buildPointsGeojson(hikes, (data) => {
    const { images, ...props } = data;
    return props;
  });
};
