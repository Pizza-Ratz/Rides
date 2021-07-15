import React from "react"
import transiterReducer, { initialState as transiterInitialState } from '../store/reducers/transiter'
import stationReducer, { initialState as stationInitialState } from '../store/reducers/stations'
import tripReducer, { initialState as tripInitialState } from '../store/reducers/trip'

export const GlobalTransiterContext = React.createContext()
export const GlobalTripContext = React.createContext()
export const GlobalStationContext = React.createContext()

const GlobalContextProvider = ({ children }) => {
  const [transiterState, transiterDispatch] = React.useReducer(transiterReducer, transiterInitialState)
  const [tripState, tripDispatch] = React.useReducer(tripReducer, tripInitialState)
  const [stationState, stationDispatch] = React.useReducer(stationReducer, stationInitialState)
  
  return (
    <GlobalTransiterContext.Provider value={{transiterState, transiterDispatch}}>
      <GlobalTripContext.Provider value={{tripState, tripDispatch}}>
        <GlobalStationContext.Provider value={{stationState, stationDispatch}}>
          {children}
        </GlobalStationContext.Provider>
      </GlobalTripContext.Provider>
    </GlobalTransiterContext.Provider>
  )
}

export default GlobalContextProvider
