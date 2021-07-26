// see https://leafletjs.com/examples/geojson/ for how this works

import React from "react";
import L from "leaflet";
import { GeoJSON, useMap } from "react-leaflet";
import polyUtil from "polyline-encoded";
import SubwayLines from "../data/SubwayLines.geojson.json";
import SubwayRoutes from "../data/SubwayRoutes.json";
// import { GlobalTripStateContext } from "../context/GlobalContextProvider";
import StoreContext from "../store";
import { getStepsFromRoute } from "../lib/util";

// transforms route ID into CSS color for route
const lineColor = SubwayRoutes.reduce((accum, route) => {
  accum[route.id] = `#${route.color}`;
  return accum;
}, {});

// uses GeoJSON data to give the subway line its associated color
const styleLine = (line) => {
  return {
    color: lineColor[line.properties.rt_symbol],
    weight: 3.5,
    border: "10px solid white",
  };
};

const SubwayLinesLayer = () => {
  const map = useMap();

  // assemble the route line from the steps in the directions
  const [store] = React.useContext(StoreContext);
  const { trip } = store;

  React.useEffect(() => {
    const steps = getStepsFromRoute(trip);
    const segments = steps.map((s) => polyUtil.decode(s.polyline.points));
    L.polyline(segments, {
      color: "white",
      strokeWeight: 8,
    }).addTo(map);
  }, [trip, map]);

  return <GeoJSON data={SubwayLines} style={styleLine} />;
};

export default SubwayLinesLayer;
