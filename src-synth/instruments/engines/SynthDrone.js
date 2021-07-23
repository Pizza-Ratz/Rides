import * as Tone from "tone";
import { Instrument } from "tone/build/esm/instrument/Instrument";

export class FMDrone extends Tone.PolySynth {
  constructor(options) {
    super(
      Object.assign(
        {
          harmonicity: 0.5,
          modulationIndex: 1,
          oscillator: {
            type: "sine",
          },
          envelope: {
            attack: 1 / 4,
            sustain: 1,
            release: 4 - 1,
            attackCurve: "linear",
            releaseCurve: "linear",
          },
          modulation: { type: "sine" },
          modulationEnvelope: {
            attack: 1 * 2,
            sustain: 1,
            release: 4,
            releaseCurve: "linear",
          },
          volume: -30,
        },
        options
      )
    );

    delete this.volume;
    delete this.output;
    this.output = new Tone.Volume();
    this.volume = this.output.volume;

    this.efx = {
      reverb: new Tone.Reverb(),
      chorus: new Tone.Chorus({ frequency: 0.33, depth: 0.7, wet: 0.85 }),
      feedbackDelay: new Tone.FeedbackDelay(),
    };
    this.efx.reverb.generate();

    this.chain(
      this.efx.chorus,
      this.efx.feedbackDelay,
      this.efx.reverb,
      this.output
    );
    return this;
  }

  play(notes, playSeconds, tailSeconds) {
    this.efx.reverb.set({ decay: playSeconds / 4, wet: 0.8 });
    this.efx.feedbackDelay.set({
      delayTime: playSeconds / 16,
      feedback: 0.33,
      wet: 0.66,
    });
    this.set({
      envelope: {
        attack: playSeconds / 4,
        release: tailSeconds - 1,
      },
      modulationEnvelope: {
        attack: playSeconds * 2,
        release: tailSeconds,
      },
    });

    this.triggerAttackRelease(notes, playSeconds);
  }
}

export class FMBells extends Tone.PolySynth {
  constructor() {
    super(Tone.FMSynth, { maxPolyphony: 5 });

    this.set({
      harmonicity: 1.4,
      modulationIndex: 1,
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.6,
        release: 5 - 1,
      },
      modulation: { type: "triangle" },
      modulationEnvelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.6,
        release: 5,
      },
      volume: -30,
    });

    delete this.volume;
    delete this.output;
    this.output = new Tone.Volume();
    this.volume = this.output.volume;

    this.efx = {
      delay: new Tone.FeedbackDelay(),
      flanger: new Tone.FeedbackDelay({
        delayTime: 0.005,
        feedback: 0.1,
        wet: 0.33,
      }),
      reverb: new Tone.Reverb(),
      flangerLFO: new Tone.LFO(1, 0.003, 0.007),
    };
    this.efx.reverb.generate();
    this.efx.flangerLFO.start().connect(this.efx.flanger.delayTime);
    this.chain(this.efx.flanger, this.efx.delay, this.efx.reverb, this.output);
    return this;
  }

  play(notes, playSeconds, tailSeconds) {
    this.efx.delay.set({
      delayTime: playSeconds / 8,
      feedback: 0.88,
      wet: 0.66,
    });
    this.efx.reverb.set({
      decay: playSeconds / 4,
      wet: 0.8,
    });
    this.set({
      envelope: {
        release: tailSeconds - 1,
      },
      modulationEnvelope: {
        release: tailSeconds,
      },
    });
    return this.triggerAttackRelease(notes, playSeconds);
  }
}

export function bounceChord(notes, synthInst, playDuration, tailDuration) {
  let playSeconds = Tone.Time(playDuration).toSeconds();
  let tailSeconds = Tone.Time(tailDuration).toSeconds();
  return Tone.Offline(
    () => synthInst.play(notes, playSeconds, tailSeconds),
    playSeconds + tailSeconds
  );
}

export class DroneMaker extends Instrument {
  constructor(options = {}) {
    super(options);

    const fmDrone = new FMDrone();
    const fmBells = new FMBells();

    this.name = "DroneMaker";
    this.transport = options.transport || Tone.getTransport();

    this.buffers = Promise.all([
      bounceChord(["A#6", "F7", "A#7", "D#8", "F8"], fmDrone, 3, 3),
      bounceChord(["D#5", "A#5", "C6", "G6", "A#6", "C9"], fmDrone, 3, 3),
      bounceChord(["F6", "C6", "D#7", "A#7", "C8"], fmDrone, 3, 3),
      bounceChord(["A#5", "D#6", "G6", "C7", "D#7", "G8"], fmDrone, 3, 3),
      bounceChord(["A#6", "F7", "A#7", "D#8", "F8"], fmBells, 3, 3),
      bounceChord(["D#5", "A#5", "C6", "G6", "A#6", "C9"], fmBells, 3, 3),
      bounceChord(["F6", "C6", "D#7", "A#7", "C8"], fmBells, 3, 3),
      bounceChord(["A#5", "D#6", "G6", "C7", "D#7", "G8"], fmBells, 3, 3),
    ]);

    this.timeCtrl = { value: () => Math.floor(Math.random() * 100) % 18 };

    return this;
  }

  async play() {
    const buffers = await this.buffers;

    function next(time, value) {
      console.log("in next");
      if (this.pleaseStop) {
        this.pleaseStop = false;
        return;
      }
      let droneBuffer = buffers[value];
      let bellBuffer = buffers[4 + value];
      new Tone.BufferSource({ buffer: droneBuffer, playbackRate: 0.125 })
        .connect(this.output)
        .start(time);
      new Tone.BufferSource({ buffer: bellBuffer, playbackRate: 0.125 })
        .connect(this.output)
        .start(time);
    }

    this.pattern = new Tone.Pattern(next, [0, 1, 2, 3], "random");
    this.pattern.humanize = true;
  }

  stop() {
    this.pleaseStop = true;
    this.pattern.dispose();
    delete this.pattern;
  }
}
