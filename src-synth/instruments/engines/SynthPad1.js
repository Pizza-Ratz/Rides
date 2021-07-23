import * as Tone from "tone";
import { patterns } from "../../lib/Patterns";
import Debug from "debug";

/**
 * A bright FM pad with a gentle attack.
 */
class SynthPad1 extends Tone.PolySynth {
  constructor(options = {}) {
    super(
      Object.assign(
        {
          maxPolyphony: 8,
          volume: 0,
          voice: Tone.MonoSynth,
          options: {
            oscillator: {
              voices: 3,
              detune: 1,
              type: "fatsawtooth",
            },
            envelope: {
              attack: 1,
              decay: 0.5,
              sustain: 0.4,
              release: 1.5,
            },
            filterEnvelope: {
              baseFrequency: 1100,
              attack: 0.8,
              decay: 0,
              sustain: 1,
              release: 1,
            },
          },
        },
        options
      )
    );

    this.efx = {
      delay: new Tone.FeedbackDelay({
        delayTime: "8n.",
        feedback: 0.3,
        wet: 0.2,
      }),
      reverb: new Tone.Reverb({
        // convolver: this.efx.convolver,
        decay: 6,
        preDelay: 0.2,
        wet: 0.8,
      }),
    };

    this.pattern = options.pattern || patterns.eternity;
    this.preEfxOut = this.output;
    this.noteIndex = 0;
    this.preEfxVolume = this.volume;

    this.playing = false;
    this.transport = options.transport || Tone.getTransport();

    return this;
  }

  // async postInit() {
  //   const postEfxVolume = new Tone.Volume();
  //   this.chain(
  //     this.efx.distortion,
  //     this.efx.delay,
  //     this.efx.reverb,
  //     postEfxVolume
  //   );
  //   delete this.volume;
  //   delete this.output;
  //   this.output = postEfxVolume;
  //   this.volume = postEfxVolume.volume;
  //   await this.efx.reverb.generate();
  // }

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

export default SynthPad1