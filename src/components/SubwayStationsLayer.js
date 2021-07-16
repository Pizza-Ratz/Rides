import React from "react";
import L from 'leaflet'
import { GeoJSON, useMap } from 'react-leaflet'
import { GlobalStationDispatchContext, GlobalStationStateContext } from "../context/GlobalContextProvider";
import { loadStationsAction, loadStations, markStart, markEnd } from '../store/reducers/stations'

function stationToMarker(station, latlng) {
  const markerStyle = {
    className: 'station',
    fillColor: 'white',
    radius: 10,
    riseOnHover: true,
    bubblingMouseEvents: true,
  }
  if (typeof window === 'undefined') {
    return null
  }
  console.log(station)
  return new L.CircleMarker(latlng, markerStyle)
}

const startingStationId = 'A02'
const endingStationId = 'E01'

const SubwayStationsLayer = () => {
  const map = useMap()
  const stationList = React.useContext(GlobalStationStateContext)
  const stationDispatch = React.useContext(GlobalStationDispatchContext)

  React.useEffect(() => stationDispatch(loadStationsAction(loadStations())), [])
  React.useEffect(() => {
    if (stationList.length) {
      stationDispatch(markStart(startingStationId))
      stationDispatch(markEnd(endingStationId))
    }
  }, [stationList])

  const clickHandler = (evt) => {
    // if it's a station that got clicked
    if (evt.originalEvent.target.classList.contains('station') && evt.latlng) {
      console.log('event', evt)
      map.openPopup('<div>Hello, I am a pop-up</div>', evt.latlng)
    }
  }

  React.useEffect(() => {
    if (map) {
      map.addEventListener('click', clickHandler);
    }
  }, [map])

  return (
    <GeoJSON key={stationList.data} data={stationList.data} pointToLayer={stationToMarker}/>
  )
}

export default SubwayStationsLayer;
