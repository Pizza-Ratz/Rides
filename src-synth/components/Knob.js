import React from "react";
import { Silver } from "react-dial-knob";
import "../styles/controls/Knob.scss";

const Knob = ({
  diameter = 70,
  min = 0,
  max = 100,
  step = 1,
  jumpLimit = 0.1,
  value = 0,
  label = "title",
  onValueChange = () => {},
}) => {
  const [snowflake] = React.useState(Math.floor(Math.random() * 1000));

  return (
    <div className="knob-container">
      <Silver
        diameter={diameter}
        min={min}
        max={max}
        step={step}
        // value={}
        jumpLimit={jumpLimit}
        className="knob"
        onValueChange={onValueChange}
        ariaLabelledBy={`knob-label-${snowflake}`}
        spaceMaxFromZero={true}
      />
      <label id={`knob-label-${snowflake}`}>{label}</label>
    </div>
  );
};

export default Knob;
