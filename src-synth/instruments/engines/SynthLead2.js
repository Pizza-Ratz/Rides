import * as Tone from "tone";
import { patterns } from "../../lib/Patterns";

/**
 * An FM synth with a pure tone on top with vibrato and a crunchy 303-like tone on the bottom.
 */
export default class SynthLead2 extends Tone.PolySynth {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          maxPolyphony: 8,
          volume: 0,
          voice: Tone.FMSynth,
          options: {
            harmonicity: 2.5,
            modulationIndex: 10,
            modulationFrequency: 0.5,
            detune: 0,
            oscillator: {
              type: "fmtriangle",
              // voices: 5,
              // width: 0.8,
            },
            envelope: {
              attack: 0.02,
              decay: 0.3,
              decayCurve: "linear",
              sustain: 0.07,
              release: 0.7,
              releaseCurve: "exponential",
            },
            // filter: {
            //   Q: 2,
            //   rolloff: -24,
            //   type: "notch",
            // },
            // filterEnvelope: {
            //   attack: 0.1,
            //   baseFrequency: 1000,
            //   decay: 0.2,
            //   exponent: 2,
            //   octaves: 3,
            //   release: 0.3,
            //   sustain: 0.07,
            // },
          },
        },
        options
      )
    );

    this.pattern = options.pattern || patterns.prelude;

    this.efx = {
      gain: new Tone.Gain(1),
      dist: new Tone.Distortion(0.1),
      delay: new Tone.FeedbackDelay({
        duration: "8n.",
        feedback: 0.35,
        wet: 0.15,
      }),
      // convolver: new Tone.Convolver("../../assets/impulse/Hangar.mp3"),
      reverb: new Tone.Reverb({
        // convolver: this.efx.convolver,
        decay: 3,
        preDelay: 0.1,
        wet: 0.1,
      }),
      // reverb: new Tone.Freeverb({
      //   dampening: 10000,
      //   roomSize: 0.8,
      //   wet: 0.2,
      // }),
      autoFilter: new Tone.AutoFilter({
        frequency: "8n",
        type: "sine",
        depth: 1,
        baseFrequency: 2000,
        octaves: 3,
        filter: {
          type: "lowpass",
          rolloff: -24,
          Q: 0.5,
        },
      }),
      lfo1: new Tone.LFO('8n.', 0, 0.8),
      lfo2: new Tone.LFO('8n.', 5.5, 10),
      vibrato: new Tone.Vibrato({
        maxDelay: 0.002,
        frequency: 5.5,
        depth: 0,
        type: "sine",
      }),
    };

    this.efx.reverb.generate();
    // this.efx.convolver.connect(this.efx.reverb.convolver);
    this.efx.lfo1.connect(this.efx.vibrato.depth);
    this.efx.lfo2.connect(this.efx.vibrato.frequency);
    this.preEfxOut = this.output;
    this.noteIndex = 0;
    this.playing = false;

    this.transport = options.transport || Tone.getTransport();

    return this;
  }

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
    this.noteIndex = 0;
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "8n");
  }

  stop() {
    this.pleaseStop = true;
    if (this.nextEvent) this.transport.cancel(this.nextEvent);
  }

  dispose() {
    for (const effect of Object.values(this.efx)) {
      effect.dispose();
    }
    super.dispose();
  }
}
