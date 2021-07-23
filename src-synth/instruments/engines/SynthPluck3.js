import * as Tone from 'tone'
import { patterns } from "../../lib/Patterns";

class SynthPluck3 extends Tone.Synth {
  constructor(options) {
    super(Object.assign({
      noteIndex: 0,
      volume: -20,
      oscillator: {
        type: 'fmsquare',
        modulationType: 'sine',
        modulationIndex: 2,
        harmonicity: 3
      },
      envelope: {
        attack: 0.05,
        decay: 0.06,
        sustain: 0.15,
        release: 0.1
      },
      filter: {
        Q: 0.3,
        rolloff: -12,
        type: "lowpass",
      },
      filterEnvelope: {
        octaves: 5,
        baseFrequency: 200,
        attack: 0.13,
        decay: 0,
        sustain: 0.5,
        release: 0.15,
      },
    }, options))

    this.efx = {
      autoFilter: new Tone.AutoFilter('1n'),
      dist: new Tone.Distortion(0.05),
      delay: new Tone.FeedbackDelay("8n.", 0.3),
      pan: new Tone.Panner({ 
        pan: 0 
      }),
      reverb: new Tone.Freeverb({
        dampening: 400,
        roomSize: 0.8,
        wet: 0.16,
      }),
      gain: new Tone.Gain(0.1),
    }
    this.efx.delay.wet.value = 0.165;
    this.noteIndex = 0;
    this.playing = false;

    this.chain(this.efx.gain, this.efx.autoFilter, this.efx.delay, this.efx.pan, this.efx.reverb);

    this.pattern = options.pattern || patterns.fantasy
    this.transport = options.transport || Tone.getTransport()
  }

  repeater(time) {
    if (this.pleaseStop) {
      this.pleaseStop = false
      return
    }
    let note = this.pattern[this.noteIndex % this.pattern.length];
    this.triggerAttackRelease(note, "8n", time);
    this.noteIndex++;
  }

  start() {
    this.pleaseStop = false
    this.noteIndex = 0
    this.nextEvent = this.transport.scheduleRepeat((time) => {
      this.repeater(time);
    }, "8n");    
    this.transport.start()
  }

  stop() {
    this.pleaseStop = true
    if (this.nextEvent) this.transport.cancel(this.nextEvent)
  }
}

export default SynthPluck3;