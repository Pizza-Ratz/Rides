import React from "react";
import PropTypes from "prop-types";
import SynthPluck1Inst from "../engines/SynthPluck1";
import Dial from "../../components/Dial";
import ControlGroup from "../../components/ControlGroup";
import "../../styles/SynthPluck1.scss";
import BusContext from "../../contexts/BusContext";
import { dBToKnob, knobToDB } from "../../lib/transformers";
import * as Tone from "tone";

const SynthPluck1 = () => {
  const [synth] = React.useState(new SynthPluck1Inst());
  const bus = React.useContext(BusContext);
  const [meter] = React.useState(new Tone.Meter());

  React.useEffect(() => {
    synth.chain(
      synth.efx.vibrato,
      synth.efx.dist,
      // synth.efx.eq,
      synth.efx.autoFilter,
      synth.efx.delay,
      synth.efx.reverb,
      // synth.efx.eq2,
      // synth.efx.chorus,
      bus
    );
    // synth.efx.reverb.generate();
    synth.efx.autoFilter.start();
    synth.start();
    // synth.postInit();
    // synth.connect(bus);
    //synth.output.connect(bus);
    synth.output.connect(meter);
    meter.normalRange = true;
    return () => {
      synth.stop();
    };
  }, [synth, bus, meter]);

  return (
    <div className={`synth-pluck-1`}>
      <h3>Eternity</h3>
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
      <Dial
        min={1}
        max={1500}
        size={30}
        value={synth.efx.autoFilter.baseFrequency}
        onChange={(val) => (synth.efx.autoFilter.baseFrequency = val)}
      >
        <label>cutoff</label>
      </Dial>
      <Dial
        min={0}
        max={100}
        size={30}
        value={Math.floor(synth.efx.autoFilter.depth.value) * 100}
        onChange={(val) =>
          (synth.efx.autoFilter.depth.value = Math.abs(val / 100))
        }
      >
        <label>depth</label>
      </Dial>
      <ControlGroup label="effects">
        <Dial
          min={0}
          max={100}
          size={30}
          value={Math.floor(synth.efx.reverb.wet.value) * 100}
          onChange={(val) => synth.efx.reverb.set({ wet: Math.abs(val / 100) })}
        >
          <label>reverb wet</label>
        </Dial>
        <Dial
          min={0}
          max={100}
          size={30}
          value={Math.floor(synth.efx.delay.wet.value) * 100}
          onChange={(val) => synth.efx.delay.set({ wet: Math.abs(val / 100) })}
        >
          <label>delay wet</label>
        </Dial>
      </ControlGroup>
    </div>
  );
};

SynthPluck1.propTypes = {
  className: PropTypes.string,
};

export default SynthPluck1;
