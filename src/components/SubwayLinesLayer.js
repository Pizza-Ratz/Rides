// see https://leafletjs.com/examples/geojson/ for how this works

import React from "react";
import L from 'leaflet';
import { GeoJSON, useMap } from "react-leaflet";
import polyUtil from "polyline-encoded";
import SubwayLines from "../data/SubwayLines.geojson.json";
import SubwayRoutes from "../data/SubwayRoutes.json";

// transforms route ID into CSS color for route
const lineColor = SubwayRoutes.reduce((accum, route) => {
  accum[route.id] = `#${route.color}`;
  return accum;
}, {});

const encoded1 =
"ypywFzppbMA?sl@i`@mc@sYwZeSac@kYyZgSe[sS_[oSuL}HKIKIMGKGKGKCMEMCKEMAMAKAM?M?M?uGPK?K?I?K?K?IAKAIAICICICGCICIEGEiCaBKIIGKIKIIGIKKGKIIIIIIKIIKKIKKKaEaEEGGGEEEGGEGGEEIEEGEEIEGEGEGEGEwFuDGEGCGEECGEGEGCGCGEGAECIEGAGCICgOqFgc@{OEEICGAGEICECGEGCGEGCEEECGEECEEgBkASKmEsCEEEEGAGEGCGCECICECGCGAICEAGCGAgXaI}M_DEAEAEAEAGAEAGACAGCEAGAECGAECEAuGyBICGCIAGCGAIAIAG?IAI?GAG?I@I?I@iBNuDXE@E?G@G?E?E@E?E?G?E?G?E?E?GAE?mJa@KAK?I?MAIAIAKAK?ICIAKAKAIAICIA}Bc@A?gCa@IAKCKAKAICM?IAMAKAK?KAKAM?KAK?qAKKAK?IAKAKAK?MCKAKAMCKAMCMAMEMAyBYO?K?M@MBM@MDMFMDKHMHKHMJIJMLINg@r@MJKJKLKFKFMFMDMBMBO?O@O?OAOAOCkDgA{YyIA?iTwEKCICMCICIEKCICIEGEKEICIEGEKEGGqRoM{YySGEGGIIGGIGGIGGGIIIGKEIIIGKGKEKiDgHy@mBEKEKEKGIAKGKEIEICKEICIEKCIEICICKEKEMEKCMEKEMCMEMEMCMEKEMCMCM}Iq]CICGAICGAIEIAGAICGAICGAICIAGAGk@_D@?";
const encoded2 =
"stnwFb`vbMca@yYMGKIMGMEMGMEMCMCMCMCMAO?MAM?O@oIJG?{DJM@K?K?M?I?O?IAK?KAKCK?ICKAKCGCkUaHce@gSA?CCaEkCs]iUa\\eTui@g^A?c[iSwZgS}LeIWMUIUGSESAS@Q@QFSHOJONOPMTOVMZuB|GADkDtKKTMROPKNMJQHMHQDQ@Q@QAQASESISIwS_N@?"
const firstTripPart1 = polyUtil.decode(encoded1);
const firstTripPart2 = polyUtil.decode(encoded2);


// uses GeoJSON data to give the subway line its associated color
const styleLine = (line) => {
  return {
    color: lineColor[line.properties.rt_symbol],
    weight: 3.5,
    border: "10px solid white",
  };
};

const SubwayLinesLayer = () => {
  const map = useMap()

  React.useEffect(() => {
    const latlngs = [firstTripPart1, firstTripPart2];
    const polyline = L.polyline(latlngs, {color: 'white', strokeWeight: 8}).addTo(map)
    return polyline;
  });

  return (
  <GeoJSON data={SubwayLines} style={styleLine} />
  );
};

export default SubwayLinesLayer;
