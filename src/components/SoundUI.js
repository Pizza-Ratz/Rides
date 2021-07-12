import React, { useState } from "react";
import { Donut } from 'react-dial-knob'
import Nouislider, { wNumb } from "nouislider-react";
import "nouislider/distribute/nouislider.css";

export const Switch = () => {
  const options = {
    orientation: "vertical",
    start: 0,
    range: {
      'min': [0, 1],
      'max': 1
    },
    format: wNumb({
      decimals: 0
    }),
    className: 'switch'
  }
  return <Nouislider {...options} />
}

export const Fader = ({ min, max, start }) => (
  <Nouislider
    range={{ min, max }}
    start={start}
    orientation={"vertical"}
    className={"fader"}
  />
);

export const Knob = ({ min, max }) => {
  const [value, setValue] = React.useState(0)
  return <Donut
    diameter={100}
    min={min}
    max={max}
    step={1}
    value={value}
    theme={{
      donutColor: 'cyan'
    }}
    style={{
      position: 'relative',
      margin: '100px auto',
      width: '100px'
    }}
    onValueChange={setValue}
    ariaLabelledBy={'knob-label'}
    spaceMaxFromZero={false}
  >
    <label id={'knob-label'} style={{
      textAlign: 'center',
      width: '200px',
      display: 'block',
      padding: '10px 0'
    }}>Default Knob</label>
  </Donut>
}