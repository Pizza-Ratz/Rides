import * as Tone from "tone";
import { patterns } from "../../lib/Patterns";

/**
 * A bright FM pad with a gentle attack.
 */
export default class SynthLead1 extends Tone.PolySynth {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          maxPolyphony: 8,
          volume: 0,
          voice: Tone.DuoSynth,
          options: {
            harmonicity: 0.5,
            voice0: {
              oscillator: { type: "sawtooth" },
              envelope: {
                attack: 2,
                decay: 0,
                sustain: 0,
                release: 3,
              },
              filterEnvelope: {
                baseFrequency: 600,
                attack: 0,
                decay: 0,
                sustain: 0,
                release: 7,
                exponent: 1,
              },
            },
            voice1: {
              oscillator: { type: "sine" },
              envelope: {
                attack: 2,
                decay: 0,
                sustain: 0,
                release: 3,
              },
              // filterEnvelope: {
              //   baseFrequency: 1200,
              //   attack: 0.01,
              //   decay: 0.5,
              //   sustain: 1,
              //   release: 4,
              // },
            },
            vibratoRate: 5,
            vibratoAmount: 0.25,
          }
        },
        options
      )
    );

    this.efx = {
      gain: new Tone.Gain(1),
      dist: new Tone.Distortion(0),
      delay: new Tone.FeedbackDelay({
        delayTime: "8n.",
        feedback: 0.3,
        wet: 0.1,
      }),
      reverb: new Tone.Reverb({
        // convolver: this.efx.convolver,
        decay: 4,
        preDelay: 0.2,
        wet: 0.5,
      }),
      // reverb: new Tone.Freeverb({
      //   dampening: 2000,
      //   roomSize: 0.9,
      //   wet: 0.3,
      // }),
      eq: new Tone.EQ3({
        low: -3,
        lowFrequency: 130,
        mid: -2,
        midFrequency: 600,
        high: 2,
        highFrequency: 5000
      }),
    };

    // this.preEfxVolume = this.volume;
    // const postEfxVolume = new Volume();
    // this.chain(
    //   this.efx.distortion,
    //   this.efx.delay,
    //   this.efx.reverb,
    //   postEfxVolume
    // );

    this.efx.reverb.generate();
    this.pattern = options.pattern || patterns.prelude;
    this.preEfxOut = this.output
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
    this.triggerAttackRelease(note, "4n", time);
    this.noteIndex++;
  }

  start() {
    this.pleaseStop = false;
    this.noteIndex = 0;
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "4n");
  }

  stop() {
    this.pleaseStop = true;
    if (this.nextEvent) this.transport.cancel(this.nextEvent);
  }

  dispose() {
    for (const effect of Object.values(this.efx)) {
      effect.disposed || effect.dispose();
    }
    this.disposed || super.dispose();
  }
}
