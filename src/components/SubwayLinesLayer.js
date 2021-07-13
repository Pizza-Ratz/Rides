// see https://leafletjs.com/examples/geojson/ for how this works

import React from "react";
import { GeoJSON } from 'react-leaflet'
import SubwayLines from '../data/SubwayLines.geojson.json'
import SubwayRoutes from '../data/SubwayRoutes.json'

// transforms route ID into CSS color for route
const lineColor = SubwayRoutes.reduce((accum, route) => {
  accum[route.id] = `#${route.color}`
  return accum
}, {})

// uses GeoJSON data to give the subway line its associated color
const styleLine = (line) => {
  return { color: lineColor[line.properties.rt_symbol] };
}


const SubwayLinesLayer = () => (<GeoJSON data={SubwayLines} style={styleLine} />)

export default SubwayLinesLayer;