import subwayStops from '../../data/SubwayStops.json'

export const transiterNYCSubway =
  "https://transiter.mta-music.nyc/systems/us-ny-subway";

export const actionTypes = {
  LOAD_STATIONS: "STATION_LOAD_ALL",
  MARK_START: "STATION_MARK_START",
  MARK_END: "STATION_MARK_END",
};

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
  return {data: subwayStops}
}

export const initialState = [];

const stationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_STATIONS:
      return action.data;
    case actionTypes.MARK_START:
      return state.map(station => {
        if (station.id === action.stationId) return {...station, start: true}
        else return station
      })
    case actionTypes.MARK_END:
      return state.map(station => {
        if (station.id === action.stationId) return {...station, end: true}
        else return station
      })
    default:
      return state
  }
}

export default stationReducer
