import React from "react";
import PropTypes from "prop-types";
import SynthPluckInst from "../../instruments/engines/SynthPluck2";
import Dial from "../../components/Dial";
import ControlGroup from "../../components/ControlGroup";
import "../../styles/SynthPluck2.scss";
import BusContext from "../../contexts/BusContext";
import { dBToKnob, knobToDB } from "../../lib/transformers";
import * as Tone from "tone";

const SynthPluck2 = () => {
  const [synth] = React.useState(new SynthPluckInst());
  const bus = React.useContext(BusContext);
  const [meter] = React.useState(new Tone.Meter());

  React.useEffect(() => {
    synth.chain(
      // synth.efx.gain,
      // synth.efx.vibrato,
      synth.efx.eq,
      synth.efx.dist,
      synth.efx.phaser,
      synth.efx.delay,
      synth.efx.reverb,
      // synth.efx.eq2,
      // synth.efx.chorus,
      bus
    );
    // synth.efx.reverb.generate();
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
    <div className={`synth-pluck-2`}>
      <h3>Prelude</h3>
      <Dial
        size={50}
        min={0}
        max={1000}
        value={dBToKnob(synth.volume.value)}
        onChange={(val) => (synth.volume.value = knobToDB(val, 1000))}
        color={true}
        colorFn={meter.getValue.bind(meter)}
      >
        <label>Volume</label>
      </Dial>
      <ControlGroup label="effects">
        <Dial
          min={0}
          max={100}
          size={30}
          value={Math.floor(synth.efx.dist.wet.value) * 100}
          onChange={(val) => (synth.efx.dist.wet.value = Math.abs(val / 100))}
        >
          <label>distortion</label>
        </Dial>
        <Dial
          min={0}
          max={100}
          size={30}
          value={Math.floor(synth.efx.phaser.Q.value) * 100}
          onChange={(val) => (synth.efx.phaser.Q.value = Math.abs(val / 100))}
        >
          <label>phaser q</label>
        </Dial>
        <Dial
          min={0}
          max={100}
          size={30}
          value={Math.floor(synth.efx.reverb.wet.value) * 100}
          onChange={(val) => (synth.efx.reverb.wet.value = Math.abs(val / 100))}
        >
          <label>reverb</label>
        </Dial>
        <Dial
          min={0}
          max={100}
          size={30}
          value={Math.floor(synth.efx.delay.wet.value) * 100}
          onChange={(val) => (synth.efx.delay.wet.value = Math.abs(val / 100))}
        >
          <label>delay</label>
        </Dial>
      </ControlGroup>
    </div>
  );
};

SynthPluck2.propTypes = {
  className: PropTypes.string,
};

export default SynthPluck2;
