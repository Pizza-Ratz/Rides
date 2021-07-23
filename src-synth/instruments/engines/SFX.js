import * as Tone from 'tone'

const loops = {
  stationAmbience: {
    url: "../assets/audio/subway-station-ambience-loopable.mp3",
    loop: true,
    volume: -3,
  },
  rideAmbience: {
    url: "../assets/audio/subway-interior-ambience-loopable.mp3",
    loop: true,
    volume: -10,
  },
  arrival1: {
    url: "../assets/audio/subway-train-arrival.mp3",
    volume: -14,
  },
  arrival2: {
    url: "../assets/audio/subway-train-departure.mp3",
    volume: -14,
  },
  departure: {
    url: "../assets/audio/subway-train-departure.mp3",
    volume: -14,
  },
  announcements1: {
    url: "../assets/audio/subway-ambience-announcements.mp3",
    volume: -7,
  },
  announcements2: {
    url: "../assets/audio/subway-ambience-announcements-2.mp3",
    volume: -7,
  },
  chime: {
    url: "../assets/audio/subway-doors-chime.mp3",
    volume: -6,
  }
}

class SFX extends Tone.Player {
  constructor(options) {
    super(options);

    // if no options were given, load up all the loops
    if (!options) {
      Object.keys(loops).forEach(k => this.add(k, loops[k].url))
      Object.keys(loops).forEach(k => {
        this.player(k).loop = loops[k].loop
        this.player(k).volume = loops[k].volume
      })
    }
  }
}

export default SFX