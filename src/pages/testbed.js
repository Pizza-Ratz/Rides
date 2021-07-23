import React from "react";
import "../../src-synth/App.scss";
import { Helmet } from "react-helmet";
import Layout from "components/Layout";
import { ChannelStrip, TransportControls, Panner3D } from "../../src-synth/components";
import SynthPad1 from "../../src-synth/instruments/interfaces/SynthPad1";
import SynthPad2 from "../../src-synth/instruments/interfaces/SynthPad2";
import SynthPluck1 from "../../src-synth/instruments/interfaces/SynthPluck1";
import SynthPluck2 from "../../src-synth/instruments/interfaces/SynthPluck2";
import SynthLead2 from "../../src-synth/instruments/interfaces/SynthLead2";
import SynthLead1 from "../../src-synth/instruments/interfaces/SynthLead1";
import SynthSaw1 from "../../src-synth/instruments/interfaces/SynthSaw1";

import { BusContextProvider } from "../../src-synth/contexts/BusContext";

function TestBed() {
  return (
    <Layout pageName="testbed">
      <Helmet>
        <title>Test Bed</title>
      </Helmet>
      <div>
        <header className="App-header">Kitchen Sink</header>
        <main>
          <BusContextProvider name="master">
            <div id="master-controls">
              <TransportControls />
              <div>
                <ChannelStrip label="Master" />
                <Panner3D />
              </div>
            </div>
            {/* <SynthLead1 /> */}
            {/* <SynthPad2 /> */}
            <SynthPad1 />
            <SynthPluck1 />
            <SynthPluck2 />
            {/* <SynthSaw1 /> */}
          </BusContextProvider>
        </main>
      </div>
    </Layout>
  );
}

export default TestBed;
