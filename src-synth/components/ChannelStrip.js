import React from "react";
import Dial from "./Dial";
import Slider from "./Slider";
import "../styles/controls/ChannelStrip.scss";
import BusContext from "../contexts/BusContext";
import { knobToDB } from "../lib/transformers";

// // does log^10(val), where val is in 0-100000 => 0-5
// function linearToLog(val) {
//   return val > 0 ? Math.log10(Math.abs(val)) : 0;
// }

// // turns 0-100000 into ~ -110-0 db
// function linearToDecibels(val = 0) {
//   // console.log(`${val} -> ${linearToLog(val)} => ${20 * linearToLog(val) - 95}`);
//   return 20 * linearToLog(val) - 95;
// }

const ChannelStrip = ({ id }) => {
  const channel = React.useContext(BusContext);

  return (
    <div className="channel-strip" id={id}>
      <label>Master</label>
      <Dial
        size={30}
        value={Math.floor(channel.pan.value) * 100}
        min={0}
        max={100}
        numTicks={0}
        onChange={(val) => (channel.pan.value = (val - 51) / 100)}
      >
        <label>Pan</label>
      </Dial>
      <Slider
        min={0}
        max={1000}
        // value={dBToKnob(channel.volume.value)}
        onChange={(val) => {
          channel.volume.value = knobToDB(val);
          // console.log(`[${val}] -> ${val - 90} => ${channel.volume.value}`);
        }}
      />
    </div>
  );
};

export default ChannelStrip;
