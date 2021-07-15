import HoytToTheHeights from "../../data/HoytToTheHeights.directions.json";


export const actionTypes = {
  SEND_DATA: "TRIP_SEND_DATA",
};

const _sendData = (data) => ({
  type: actionTypes.SEND_DATA,
  data
});

export const initialState = { results: HoytToTheHeights };

export default function tripReducer(state = initialState, action) {
  if (action.type === actionTypes.SEND_DATA) {
    return action.results;
  }
  return state;
}
