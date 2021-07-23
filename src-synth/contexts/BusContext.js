/**
 * Creates a context that exposes an audio bus to children.
 */

import React from "react";
import * as Tone from "tone";
import Debug from "debug";

const BusContext = React.createContext();

export const BusContextProvider = ({ name = "", children }) => {
  if (!name) name = "bus" + Math.floor(Math.random() * 10000);

  const [debug] = React.useState(Debug(`bus:${name}`));

  const [channel] = React.useState(
    new Tone.Channel({
      volume: -12,
      pan: 0,
      solo: false,
      mute: false,
    })
  );

  const parentBus = React.useContext(BusContext) || Tone.getDestination();

  channel.connect(parentBus);

  // if (debug && debug.enabled) {
  //   const meter = new Tone.Meter();
  //   channel.connect(meter);
  //   setInterval(() => debug(meter.getValue()), 1000);
  // }

  return <BusContext.Provider value={channel}>{children}</BusContext.Provider>;
};

export default BusContext;
