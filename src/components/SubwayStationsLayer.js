import React from "react";
import { GeoJSON } from 'react-leaflet'
import SubwayStations from '../data/SubwayStations.geojson.json'
import SubwayStops from '../data/SubwayStops.json'


// mapping from station name to ID
const stationIdFromName = SubwayStops.reduce((accum, stop) => {
  if (!stop.id.match(/^\d+$/)) return accum
  accum[stop.name] = stop
  return accum
}, {})

const stationsWithId = SubwayStations.features.map(f => {
  if (!stationIdFromName[f.properties.name]) return {}
  return {
    ...f,
    properties: {
      ...f.properties,
      id: stationIdFromName[f.properties.name].id || (() => { throw new Error('station mismatch') })()
    }
  }
}).filter(s => s.id)


const SubwayStationsLayer = () => (<GeoJSON data={stationsWithId} />)

export default SubwayStationsLayer