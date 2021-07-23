import React from "react";
import PropTypes from "prop-types";
import engine from "../engines/SynthPad2";
import Fader from "../../components/Fader";
import BusContext from "../../contexts/BusContext";

const SynthPad2 = ({ className = "synthPad2" }) => {
  const [synth] = React.useState(new engine());
  const bus = React.useContext(BusContext);

  React.useEffect(() => {
    synth.output.connect(bus);
    synth.transport.scheduleOnce(synth.start.bind(synth), 1);
  }, [synth, bus]);

  return (
    <div className={className}>
      <Fader
        range={{ min: [0], max: [1000] }}
        pips={{}}
        value={Math.floor(synth.volume.value) * 1000}
        onValueChange={(val) => (synth.volume.value = val / 1000)}
        tooltips={false}
        label="Volume"
      />
    </div>
  );
};

SynthPad2.propTypes = {
  className: PropTypes.string,
};

export default SynthPad2;
