import React from "react";
import L from "leaflet";
import logo from "../../src/assets/images/logo.png";
import startOrEndLogo from "../../src/assets/images/start-end-logo.png"
import { GeoJSON, useMap } from "react-leaflet";
import {
  GlobalStationDispatchContext,
  GlobalStationStateContext,
} from "../context/GlobalContextProvider";
import { loadStations, markStart, markEnd } from "../store/reducers/stations";
import "../assets/stylesheets/components/_SubwayStationLayer.scss";

const popUpStyle = {
  className: "popupCustom",
};

const TriangleKnocker = L.icon({
  iconUrl: startOrEndLogo,
  iconSize: [100, 100]
})


function stationToMarker(station, latlng) {
  let className = `station ${station.properties.name} `;
  className += Object.keys(station.properties.classList).join(" ");

  const markerStyle = {
    className,
    color: "#BEC2CBB3",
    border: "white",
    riseOnHover: true,
    weight: 1,
    bubblingMouseEvents: true,
  };
  
  if (station.properties.start) {
    
  }
  // if (station.properties.end) markerStyle.className += " ending";

  if (typeof window === "undefined") {
    return null;
  }

  const marker = new L.CircleMarker(latlng, markerStyle);

  return marker
}

function startEndIcons(station) {

  const startOrEndMarker = new L.marker((station.geometry.coordinates, {icon: TriangleKnocker}))

if (station.properties.start){
  
}

  return startOrEndMarker
}

const SubwayStationsLayer = () => {
  const map = useMap();
  const stationList = React.useContext(GlobalStationStateContext);
  const stationDispatch = React.useContext(GlobalStationDispatchContext);

  function clickHandler(evt) {
    // if it's a station that got clicked
    if (evt.originalEvent.target.classList.contains("station") && evt.latlng) {
      const targetClass = evt.originalEvent.target.className.baseVal;
      const stationName = targetClass
        .replace(/station.*/, "")
        .replace(" - ", "-");
      map.openPopup(
        `<img src=${logo} alt="logo" width="100%" height="100%" /><div>${stationName}</div>`,
        evt.latlng,
        popUpStyle
      );
    }
  }

  React.useEffect(() => {
    stationDispatch(loadStations(stationDispatch));
  }, []);

  React.useEffect(() => {
    if (map) {
      map.addEventListener("click", clickHandler);
    }
  }, [map]);

  return (
    <GeoJSON
      key={stationList.data}
      data={stationList.data}
      pointToLayer={stationToMarker}
      onEachFeature={startEndIcons}
    />
  );
};

export default SubwayStationsLayer;
