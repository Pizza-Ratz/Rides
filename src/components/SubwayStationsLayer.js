import React from "react";
import L from 'leaflet'
import logo from '../../src/assets/images/logo.png';
import { GeoJSON, useMap } from 'react-leaflet';
import { GlobalStationDispatchContext, GlobalStationStateContext } from "../context/GlobalContextProvider";
import { loadStations, loadStationsAction, markStart, markEnd } from '../store/reducers/stations';
import '../assets/stylesheets/components/_SubwayStationLayer.scss';

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

  if (station.properties.start) markerStyle.className += " starting"
  if (station.properties.end) markerStyle.className += " ending"

  if (typeof window === 'undefined') {
    return null
  }

  const marker = new L.CircleMarker(latlng, markerStyle)
  return marker
}

const startingStationId = 'E01'
const endingStationId = 'A02'


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

  function clickHandler (evt) {
    // if it's a station that got clicked
    if (evt.originalEvent.target.classList.contains('station') && evt.latlng) {
      map.openPopup(`<img src=${logo} alt="logo" width="100%" height="100%" /><div>STATION</div>`, evt.latlng, popUpStyle)   
    }
  }

  React.useEffect(() => {
    if (map) {
      console.log(map)
      map.addEventListener('click', clickHandler);
    }
  }, [map])

  return (
   
    <GeoJSON key={stationList.data} data={stationList.data} pointToLayer={stationToMarker}/>


  )
}

export default SubwayStationsLayer;
