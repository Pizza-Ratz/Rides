import SubwayStations from "../../data/SubwayStations.geojson.json";
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

export function flattenGeoJSON(ssgj = SubwayStations) {
  return (
    ssgj.features
      .map((station) => ({
        ...station.properties,
        classList: { station: 1 },
        start: false,
        end: false,
        latlng: [
          station.geometry.coordinates[1],
          station.geometry.coordinates[0],
        ], // because lat/lng are given as X/Y in geoJSON
      }))
      // convert array to object with objectid as key
      .reduce((obj, station) => {
        obj[station.objectid] = station;
        return obj;
      }, {})
  );
}

/**
 * maps MTA GTFS station names and IDs from transiter data into stations object.
 * Transiter stations for which we can't find a match in the stations list are dropped.
 */
const enrichStationsFromTransiterStopsList = (stations, transiterList) => {
  transiterList.forEach((stop) => {
    // skip the N/S/E/W directional stations
    if (!stop.id.match(/\d+$/)) return;
    // if unaltered name matches station name in list, we can skip mangling
    if (stations[stop.name]) {
      stations[stop.name].gtfsId = stop.id;
      return;
    }

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
    if (stations[stop.altName]) {
      stations[stop.altName].altName = stop.name;
      stations[stop.altName].gtfsId = stop.id;
    }
  });
};

export const findStationsWithName = (stations, name) => {
  return stations.data.filter((s) => s.name === name || s.altName === name);
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

/** uses lodash.cloneDeep to make a complete copy of state */
const deepCopyStations = (stations) => _.cloneDeep(stations);

/** initial state is the flattened, static SubwayStations.geojson.json */
export const initialState = { data: flattenGeoJSON(SubwayStations) };

const stationReducer = (state = initialState, action) => {
  let freshState = deepCopyStations(state);
  let updated;
  switch (action.type) {
    case actionTypes.MARK_START:
      // un/set start based on whether a station's objectid matches the one in the action
      Object.keys(freshState).map(
        (objectid) =>
          (freshState[action.startId].start = objectid === action.startId)
      );
      return freshState;
    case actionTypes.MARK_END:
      Object.keys(freshState).map(
        (objectid) =>
          (freshState[action.startId].end = objectid === action.endId)
      );
      return freshState;
    case actionTypes.ADD_CLASS:
      console.log(`adding class ${action.cls} to oid ${action.objectid}`);
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
