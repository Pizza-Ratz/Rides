export const transiterNYCSubway =
  "https://transiter.mta-music.nyc/systems/us-ny-subway";

export const actionTypes = {
  LOAD_STATIONS: "STATION_LOAD_ALL",
  LOAD_START: "STATION_LOAD_START",
  LOAD_END: "STATION_LOAD_END",
};


const _loadStations = (data) => ({
  type: actionTypes.LOAD_STATIONS,
  data
});


export const initialState = [];

export const loadStations = async (dispatch) => {
    const response = await fetch(`${transiterNYCSubway}/stops/`);
    const stationData = await response.json();
    dispatch(_loadStations(stationData))
};

const stationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_STATIONS:
      return action.data;
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
