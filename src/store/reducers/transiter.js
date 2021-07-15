export const transiterNYCSubway =
  "https://transiter.mta-music.nyc/systems/us-ny-subway";

export const actionTypes = {
  LOAD_STATION: "TR_LOAD_STATION",
  LOADING_DATA: "TR_LOADING",
  DATA_LOADED: "TR_LOAD_COMPLETE",
  SET_STATION: "TR_SET_STATION",
};

const _startLoad = () => ({
  type: actionTypes.LOADING_DATA,
});

const _endLoad = () => ({
  type: actionTypes.DATA_LOADED,
});

const _setStation = (station) => ({
  type: actionTypes.SET_STATION,
  station,
});

export const loadStation = (id) => async (dispatch) => {
  let stationData;

  dispatch(_startLoad());
  try {
    const response = await fetch(`${transiterNYCSubway}/stops/${id}`);
    const stationData = await response.json();
  } catch (err) {
    throw err;
  } finally {
    dispatch(_endLoad());
  }

  // error responses have codes
  if (stationData.code) {
    throw new Error(stationData);
  }

  dispatch(_setStation(stationData));
};

export const initialState = {
  loading: false,
  _activeRequests: 0,
  stops: {},
};

export default function transiterReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_STATION:
      return {
        ...state,
        stops: {
          ...state.stops,
          [action.station.id]: { ...action.station, lastUpdate: Date.now() },
        },
      };
    case actionTypes.LOADING_DATA:
      return {
        ...state,
        loading: true,
        _activeRequests: state._activeRequests + 1,
      };
    case actionTypes.DATA_LOADED:
      return {
        ...state,
        _activeRequests: state._activeRequests - 1,
        loading: state._activeRequests - 1 > 0,
      };
    default:
      return state;
  }
}
