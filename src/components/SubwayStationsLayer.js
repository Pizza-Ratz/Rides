import React from "react";
import L from 'leaflet'
import { GeoJSON, useMap } from 'react-leaflet'
import { GlobalStationDispatchContext, GlobalStationStateContext } from "../context/GlobalContextProvider";
import { loadStations, loadStationsAction, markStart, markEnd } from '../store/reducers/stations'

function stationToMarker(station, latlng) {
  const markerStyle = {
    className: 'station',
    radius: 6,
    color: "#BEC2CBB3",
    border: "white",
    riseOnHover: true,
    weight: 1,
    bubblingMouseEvents: true,
  }
  if (typeof window === 'undefined') {
    return null
  }
  return new L.CircleMarker(latlng, markerStyle)
}

const startingStationId = 'A02'
const endingStationId = 'E01'

const SubwayStationsLayer = () => {
  const map = useMap()
  const stationList = React.useContext(GlobalStationStateContext)
  const stationDispatch = React.useContext(GlobalStationDispatchContext)

  React.useEffect(() => {
    stationDispatch(loadStationsAction(loadStations()))
  }, [])

  React.useEffect(() => {
    stationDispatch(markStart(startingStationId))
    stationDispatch(markEnd(endingStationId))
  }, [])

  const popUpStyle = {
    className : 'popupCustom',
    
  }


  const clickHandler = (evt) => {
    // if it's a station that got clicked
    if (evt.originalEvent.target.classList.contains('station') && evt.latlng) {
      map.openPopup(`<img src=${logo} alt="logo" width="100%" height="100%" /><div>➤START</div>`, evt.latlng, popUpStyle)   
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
