import React from "react";
import { useMap } from "react-leaflet";

const ZoomWow = ({ zoom, center, when }) => {
  const map = useMap();

  const promiseToFlyTo = () =>
    new Promise((resolve, reject) => {
      const baseError = "Failed to fly to area";

      if (!map.flyTo) {
        reject(`${baseError}: no flyTo method on map`);
      }

      if (typeof zoom !== "number") {
        reject(`${baseError}: zoom invalid number ${zoom}`);
      }

      const mapCenter = center || map.getCenter();
      const mapZoom = zoom || map.getZoom();

      map.flyTo(mapCenter, mapZoom, {
        duration: 2,
      });

      map.once("moveend", () => {
        resolve();
      });
    });

  React.useEffect(() => {
    setTimeout(async () => {
      await promiseToFlyTo(map, {
        zoom: zoom,
        center: center,
      });
    }, when);
  }, []);

  return null;
};

export default ZoomWow;
