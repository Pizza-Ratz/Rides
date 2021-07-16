import React from "react";
import { GeoJSON, useMap } from 'react-leaflet'
import SubwayStations from '../data/SubwayStations.geojson.json'
import SubwayStops from '../data/SubwayStops.json'
import SubwayRoutes from '../data/SubwayRoutes.json'
import L from 'leaflet'


// mapping from station name to station data
const stationFromName = SubwayStops.reduce((accum, stop) => {
  if (!stop.id.match(/\d+$/)) return accum
  let stopName = stop.name
  // put st/nd/rd/th after street numbers
  for (const match of stopName.matchAll(/(\d+) /g)) {
    let [orig, number] = match
    const lastDigit = number % 10
    if (lastDigit == 1) {
      number = number + 'st'
    } else if (lastDigit == 2) {
      number = number + 'nd'
    } else if (lastDigit == 3) {
      number = number + 'rd'
    } else {
      number = number + 'th'
    }
    stopName = stopName.replaceAll(orig, `${number} `)
  }
  // convert Av -> Ave, Ft -> Fort
  stopName = stopName
    .replaceAll(' Av', ' Ave')
    .replaceAll('-', ' - ')
    .replaceAll('Ft ', 'Fort ')

  accum[stopName] = stop
  return accum
}, {})

// injects MTA station ID into each station feature
const stationsWithId = { ...SubwayStations };
stationsWithId.features = SubwayStations.features.map(f => {
  const station = stationFromName[f.properties.name]
  // console.log(station ? station : f.properties.name)
  if (!station) return { wtf: true }
  return {
    ...f,
    properties: {
      ...f.properties,
      id: station.id,
    },
    geometry: { ...f.geometry, coordinates: [...f.geometry.coordinates] }
  }
}).filter(s => s.properties && s.properties.id)

function stationToMarker(station, latlng) {
  const markerStyle = {
    className: 'station',
    radius: 8,
    color: "#BEC2CB8C",
    border: "white",
    riseOnHover: true,
    weight: 1,
    bubblingMouseEvents: true,
  }
  return new L.CircleMarker(latlng, markerStyle)
}

const SubwayStationsLayer = () => {
  const map = useMap()

  const popUpStyle = {
    maxWidth: '400',
    width: '200',
    className : 'popupCustom',
  }

  const clickHandler = (evt) => {
    // if it's a station that got clicked
    if (evt.originalEvent.target.classList.contains('station') && evt.latlng) {
      map.openPopup('<div>START</div>', '<img src="images/ratwlogo2.png"/>', evt.latlng, popUpStyle)      
    }
  }  

  React.useEffect(() => {
    if (map) {
      map.addEventListener('click', clickHandler);
    }
  }, [map])

  return (
    <GeoJSON data={stationsWithId} pointToLayer={stationToMarker}/>
  )
}

export default SubwayStationsLayer;