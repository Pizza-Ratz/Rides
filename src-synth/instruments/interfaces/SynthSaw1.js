import React from "react";
import PropTypes from "prop-types";
import SynthSaw1Inst from "../engines/SynthSaw1";
import Dial from "../../components/Dial";
import ControlGroup from "../../components/ControlGroup";
import "../../styles/SynthSaw1.scss";
import BusContext from "../../contexts/BusContext";
import { dBToKnob, knobToDB } from "../../lib/transformers";
import * as Tone from "tone";

const SynthSaw1 = () => {
  const [synth] = React.useState(new SynthSaw1Inst());
  const bus = React.useContext(BusContext);
  const [meter] = React.useState(new Tone.Meter());

  React.useEffect(() => {
    synth.chain(
      // synth.efx.gain,
      // synth.efx.vibrato,
      synth.efx.dist,
      // synth.efx.autoFilter,
      synth.efx.delay,
      synth.efx.reverb,
      bus
    );
    // synth.efx.reverb.generate();
    synth.start();
    // synth.postInit();
    // synth.connect(bus);
    synth.output.connect(meter);
    meter.normalRange = true;
    return () => {
      synth.stop();
    };
  }, [synth, bus, meter]);

  return (
    <div className={`synth-saw-1`}>
      <h3>Lead 2</h3>
      <Dial
        size={50}
        min={0}
        max={1000}
        value={dBToKnob(synth.volume.value, 1000)}
        onChange={(val) => (synth.volume.value = knobToDB(val, 1000))}
        color={true}
        colorFn={meter.getValue.bind(meter)}
      >
        <label>Volume</label>
      </Dial>

      <ControlGroup label="filter">
        <Dial
          size={30}
          min={1}
          max={1500}
          value={synth.efx.autoFilter.baseFrequency}
          onChange={(val) => (synth.efx.autoFilter.baseFrequency = val)}
        >
          <label>cutoff</label>
        </Dial>
      </ControlGroup>
      <Dial
        min={0}
        max={100}
        value={Math.floor(synth.efx.reverb.wet.value) * 100}
        onChange={(val) => synth.efx.reverb.set({ wet: Math.abs(val / 100) })}
      >
        <label>reverb</label>
      </Dial>
      <Dial
        min={0}
        max={100}
        value={Math.floor(synth.efx.delay.wet.value) * 100}
        onChange={(val) =>
          synth.efx.delay.set({ wet: Math.abs(val / 100) })
        }
      >
        <label>delay</label>
      </Dial>
    </div>
  );
};

SynthSaw1.propTypes = {
  className: PropTypes.string,
};

export default SynthSaw1;
