import { Listener, Panner3D } from 'tone'

export default class ThreeSpace {
  constructor(sources = [{
    name: '',
    instrument: {},
    lat: 0,
    lon: 0,
  }], listener = {lat: 0, lon: 0}) {
    this.sources = sources.reduce((accum, src) => {
      accum[src.name] = new Panner3D(src.lat, src.lon, 0)
      return accum
    })
    this.listener = Listener(listener.lat, listener.lon, 0)
  }
}
