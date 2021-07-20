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
  const map = useMap();

  React.useEffect(() => {
    if (!!!stations.data.features) return;

    const transitSteps = getStepsFromRoute(route).filter(
      (step) => step.travel_mode === "TRANSIT"
    );

    const startingStationName =
      transitSteps[0].transit_details.departure_stop.name;

    const endingStationName =
      transitSteps[transitSteps.length - 1].transit_details.arrival_stop.name;

    const [startingStation] = findStationsWithName(startingStationName);
    const [endingStation] = findStationsWithName(endingStationName);

    console.debug({
      startingStationName,
      endingStationName,
    });
    console.debug({
      startingStation,
      endingStation,
    });
    // let startingStation, endingStation;
    // if (sta1.properties.name === startingStationName) {
    //   startingStation = sta1;
    //   endingStation = sta2;
    // } else {
    //   endingStation = sta1;
    //   startingStation = sta2;
    // }
    stationDispatch(markStart(startingStation.properties.objectid));
    stationDispatch(markEnd(endingStation.properties.objectid));
  }, [stations, route]);

  React.useEffect(() => {
    async function dynamicImportModule() {
      import("../lib/animSync").then((as) =>
        // dynamic import returns a promise so we need to handle it
        as.then((as2) => {
          setAnimSync(as2);
          setLoaded(true);
        })
      );
    }
    if (!loaded && isDomAvailable()) dynamicImportModule();
  }, [loaded]);

  React.useEffect(() => {
    if (!loaded) return;
    animSync.prepare(map, route, stations, stationDispatch);
  }, [loaded]);

  React.useEffect(() => {
    if (loaded) {
      if (running) {
        animSync.start();
      } else {
        animSync.stop();
      }
    }
    return () => loaded && animSync && animSync.stop();
  }, [running]);

  return <></>;
};

export default ItsHappeningBxtch;
