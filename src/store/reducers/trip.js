import HoytToTheHeights from "../../data/HoytToTheHeights.directions.json";

export const initialState = { results: HoytToTheHeights };

export default function tripReducer(state = initialState) {
  return state;
}
