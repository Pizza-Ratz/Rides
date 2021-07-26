import React from "react";
import transiter, {
  initialState as transiterInitialState,
} from "./reducers/transiter";
import trip, { initialState as tripInitialState } from "./reducers/trip";
import stations, {
  initialState as stationInitialState,
} from "./reducers/stations";

const combineReducers = (slices) => (state, action) =>
  Object.keys(slices).reduce(
    (acc, prop) => ({
      ...acc,
      [prop]: slices[prop](acc[prop], action),
    }),
    state
  );

const initialState = {
  transiter: transiterInitialState,
  trip: tripInitialState,
  stations: stationInitialState,
};

const rootReducer = combineReducers({ transiter, trip, stations });

const StoreContext = React.createContext();

export const StoreContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(rootReducer, initialState);
  // Important(!): memoize array value. Else all context consumers update on *every* render
  const store = React.useMemo(() => [state, dispatch], [state]);

  return (
    <StoreContext.Provider value={store}> {children} </StoreContext.Provider>
  );
};

export default StoreContext;
