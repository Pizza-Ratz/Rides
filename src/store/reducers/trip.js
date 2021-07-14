import HoytToTheHeights from "../../data/HoytToTheHeights.directions.json";


const startingPoint = HoytToTheHeights.routes[0].legs[0].start_location;

console.log(startingPoint)



export const actionTypes = {
  LOAD_ROUTE: "TRIP_LOAD_ROUTE",
  SET_STATION: "TRIP_SET_STATION",
  SEND_DATA: "TRIP_SEND_DATA",
};

const _loadRoute = () => ({
  type: actionTypes.LOAD_ROUTE,
});

const _setStation = (station) => ({
  type: actionTypes.SET_STATION,
  station,
});

const _sendData = () => ({
  type: actionTypes.SEND_DATA,
});

export const getRoute = function () {
  try {
    return function (dispatch) {
      return fetch(HoytToTheHeights).then((response) =>
        dispatch(_loadRoute(response))
      );
    };
  } catch (error) {
    console.log(error);
  }
};

export const sendData = () => async (dispatch) => {
  try {
    const response = await fetch(HoytToTheHeights);
    dispatch(_sendData(response))
  } catch (error) {
    console.log(error);
  };
}

const initialState = {};

export default function tripReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_ROUTE:
      return {
        

      }
    case actionTypes.SET_STATION:
      return {
        
      }
    case actionTypes.SEND_DATA:
      return {
        
      }
    default:
      return state;
  }
}
