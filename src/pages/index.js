import React from "react";
import { Helmet } from "react-helmet";
import Layout from "components/Layout";
import Map from "components/Map";
import SubwayStationsLayer from "../components/SubwayStationsLayer";
import SubwayLinesLayer from "../components/SubwayLinesLayer";
import {
  GlobalStationDispatchContext,
  GlobalStationStateContext,
} from "../context/GlobalContextProvider";
import { loadStations, loadStationsAction } from "../store/reducers/stations";
import { GlobalTripStateContext } from "../context/GlobalContextProvider";
import { getStepsFromRoute } from "../lib/util";

import Sizzle from "pizza-ratz-react-synth/src/instruments/engines/SynthPad1";
import Eternity from "pizza-ratz-react-synth/src/instruments/engines/SynthPluck1";
import Fantasy from "pizza-ratz-react-synth/src/instruments/engines/SynthPluck2";
import * as Tone from "tone";

let started = false;
let REF_DISTANCE = 10;
let MAX_DISTANCE = 100;

const sizzle = new Sizzle();
const sizzlePanner = new Tone.Panner3D({
  refDistance: REF_DISTANCE,
  maxDistance: MAX_DISTANCE,
});
sizzle.postInit();
sizzle.connect(sizzlePanner);

const eternity = new Eternity();
const eternityPanner = new Tone.Panner3D({
  refDistance: REF_DISTANCE,
  maxDistance: MAX_DISTANCE,
});
eternity.chain(
  eternity.efx.vibrato,
  eternity.efx.dist,
  eternity.efx.autoFilter,
  eternity.efx.delay,
  eternity.efx.reverb,
  eternityPanner
);

const fantasy = new Fantasy();
const fantasyPanner = new Tone.Panner3D({
  refDistance: REF_DISTANCE,
  maxDistance: MAX_DISTANCE,
});
fantasy.postInit();
fantasy.connect(fantasyPanner);

document.getRootNode().addEventListener("click", () => {
  if (started) return;
  started = true;

  sizzle.start();
  eternity.start();
  fantasy.start();
  sizzlePanner.toDestination();
  eternityPanner.toDestination();
  fantasyPanner.toDestination();

  Tone.getTransport().start();
});

const LOCATION = {
  lat: 40.7481878,
  lng: -73.9040184,
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 10.5;
const MIN_ZOOM = 9;
const bound1 = [40.93164311770619, -74.0281309739946];
const bound2 = [40.535795875332695, -73.65917370133859];
const MAX_BOUNDS = [bound1, bound2];
// mapping of station ID id to instrument at that station
const NOISY_STATIONS = {
  377: { instrument: eternity, panner: eternityPanner }, // Jay St NR
  358: { instrument: sizzle, panner: sizzlePanner }, // Penn Station
  453: { instrument: fantasy, panner: fantasyPanner }, // High St
};
const STARTING_STATION = 405;

const scaleCoord = (coord) => (coord % 10) * 1000;

function moveListener(
  listener,
  destination = [0, 0, 0],
  tripTime,
  startTime = Tone.Context.now()
) {
  const [destX, destY, destZ = 0] = destination;
  listener.positionX.rampTo(destX, tripTime, startTime);
  listener.positionY.rampTo(destY, tripTime, startTime);
  listener.positionZ.rampTo(destZ, tripTime, startTime);
  // have the listener point in the direction it's moving
  listener.forwardX.rampTo(destX, tripTime / 8, startTime);
  listener.forwardY.rampTo(destY, tripTime / 8, startTime);
  listener.forwardZ.rampTo(destZ, tripTime / 8, startTime);
}

const IndexPage = () => {
  const mapSettings = {
    center: CENTER,
    zoom: DEFAULT_ZOOM,
    draggable: true,
    maxBounds: MAX_BOUNDS,
    minZoom: MIN_ZOOM,
  };
  const stationState = React.useContext(GlobalStationStateContext);
  const stationDispatch = React.useContext(GlobalStationDispatchContext);
  const routeData = React.useContext(GlobalTripStateContext);

  React.useEffect(() => {
    stationDispatch(loadStationsAction(loadStations()));

    // move instruments to their stations
    const listener = Tone.getListener();
    const stationIds = Object.keys(NOISY_STATIONS);
    stationState.data.features
      .filter((s) => stationIds.includes(s.properties.objectid)) // select stations that have an entry in NOISY_STATIONS
      .forEach((s) => {
        const { panner } = NOISY_STATIONS[s.properties.objectid];
        panner.positionX.value = scaleCoord(s.geometry.coordinates[0]);
        panner.positionY.value = scaleCoord(s.geometry.coordinates[1]);
        panner.positionZ.value = 0;
        console.log(s.properties.objectid, panner);
      });

    // place listener at starting station
    stationState.data.features
      .filter((s) => s.properties.objectid == STARTING_STATION)
      .forEach((s) => {
        listener.positionX.value = scaleCoord(s.geometry.coordinates[0]);
        listener.positionY.value = scaleCoord(s.geometry.coordinates[1]);
        listener.positionZ.value = 0;
        console.log("listener", listener);
      });

    // get the list of steps in our route
    const steps = getStepsFromRoute(routeData.results);

    listener.debug = true;
    // schedule the listener's moves, starting in 5 seconds
    const startingTime = Tone.now() + 5;
    // keep track of where we are along the timeline in terms of each step's duration
    let prevStepEndTime = startingTime;
    // currently going in a straight line from station to station
    steps.forEach((step) => {
      const seconds = step.duration.value;
      const endX = step.end_location.lng;
      const endY = step.end_location.lat;
      moveListener(listener, [endX, endY, 0], seconds, prevStepEndTime);
      prevStepEndTime += seconds;
    });
  }, []);

  if (typeof window === "undefined") return null;

  //
  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@290;400&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
      <div className="stars"></div>
      <div className="twinkling"></div>
      <Map {...mapSettings}>
        <SubwayLinesLayer />
        <SubwayStationsLayer />
      </Map>
    </Layout>
  );
};

export default IndexPage;
