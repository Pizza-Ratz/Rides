import React from "react";
import PropTypes from "prop-types";
import SynthPad1Inst from "../engines/SynthPad1";
import Dial from "../../components/Dial";
import "../../styles/SynthPad1.scss";
import ControlGroup from "../../components/ControlGroup";
import BusContext from "../../contexts/BusContext";
import { knobToDB, dBToKnob } from "../../lib/transformers";
import * as Tone from "tone";

const SMALL_KNOB_SIZE = 30;

const SynthPad1 = () => {
  const [synth] = React.useState(new SynthPad1Inst());
  const bus = React.useContext(BusContext);
  const [meter] = React.useState(new Tone.Meter());

  React.useEffect(() => {
    synth.chain(synth.efx.delay, synth.efx.reverb, bus);
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
    <div className={`synth-pad-1`}>
      <h3>Sizzle</h3>
      <Dial
        size={50}
        min={0}
        max={1000}
        color={true}
        colorFn={meter.getValue.bind(meter)}
        value={dBToKnob(synth.volume.value)}
        onChange={(val) => (synth.volume.value = knobToDB(val))}
      >
        <label>Volume</label>
      </Dial>
      <ControlGroup label="Effects">
        <ControlGroup label="Reverb">
          <Dial
            size={SMALL_KNOB_SIZE}
            min={0}
            max={1000}
            val={Math.floor(synth.efx.reverb.decay) * 100}
            onChange={(val) => (synth.efx.reverb.decay = Math.abs(val / 100))}
          >
            <label>decay</label>
          </Dial>
          <Dial
            size={SMALL_KNOB_SIZE}
            min={0}
            max={100}
            val={synth.efx.reverb.wet.value * 100}
            color={false}
            onChange={(val) =>
              (synth.efx.reverb.wet.value = Math.abs(val / 100))
            }
          >
            <label>wet</label>
          </Dial>
        </ControlGroup>
        <ControlGroup label="Delay">
          <Dial
            size={SMALL_KNOB_SIZE}
            min={0}
            max={100}
            val={Math.floor(synth.efx.delay.delayTime.value) * 100}
            color={false}
            onChange={(val) =>
              (synth.efx.delay.delayTime.value = Math.abs(val / 100))
            }
          >
            <label>time</label>
          </Dial>
          <Dial
            size={SMALL_KNOB_SIZE}
            min={0}
            max={100}
            val={Math.floor(synth.efx.delay.wet.value) * 100}
            color={false}
            onChange={(val) =>
              (synth.efx.delay.wet.value = Math.abs(val / 100))
            }
          >
            <label>wet</label>
          </Dial>
        </ControlGroup>
      </ControlGroup>
    </div>
  );
};

SynthPad1.propTypes = {
  className: PropTypes.string,
};

export default SynthPad1;
