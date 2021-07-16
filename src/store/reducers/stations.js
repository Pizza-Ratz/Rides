import SubwayStations from '../../data/SubwayStations.geojson.json'
import SubwayStops from '../../data/SubwayStops.json'

export const transiterNYCSubway =
  "https://transiter.mta-music.nyc/systems/us-ny-subway";

export const actionTypes = {
  LOAD_STATIONS: "STATION_LOAD_ALL",
  MARK_START: "STATION_MARK_START",
  MARK_END: "STATION_MARK_END",
};

// mapping from station name to station data
const stationFromName = SubwayStops.reduce((accum, stop) => {
  if (!stop.id.match(/\d+$/)) return accum
  let stopName = stop.name
  // put st/nd/rd/th after street numbers
  for (const match of stopName.matchAll(/(\d+) /g)) {
    let [orig, number] = match
    const lastDigit = number % 10
    if (lastDigit == 1) {
      number = number + 'st'
    } else if (lastDigit == 2) {
      number = number + 'nd'
    } else if (lastDigit == 3) {
      number = number + 'rd'
    } else {
      number = number + 'th'
    }
    stopName = stopName.replaceAll(orig, `${number} `)
  }
  // convert Av -> Ave, Ft -> Fort
  stopName = stopName
    .replaceAll(' Av', ' Ave')
    .replaceAll('-', ' - ')
    .replaceAll('Ft ', 'Fort ')

  accum[stopName] = stop
  return accum
}, {})

// injects MTA station ID into each station feature
const stationsWithId = { ...SubwayStations };
stationsWithId.features = SubwayStations.features.map(f => {
  const station = stationFromName[f.properties.name]
  // console.log(station ? station : f.properties.name)
  if (!station) return { wtf: true }
  return {
    ...f,
    properties: {
      ...f.properties,
      id: station.id,
    },
    geometry: { ...f.geometry, coordinates: [...f.geometry.coordinates] }
  }
}).filter(s => s.properties && s.properties.id)


export const loadStationsAction = (data) => ({
  type: actionTypes.LOAD_STATIONS,
  data
});

export const markStart = (startId) => ({
  type: actionTypes.MARK_START,
  startId
})

export const markEnd = (endId) => ({
  type: actionTypes.MARK_END,
  endId
})

export const loadStations = () => {
  return {data: stationsWithId}
}

export const initialState = {};

const stationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_STATIONS:
      return action.data;
    case actionTypes.MARK_START:
      return {...state, data: {...state.data, features: state.data.features.map(station => {
        if (station.properties && station.properties.id === action.startId) {
          return {...station, properties: {...station.properties, start: true}}
      } else return station
    })}}
    case actionTypes.MARK_END:
      return {...state, data: {...state.data, features: state.data.features.map(station => {
        if (station.properties && station.properties.id === action.endId) {
          return {...station, properties: {...station.properties, end: true}}
      } else return station
    })}}
    default:
      return state
  }
}

export default stationReducer
