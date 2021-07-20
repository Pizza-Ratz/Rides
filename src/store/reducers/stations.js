import SubwayStations from "../../data/SubwayStations.geojson.json";
import SubwayStops from "../../data/SubwayStops.json";
import _ from "lodash";

export const transiterNYCSubway =
  "https://transiter.mta-music.nyc/systems/us-ny-subway";

export const actionTypes = {
  LOAD_STATIONS: "STATION_LOAD_ALL",
  LOADING: "STATION_LOADING",
  LOAD_COMPLETE: "STATION_LOAD_OK",
  LOAD_FAILED: "STATION_LOAD_ERROR",
  MARK_START: "STATION_MARK_START",
  MARK_END: "STATION_MARK_END",
  ADD_CLASS: "STATION_ADD_CLASS",
  REMOVE_CLASS: "STATION_REMOVE_CLASS",
};

// mapping from station name to station data
const stationFromName = SubwayStops.reduce((accum, stop) => {
  if (!stop.id.match(/\d+$/)) return accum;
  let stopName = stop.name;
  // put st/nd/rd/th after street numbers
  for (const match of stopName.matchAll(/(\d+) /g)) {
    let [orig, number] = match;
    const lastDigit = number % 10;
    if (lastDigit === 1) {
      number = number + "st";
    } else if (lastDigit === 2) {
      number = number + "nd";
    } else if (lastDigit === 3) {
      number = number + "rd";
    } else {
      number = number + "th";
    }
    stopName = stopName.replaceAll(orig, `${number} `);
  }
  // convert Av -> Ave, Ft -> Fort
  stopName = stopName
    .replaceAll(" Av", " Ave")
    .replaceAll("-", " - ")
    .replaceAll("Ft ", "Fort ");

  // keep track of stations that are named differently in different places
  if (stopName !== stop.name) {
    stop.altName = stop.name;
  }
  accum[stopName] = stop;
  return accum;
}, {});

// inject MTA station ID into each station feature
const stationsWithId = { ...SubwayStations };
stationsWithId.features = SubwayStations.features.map((f) => {
  const station = stationFromName[f.properties.name];
  if (!station) return f;
  return {
    ...f,
    properties: {
      ...f.properties,
      id: station.id,
      altName: station.altName,
      classList: {},
    },
    geometry: { ...f.geometry, coordinates: [...f.geometry.coordinates] },
  };
});
// .filter((s) => s.properties && s.properties.id);

export const findStationsWithName = (name) => {
  return this.features.filter(
    (s) => s.properties.name === name || s.properties.altName === name
  );
};

// const _fetchStarted = () => ({
//   type: actionTypes.LOADING,
// });

// const _fetchCompleted = (data) => ({
//   type: actionTypes.LOAD_COMPLETE,
//   data,
// });

// const _fetchFailed = () => ({
//   type: actionTypes.LOAD_FAILED,
// });

export const markStart = (startId) => ({
  type: actionTypes.MARK_START,
  startId,
});

export const markEnd = (endId) => ({
  type: actionTypes.MARK_END,
  endId,
});

export const addClass = (objectid, cls) => ({
  type: actionTypes.ADD_CLASS,
  objectid,
  cls,
});

export const removeClass = (objectid, cls) => ({
  type: actionTypes.REMOVE_CLASS,
  objectid,
  cls,
});

// asynchronously loads station list; requires dispatch.
export const loadStations = (dispatch) => {
  console.warn("loadStations not implemented");
  // if (typeof dispatch !== 'function') throw new Error('loadStations requires dispatch')
  // // signal that we're loading
  // dispatch(_fetchStarted())
  // // schedule this to run in the background
  // setTimeout(async () => {
  //   const res = await fetch(`${transiterNYCSubway}/stops`)
  //   if (res.status !== 200) {
  //     dispatch(_fetchFailed(res.status))
  //     return
  //   }
  //   const data = await res.json()
  //   dispatch(_fetchCompleted(data))
  // })
  // because otherwise react complains
  return { type: "STATIONS_LS_CALLED" };
};

const deepCopyStations = (stations) => _.cloneDeep(stations);

export const initialState = { data: stationsWithId };

const stationReducer = (state = initialState, action) => {
  let freshState = deepCopyStations(state);
  let updated;
  switch (action.type) {
    case actionTypes.MARK_START:
      return {
        ...state,
        data: {
          ...state.data,
          features: state.data.features.map((station) => {
            if (
              station.properties &&
              station.properties.objectid === action.startId
            ) {
              return {
                ...station,
                properties: { ...station.properties, start: true },
              };
            } else return station;
          }),
        },
      };
    case actionTypes.MARK_END:
      return {
        ...state,
        data: {
          ...state.data,
          features: state.data.features.map((station) => {
            if (
              station.properties &&
              station.properties.objectid === action.endId
            ) {
              return {
                ...station,
                properties: { ...station.properties, end: true },
              };
            } else return station;
          }),
        },
      };
    case actionTypes.ADD_CLASS:
      updated = freshState.data.features.filter(
        (f) => f.properties.objectid === action.objectid
      )[0];
      updated.properties.classList[action.cls] = 1;
      freshState.data.features = freshState.data.features.filter(
        (f) => f.properties.objectid !== action.objectid
      );
      freshState.data.features.push(updated);
      return freshState;
    case actionTypes.REMOVE_CLASS:
      updated = freshState.data.features.filter(
        (f) => f.properties.objectid === action.objectid
      )[0];
      delete updated.properties.classList[action.cls];
      freshState.data.features = freshState.data.features.filter(
        (f) => f.properties.objectid !== action.objectid
      );
      freshState.data.features.push(updated);
      return freshState;
    default:
      return state;
  }
};

export default stationReducer;
