/**
 * This library brings together Tone's listener and animated marker
 * so as to keep their locations in sync.
 *
 * A single animation loop is used to move the listener along the polyline that the map marker
 * moves along.
 */

import * as Tone from "tone";
import Sizzle from "pizza-ratz-react-synth/src/instruments/engines/SynthPad1";
import Eternity from "pizza-ratz-react-synth/src/instruments/engines/SynthPluck1";
import Fantasy from "pizza-ratz-react-synth/src/instruments/engines/SynthPluck2";
import { isDomAvailable, getStepsFromRoute, scaleCoord } from "./util";
import getAnimatedMarker from "./animatedMarker";
import { addClass } from "../store/reducers/stations";

const audioCtx = new AudioContext();
if (!audioCtx.state === "running") throw new Error("audio context not running");

const AnimatedMarker = getAnimatedMarker();

// mapping of station ID id to instrument at that station
const NOISY_STATIONS = {
  377: { instrument: eternity, panner: eternityPanner }, // Jay St NR
  178: { instrument: sizzle, panner: sizzlePanner }, // Penn Station
  470: { instrument: fantasy, panner: fantasyPanner }, // Hudson Yards
};
const REF_DISTANCE = 2;
const MAX_DISTANCE = 12;

const sizzle = new Sizzle();
const sizzlePanner = new Tone.Panner3D({
  refDistance: REF_DISTANCE,
  maxDistance: MAX_DISTANCE,
});
sizzle.postInit();
sizzle.connect(sizzlePanner);
sizzlePanner.toDestination();

const eternity = new Eternity();
const eternityPanner = new Tone.Panner3D({
  refDistance: REF_DISTANCE,
  maxDistance: MAX_DISTANCE,
});
eternityPanner.toDestination();
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
fantasyPanner.toDestination();

function moveListener(
  destination = [0, 0, 0],
  tripTimeMs,
  startTime = Tone.Context.now()
) {
  const [destX, destY, destZ = 0] = destination;
  const listener = Tone.getListener();
  const tripTime = tripTimeMs / 1000;
  // set up the change in location
  listener.positionX.rampTo(scaleCoord(destX), tripTime, startTime);
  listener.positionY.rampTo(scaleCoord(destY), tripTime, startTime);
  listener.positionZ.rampTo(scaleCoord(destZ), tripTime, startTime);
  // have the listener point in the direction it's moving
  listener.forwardX.rampTo(scaleCoord(destX), tripTime / 2, startTime);
  listener.forwardY.rampTo(scaleCoord(destY), tripTime / 2, startTime);
  listener.forwardZ.rampTo(scaleCoord(destZ), tripTime / 2, startTime);
}

// there can be only one
let animatedMarker;

export default Tone.start().then(() => ({
  start() {
    Tone.getTransport().start();
    sizzle.start();
    eternity.start();
    fantasy.start();
    animatedMarker.start(moveListener);
  },

  stop() {
    sizzle.stop();
    eternity.stop();
    fantasy.stop();
    Tone.getTransport().stop();
    animatedMarker.stop();
  },

  prepare(map, tripState, stationState, stationDispatch) {
    // move instruments to their stations
    const listener = Tone.getListener();
    const stationIds = Object.keys(NOISY_STATIONS);
    stationState.data.features
      // select stations that have an entry in NOISY_STATIONS
      .filter((s) => stationIds.includes(s.properties.objectid))
      .forEach((s) => {
        stationDispatch(addClass(s.properties.objectid, "noisy"));
        const { panner } = NOISY_STATIONS[s.properties.objectid];
        panner.positionX.value = scaleCoord(s.geometry.coordinates[0]);
        panner.positionY.value = scaleCoord(s.geometry.coordinates[1]);
        panner.positionZ.value = 0;
      });

    // get the list of steps in our route
    const steps = getStepsFromRoute(stationState);
    // schedule the listener's moves, starting in 5 seconds
    const startingTime = Tone.now() + 5;
    // keep track of where we are along the timeline in terms of each step's duration
    let prevStepEndTime = startingTime;
    // currently going in a straight line from station to station
    steps.forEach((step) => {
      const seconds = step.duration.value / 100;
      const endX = scaleCoord(step.end_location.lng);
      const endY = scaleCoord(step.end_location.lat);
      moveListener(listener, [endX, endY, 0], seconds, prevStepEndTime + 1);
      prevStepEndTime += seconds;
    });

    // set up the animated marker and hook moveListener to it
    animatedMarker = AnimatedMarker.fromTrip(tripState);
    map.addLayer(animatedMarker);
  },
}));
