import React from "react";
import L from "leaflet";
import logo from "../../src/assets/images/logo.png";
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

function stationToMarker(station, latlng) {
  let className = `station ${station.properties.name} `;
  if (typeof station.properties.classList === "object") {
    className += Object.keys(station.properties.classList).join(" ");
  }
  const markerStyle = {
    className,
    color: "#BEC2CBB3",
    border: "white",
    riseOnHover: true,
    weight: 1,
    bubblingMouseEvents: true,
  };

  if (station.properties.start) markerStyle.className += " starting";
  if (station.properties.end) markerStyle.className += " ending";

  if (typeof window === "undefined") {
    return null;
  }

  const marker = new L.CircleMarker(latlng, markerStyle);

  return marker;
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
    />
  );
};

export default SubwayStationsLayer;
