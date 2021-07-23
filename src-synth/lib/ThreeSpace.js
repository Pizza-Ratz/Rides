
import { Listener, Panner3D, Context } from 'tone'

// creates a 3-d environment with latitude, longitude, 
// station name, and instrument attached
export default class ThreeSpace {
  constructor(sources = [{
    name: '',
    instrument: {},
    lat: 0,
    lon: 0,
  }], listener = {lat: 0, lon: 0}) 
  {
    this.sources = sources.reduce((accum, src) => {
      src.panner = new Panner3D(src.lat, src.lon, 0)
      src.instrument.connect(src.panner)
      accum[src.name] = src
      return accum
    })
    this.listener = Listener(listener.lat, listener.lon, 0)
    return this
  }

  // adds a source to the 3-d environment
  addSource(source = { name: '', instrument: {}, lat: 0, lon: 0}) {
    source.panner = new Panner3D(source.lat, source.lon, 0)
    source.instrument.connect(source.panner)
    this.sources[source.name] = source
    return this
  }

  // removes a source from the 3-d environment
  removeSource(sourceName) {
    const source = this.sources[sourceName]
    if (!source) throw new Error('Source doesn\'t exist')
    source.instrument.disconnect(source.panner)
    source.panner.dispose()
    delete this.source[sourceName];
    return this
  }

  // moves the listener in the 3-d environment and 
  // smoothly ramps the panner position
  moveListener(destination = [0, 0], tripTime, startTime = Context.now()) {
    const [ destX, destY ] = destination
    const dX = destX - Listener.positionX.value
    const dY = destY - Listener.positionY.value
    Listener.positionX.rampTo(dX, tripTime, startTime)
    Listener.positionY.rampTo(dY, tripTime, startTime)
  }
}
