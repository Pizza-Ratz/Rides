import React from "react";
import { GeoJSON } from 'react-leaflet'
import SubwayStations from '../data/SubwayStations.geojson.json'
import SubwayStops from '../data/SubwayStops.json'
import SubwayRoutes from '../data/SubwayRoutes.json'
import L from 'leaflet'


// mapping from station name to station data
const stationFromName = SubwayStops.reduce((accum, stop) => {
  if (!stop.id.match(/\d+$/)) return accum
  let stopName = stop.name
  // put st/nd/rd/th after street numbers
  for (const match of stopName.matchAll(/(\d+) /)) {
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
    stopName.replaceAll(orig, `${number} `)
  }
  // convert Av -> Ave
  stopName.replaceAll(' Av', ' Ave')
  stopName.replaceAll('-')

  stop.name.replace(/Ft $/, 'Fort ')
  stop.name.replace(/\d{th|rd|st|nd}/, '')
  accum[stop.name] = stop
  return accum
}, {})
console.log(stationFromName)

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
console.log(stationsWithId)

function stationToMarker(station, latlng) {
  const markerStyle = {
    fillColor: 'white',
    radius: 10,
    className: 'station',
  }
  return new L.CircleMarker(latlng, markerStyle)
}

const SubwayStationsLayer = () => (<GeoJSON data={stationsWithId} pointToLayer={stationToMarker} />)

export default SubwayStationsLayer