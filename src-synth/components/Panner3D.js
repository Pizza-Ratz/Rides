import React from "react";
import * as Tone from "tone";
import Dial from "./Dial";
import DigitalReadout from "./DigitalReadout";
import ControlGroup from "./ControlGroup";
import BusContext from "../contexts/BusContext";
import "../styles/controls/Panner3D.scss";

// number of values in original range
const KNOB_MAX = 10000;
// produces a function that scales values 0-KNOB_MAX to between upper and lower bounds
const scaleFactor = (upperBound, lowerBound) => (val) =>
  upperBound === lowerBound
    ? 0
    : val * ((upperBound - lowerBound) / KNOB_MAX / 2) + lowerBound;

/**
 * Creates a component that allows for panning in X, Y, and Z axes, within given bounds.
 * Bounds describe a cubic space by setting the upper left far point and the lower right near point.
 */
const Panner3D = ({
  position = [-73.9040184, 40.7481878, 0],
  bounds = {
    upperLeftFar: [-74.0281309739946, 40.93164311770619, 0],
    lowerRightNear: [-73.65917370133859, 40.535795875332695, 0],
  },
  label = "Position",
  ...rest
}) => {
  const [x, setX] = React.useState(position[0]);
  const [y, setY] = React.useState(position[1]);
  const [z, setZ] = React.useState(position[2]);
  const [panner] = React.useState(new Tone.Panner3D(x, y, z));
  const bus = React.useContext(BusContext);

  React.useEffect(() => {
    panner.connect(bus);
  }, [panner, bus]);

  const [leftX, upperY, farZ] = bounds.upperLeftFar;
  const [rightX, lowerY, nearZ] = bounds.lowerRightNear;

  // if (x > rightX || x < leftX)
  //   throw new Error(`x is out of bounds: ${leftX} ≤ ${x} ≤ ${rightX}}`);
  // if (y > upperY || y < lowerY)
  //   throw new Error(`y is out of bounds: ${lowerY} ≤ ${y} ≤ ${upperY}`);
  // if (z > nearZ || z < farZ)
  //   throw new Error(`z is out of bounds: ${farZ} ≤ ${z} ≤ ${nearZ}`);

  const scaleX = scaleFactor(leftX, rightX);
  const scaleY = scaleFactor(upperY, lowerY);
  const scaleZ = scaleFactor(farZ, nearZ);

  panner.positionX = x;
  panner.positionY = y;
  panner.positionZ = z;

  return (
    <div className="panner3d" {...rest}>
      <label>{label}</label>
      <ControlGroup label="X">
        <Dial
          size={30}
          value={KNOB_MAX / 2}
          min={0}
          max={KNOB_MAX}
          numTicks={0}
          onChange={(val) => setX(scaleX(val))}
        />
        <DigitalReadout>{x.toFixed(5)}</DigitalReadout>
      </ControlGroup>
      <ControlGroup label="Y">
        <Dial
          size={30}
          value={KNOB_MAX / 2}
          min={0}
          max={KNOB_MAX}
          numTicks={0}
          onChange={(val) => setY(scaleY(val))}
        />
        <DigitalReadout>{y.toFixed(5)}</DigitalReadout>
      </ControlGroup>
      <ControlGroup label="Z">
        <Dial
          size={30}
          value={KNOB_MAX / 2}
          min={0}
          max={KNOB_MAX}
          numTicks={0}
          onChange={(val) => setZ(scaleZ(val))}
        />
        <DigitalReadout>{z.toFixed(5)}</DigitalReadout>
      </ControlGroup>
    </div>
  );
};

export default Panner3D;
