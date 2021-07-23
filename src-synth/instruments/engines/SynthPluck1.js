import * as Tone from "tone";
import { patterns } from "../../lib/Patterns";

class SynthPluck1 extends Tone.PolySynth {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          voice: Tone.Synth,
          maxPolyphony: 8,
          volume: 0,
          options: {
            oscillator: {
              type: "fmtriangle",
              modulationType: "triangle",
              modulationIndex: 5,
              harmonicity: 3,
            },
            envelope: {
              attack: 0.05,
              decay: 0.7,
              decayCurve: "exponential",
              sustain: 0.1,
              release: 1.2,
              releaseCurve: "linear",
            },
          },
        },
        options
      )
    );

    this.efx = {
      dist: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay({
        delayTime: "8n.",
        feedback: 0.35,
        wet: 0.15,
      }),
      // reverb: new Tone.Freeverb({
      //   dampening: 10000,
      //   roomSize: 0.8,
      //   wet: 0.1,
      // }),
      reverb: new Tone.Reverb({
        // convolver: this.efx.convolver,
        decay: 6,
        preDelay: 0.2,
        wet: 0.25,
      }),
      autoFilter: new Tone.AutoFilter({
        frequency: "1n",
        type: "sine",
        depth: 0.1,
        baseFrequency: 1000,
        octaves: 4,
        filter: {
          type: "lowpass",
          rolloff: -24,
          Q: 1,
        },
      }).start(),
      vibrato: new Tone.Vibrato({
        maxDelay: 0.001,
        frequency: 9,
        depth: 0.3,
        type: "sine",
      }),
      // eq: new Tone.EQ3({
      //   low: 0,
      //   lowFrequency: 130,
      //   mid: -5,
      //   midFrequency: 500,
      //   high: -3,
      //   highFrequency: 2000,
      // }),
    };

    this.efx.reverb.generate();
    this.pattern = options.pattern || patterns.fantasy;
    this.preEfxOut = this.output;
    this.noteIndex = 0;
    this.playing = false;
    this.transport = options.transport || Tone.getTransport();

    return this;
  }

  // this doesn't work for polysynths?
  // static async postInit(synth) {
  //   const postEfxOut = new Tone.Volume();
  //   synth.chain(
  //     synth.efx.vibrato,
  //     synth.efx.dist,
  //     synth.efx.autoFilter,
  //     synth.efx.delay,
  //     synth.efx.reverb,
  //     postEfxOut
  //   );

  //   delete synth.volume;
  //   delete synth.output;
  //   synth.output = postEfxOut;
  //   synth.volume = postEfxOut.volume;
  //   await this.efx.reverb.generate();
  // }

  repeater(time) {
    if (this.pleaseStop) {
      this.pleaseStop = false;
      return;
    }
    let note = this.pattern[this.noteIndex % this.pattern.length];
    this.triggerAttackRelease(note, "8n", time);
    this.noteIndex++;
  }

  start() {
    this.pleaseStop = false;
    this.efx.autoFilter.start();
    this.noteIndex = 0;
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "8n");
  }

  stop() {
    this.pleaseStop = true;
    this.efx.autoFilter.stop();
    if (this.nextEvent) this.transport.cancel(this.nextEvent);
    delete this.nextEvent;
  }

  dispose() {
    for (const effect of Object.values(this.efx)) {
      effect.dispose();
    }
    super.dispose();
  }
}

export default SynthPluck1;
