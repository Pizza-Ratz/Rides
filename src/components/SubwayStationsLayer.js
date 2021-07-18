import React from "react";
import L from 'leaflet'
import logo from '../../src/assets/images/logo.png';
import { GeoJSON, useMap } from 'react-leaflet';
import { GlobalStationDispatchContext, GlobalStationStateContext } from "../context/GlobalContextProvider";
import { loadStations, loadStationsAction, markStart, markEnd } from '../store/reducers/stations';
import '../assets/stylesheets/components/_SubwayStationLayer.scss';




const startingStationId = 'E01'
const endingStationId = 'A02'


const SubwayStationsLayer = () => {
  const map = useMap()
  const stationList = React.useContext(GlobalStationStateContext)
  const stationDispatch = React.useContext(GlobalStationDispatchContext)

  function stationToMarker(station, latlng) {

    const markerStyle = {
      className: `${station.properties.name} station`,
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

    map.on('zoomstart', function() {
      var currentZoom = map.getZoom();
      var myRadius = currentZoom*(1/4); 
      
      marker.setStyle({radius: myRadius});
  });

    return marker
  }

  

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
      const targetClass = evt.originalEvent.target.className.baseVal;
      const stationName = targetClass.replace(/station.*/, '').replace(' - ', '-')
      map.openPopup(`<img src=${logo} alt="logo" width="100%" height="100%" /><div>${stationName}</div>`, evt.latlng, popUpStyle)
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
