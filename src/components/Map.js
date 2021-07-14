import React from "react";
import PropTypes from "prop-types";
import { MapContainer, ZoomControl } from "react-leaflet";

import { useConfigureLeaflet } from "../hooks";
import { isDomAvailable } from "lib/util";

const Map = ({ children, className, ...rest }) => {
  useConfigureLeaflet();

  let mapClassName = `map`;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  if (!isDomAvailable()) {
    return (
      <div className={mapClassName}>
        <p className="map-loading">Loading map...</p>
      </div>
    );
  }

  const mapSettings = {
    className: mapClassName,
    zoomControl: false,
    ...rest,
  };

  return (
    <div className={mapClassName}>
      <MapContainer {...mapSettings}>
        {children}
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
};

Map.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  defaultBaseMap: PropTypes.string,
};

export default Map;
