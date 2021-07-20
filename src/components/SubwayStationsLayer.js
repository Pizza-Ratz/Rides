import React from "react";
import L from "leaflet";
import logo from "../../src/assets/images/logo.png";
import startOrEndLogo from "../../src/assets/images/start-end-logo.png";
import { GeoJSON, useMap } from "react-leaflet";
import {
  GlobalStationDispatchContext,
  GlobalStationStateContext,
} from "../context/GlobalContextProvider";
import { loadStations, markStart, markEnd } from "../store/reducers/stations";
import "../assets/stylesheets/components/_SubwayStationLayer.scss";

// const meow = new Event("meow")

const popUpStyle = {
  className: "popupCustom",
};

const TriangleKnocker = L.icon({
  iconUrl: startOrEndLogo,
  iconSize: [35, 35],
});

function stationToMarker(station, latlng) {
  let stationName = station.properties.name.replaceAll(" ", "*");
  let objectId = station.properties.objectid;
  let className = `station meow${stationName} ${objectId}`;
  className += Object.keys(station.properties.classList).join(" ");

  const markerStyle = {
    className,
    stationName,
    color: "#BEC2CBB3",
    border: "white",
    riseOnHover: true,
    weight: 1,
    bubblingMouseEvents: true,
  };

  if (typeof window === "undefined") {
    return null;
  }

  if (station.properties.start) markerStyle.className += " starting";
  if (station.properties.end) markerStyle.className += " ending";

  const marker = new L.CircleMarker(latlng, markerStyle);

  if (station.properties.start === true || station.properties.end === true) {
    return new L.Marker(latlng, { icon: TriangleKnocker }, markerStyle);
  }

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
      let stationName = targetClass.match(/meow([^\s]+)/)[1];
      // let stationId = evt.originalEvent.target.classList[2]

      stationName = stationName.replaceAll("*", " ");

      map.openPopup(
        `<div class="buttonpop">
        <img src=${logo} alt="logo" width="100%" height="100%" />
        <div class="button-name">${stationName}</div>
        <button class="lower-button">🅢🅡🅣</button> 
        <button class="lower-button">🅔🅝🅓</button>
        <div>`,
        evt.latlng,
        popUpStyle,
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
