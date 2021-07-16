import React from "react"
import transiterReducer, { initialState as transiterInitialState } from '../store/reducers/transiter'
import stationReducer, { initialState as stationInitialState } from '../store/reducers/stations'
import tripReducer, { initialState as tripInitialState } from '../store/reducers/trip'

export const GlobalTransiterDispatchContext = React.createContext()
export const GlobalTransiterStateContext = React.createContext()
export const GlobalTripDispatchContext = React.createContext()
export const GlobalTripStateContext = React.createContext()
export const GlobalStationDispatchContext = React.createContext()
export const GlobalStationStateContext = React.createContext()

const GlobalContextProvider = ({ children }) => {
  const [transiterState, transiterDispatch] = React.useReducer(transiterReducer, transiterInitialState)
  const [tripState, tripDispatch] = React.useReducer(tripReducer, tripInitialState)
  const [stationState, stationDispatch] = React.useReducer(stationReducer, stationInitialState)

  return (
    <GlobalTransiterDispatchContext.Provider value={transiterDispatch}>
      <GlobalTransiterStateContext.Provider value={transiterState}>
        <GlobalTripDispatchContext.Provider value={tripDispatch}>
          <GlobalTripStateContext.Provider value={tripState}>
            <GlobalStationDispatchContext.Provider value={stationDispatch}>
              <GlobalStationStateContext.Provider value={stationState}>
                {children}
              </GlobalStationStateContext.Provider>
            </GlobalStationDispatchContext.Provider>
          </GlobalTripStateContext.Provider>
        </GlobalTripDispatchContext.Provider>
      </GlobalTransiterStateContext.Provider>
    </GlobalTransiterDispatchContext.Provider>
  )
}

export default GlobalContextProvider
