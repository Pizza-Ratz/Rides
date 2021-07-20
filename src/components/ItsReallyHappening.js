import React from "react";
import { getStepsFromRoute } from "../lib/util";
import {
  markStart,
  markEnd,
  findStationsWithName,
} from "../store/reducers/stations";
import { isDomAvailable } from "../lib/util";
import { useMap } from "react-leaflet";

const ItsHappeningBxtch = ({ stations, route, stationDispatch, running }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [animSync, setAnimSync] = React.useState(null);
  const [stationsMarked, setStationsMarked] = React.useState(false);
  const map = useMap();

  console.log(`IHB: `, { stations, route, running, loaded });
  React.useEffect(() => {
    if (!!!stations.data.features) return;
    if (stationsMarked) return;

    const transitSteps = getStepsFromRoute(route).filter(
      (step) => step.travel_mode === "TRANSIT"
    );

    const startingStationName =
      transitSteps[0].transit_details.departure_stop.name;

    const endingStationName =
      transitSteps[transitSteps.length - 1].transit_details.arrival_stop.name;

    const [startingStation] = findStationsWithName(
      stations,
      startingStationName
    );
    const [endingStation] = findStationsWithName(stations, endingStationName);

    // perhaps the trip reducer ought to fire these whenever the trip changes?
    stationDispatch(markStart(startingStation.properties.objectid));
    stationDispatch(markEnd(endingStation.properties.objectid));
    setStationsMarked(true);
    return () => {
      // clearStart?
      // clearEnd?
    };
  }, [stationsMarked, stations, route, stationDispatch]);

  // if route changes, we need to re-mark stations
  React.useEffect(() => setStationsMarked(false), [route]);

  React.useEffect(async () => {
    async function dynamicImportModule() {
      import("../lib/animSync").then((anim) => {
        // dynamic import returns a promise so we need to handle it
        anim.default.then((sync) => {
          setAnimSync(sync);
          setLoaded(true);
        });
      });
    }
    if (!loaded && isDomAvailable()) await dynamicImportModule();
  }, [loaded]);

  React.useEffect(() => {
    if (!(loaded && route && route.status === "OK" && stations)) return;
    animSync.prepare(map, route, stations, stationDispatch);
  }, [loaded, stations]);

  React.useEffect(() => {
    if (loaded) {
      if (running) {
        animSync.start();
      } else {
        animSync.stop();
      }
    }
    return () => loaded && animSync && animSync.stop();
  }, [running, loaded]);

  return <></>;
};

export default ItsHappeningBxtch;
