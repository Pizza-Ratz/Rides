import React from "react";
import PropTypes from "prop-types";
import { DroneMaker } from "../lib/SynthDrone";
import Dial from "./Dial";
import "../styles/DroneMaker.scss";

const Drone = () => {
  const [synth] = React.useState(new DroneMaker());

  React.useEffect(() => {
    synth.toDestination();
  });

  return (
    <div className={`drone`}>
      <h3>Drone Maker</h3>
      <Dial
        min={0}
        max={1000}
        value={Math.floor(synth.volume.value) * 1000}
        onChange={(amt) => (synth.volume.value = Math.abs(amt / 1000))}
      >
        <label>Volume</label>
      </Dial>
      <button onClick={synth.play.bind(synth)}>Start</button>
      <button onClick={synth.stop.bind(synth)}>Stop</button>
    </div>
  );
};

Drone.propTypes = {
  className: PropTypes.string,
};

export default Drone;
