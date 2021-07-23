import * as Tone from "tone";
import { patterns } from "../../lib/Patterns";

/**
 An FM synth with a pure tone on top with vibrato and a crunchy 303-like tone on the bottom.
 **/
export default class SynthSaw1 extends Tone.PolySynth {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          voice: Tone.MonoSynth,
          maxPolyphony: 8,
          volume: 0,
          options: {
            oscillator: {
              type: "fatsawtooth",
              count: 3,
              spread: 10,
              phase: 30,
            },
            envelope: {
              attack: 0.02,
              decay: 0.2,
              decayCurve: "linear",
              sustain: 0.5,
              release: 0.5,
              releaseCurve: "exponential"
            },
            filter: {
              Q: 0.2,
              rolloff: -24,
              type: "lowpass",
            },
            filterEnvelope: {
              attack: 1,
              baseFrequency: 2000,
              decay: 2,
              exponent: 1,
              octaves: 1.5,
              release: 2,
            },
          },
        },
        options
      )
    );

    this.efx = {
      gain: new Tone.Gain(1),
      dist: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay({
        duration: "8n.",
        feedback: 0.35,
        wet: 0.15,
      }),
      reverb: new Tone.Reverb({
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
        baseFrequency: 500,
        octaves: 3,
        filter: {
          type: "lowpass",
          rolloff: -24,
          Q: 0.5,
        },
      }),
      lfo1: new Tone.LFO('8n.', 0, 0.8),
      lfo2: new Tone.LFO('8n.', 7, 11),
      vibrato: new Tone.Vibrato({
        maxDelay: 0.002,
        frequency: 7,
        depth: 0,
        type: "sine",
      }),
    };

    this.pattern = options.pattern || patterns.alive;
    
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
