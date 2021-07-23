import * as Tone from "tone";
import { patterns } from "../../lib/Patterns";
import Debug from "debug";

export default class SynthPluck2 extends Tone.PolySynth {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          voice: Tone.MonoSynth,
          maxPolyphony: 8,
          volume: 0,
          options: {
            oscillator: {
              type: "fmsquare",
              harmonicity: 2.5,
            },
            envelope: {
              attack: 0.03,
              attackCurve: "exponential",
              decay: 0.3,
              decayCurve: "linear",
              sustain: 0,
              release: 0.2,
              releaseCurve: "linear",
            },
            filter: {
              Q: 1,
              rolloff: -24,
              type: "lowpass",
            },
            filterEnvelope: {
              attack: 0,
              attackCurve: "linear",
              baseFrequency: 1200,
              decay: 1,
              exponent: 2,
              octaves: 3,
              release: 3,
              sustain: 1,
            },
          },
        },
        options
      )
    );

    this.logger = Debug("synth:pluck2");

    this.efx = {
      dist: new Tone.Distortion({
        distortion: 0.5,
        wet: 0.06,
      }),
      delay: new Tone.FeedbackDelay({
        delayTime: "8n.",
        feedback: 0.2,
        wet: 0.25,
      }),
      reverb: new Tone.Reverb({
        // convolver: this.efx.convolver,
        decay: 4,
        preDelay: 0.1,
        wet: 0.1,
      }),
      phaser: new Tone.Phaser({
        Q: 0.05,
        frequency: 0.5,
        octaves: 3,
        baseFrequency: 440,
        wet: 0.7,
      }),
      // chorus: new Tone.Chorus({
      //   frequency: 60,
      //   delayTime: 3.5,
      //   depth: 1,
      //   type: "sine",
      //   spread: 180,
      //   wet: 1
      // }),
      eq: new Tone.EQ3({
        low: 0,
        lowFrequency: 130,
        mid: -10,
        midFrequency: 500,
        high: -5,
        highFrequency: 1000,
      }),
      // eq2: new Tone.EQ3({
      //   low: 0,
      //   lowFrequency: 80,
      //   mid: -3,
      //   midFrequency: 400,
      //   high: -5,
      //   highFrequency: 10000
      // })
      // gain: new Tone.Gain(0),
    };

    this.pattern = options.pattern || patterns.prelude;

    this.efx.reverb.generate();
    // this.efx.convolver.connect(this.efx.reverb.convolver);
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
    delete this.nextEvent;
  }

  dispose() {
    for (const effect of Object.values(this.efx)) {
      effect.dispose();
    }
    super.dispose();
  }
}
