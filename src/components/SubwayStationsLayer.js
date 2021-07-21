import React from "react";
import L from "leaflet";
import logo from "../assets/images/logo.png";
import startOrEndLogo from "../assets/images/start-end-logo.png";
import {
  FeatureGroup,
  Marker,
  CircleMarker,
  Popup,
} from "react-leaflet";
import { /* loadStations, */ markEnd, markStart } from "../store/reducers/stations";
import "../assets/stylesheets/components/_SubwayStationLayer.scss";

let TriangleKnocker = {};

if (typeof window !== "undefined") {
  TriangleKnocker = new L.Icon({
    iconUrl: startOrEndLogo,
    iconRetinaUrl: startOrEndLogo,
    iconSize: [35, 35],
    className: "icon-terminus",
  });
}

function stationWithStyle(station) {
  // if (typeof station.properties.classList !== "object") {
  //   station.properties.classList = {};
  // }
  // delete station.properties.classList.station;
  // station.properties.classList.station = 1;
  // if (station.properties.isStart) station.properties.classList.starting = 1;
  // if (station.properties.isEnd) station.properties.classList.ending = 1;

  return {
    markerStyle: {
      color: "#BEC2CBB3",
      border: "white",
      riseOnHover: true,
      weight: 1,
      bubblingMouseEvents: true,
    },
    classList: station.properties.classList,
    name: station.properties.name,
    latlng: [station.geometry.coordinates[1], station.geometry.coordinates[0]],
    objectid: station.properties.objectid,
    isStart: station.properties.start,
    isEnd: station.properties.end,
  };
}

// represents the content of the thing that pops up when a station is selected
const StationPopup = ({ station, dispatch }) => {
  return (
    <Popup className="station-popup">
      <img src={logo} className="logo" alt="Pizza Ratz logo" />
      <div className="text">
        <h3>{station.name}</h3>
      </div>
      <div className="buttons">
        <button
          className="lower-button"
          onClick={() => dispatch(markStart(station.objectid))}
        >
          🅢🅡🅣
        </button>
        <button
          className="lower-button"
          onClick={() => dispatch(markEnd(station.objectid))}
        >
          🅔🅝🅓
        </button>
      </div>
    </Popup>
  );
};

const SubwayStationsLayer = ({ stations, stationDispatch }) => {
  if (!stations.data.features.length) {
    return <></>;
  }

  // const CENTER = [40.7481878, -73.9040184];

  return (
    <FeatureGroup className="stations">
      {stations.data.features
        .map((s) => stationWithStyle(s))
        .map((station) => {
          let marker;
          if (station.isStart || station.isEnd) {
            console.log(station.classList);
            marker = (
              <Marker
                key={station.objectid}
                icon={TriangleKnocker}
                position={station.latlng}
              >
                <StationPopup station={station} dispatch={stationDispatch} />
              </Marker>
            );
          } else {
            marker = (
              <CircleMarker
                key={station.objectid}
                center={station.latlng}
                pathOptions={{
                  ...station.markerStyle,
                  className: Object.keys(station.classList).join(" "),
                }}
              >
                <StationPopup station={station} dispatch={stationDispatch} />
              </CircleMarker>
            );
          }
          return marker;
        })}
    </FeatureGroup>
  );
};

export default SubwayStationsLayer;
