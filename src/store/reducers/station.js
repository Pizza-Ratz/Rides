export const transiterNYCSubway =
  "https://transiter.mta-music.nyc/systems/us-ny-subway";

export const actionTypes = {
  LOAD_STATIONS: "STATION_LOAD_ALL",
  LOAD_START: "STATION_LOAD_START",
  LOAD_END: "STATION_LOAD_END",
};

export const stationInitialState = []

const stationReducer = async (state = stationInitialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_STATIONS:
      const response = await fetch(`${transiterNYCSubway}/stops`);
      const stationData = await response.json();
      return stationData;
    case actionTypes.LOAD_START:
      return state.map(station => {
        if (station.id === action.stationId) return {...station, start: true}
        else return station
      })
    case actionTypes.LOAD_END:
      return state.map(station => {
        if (station.id === action.stationId) return {...station, end: true}
        else return station
      })
    default:
      return state
  }
}

export default stationReducer
