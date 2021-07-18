import React from "react";
import { Helmet } from "react-helmet";
import Layout from "components/Layout";
import Map from "components/Map";
import SubwayStationsLayer from "../components/SubwayStationsLayer";
import SubwayLinesLayer from "../components/SubwayLinesLayer";

const LOCATION = {
  lat: 40.7481878,
  lng: -73.9040184
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 10.5;
const MIN_ZOOM = 9;
const bound1 = [40.93164311770619, -74.0281309739946]
const bound2 = [40.535795875332695, -73.65917370133859]
const MAX_BOUNDS = [bound1, bound2]

const IndexPage = () => {

  const mapSettings = {
    center: CENTER,
    zoom: DEFAULT_ZOOM,
    draggable: true,
    maxBounds: MAX_BOUNDS,
    // bounds: MAX_BOUNDS,
    minZoom: MIN_ZOOM
  };

  if (typeof window === 'undefined') return null

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
        <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@290;400&display=swap" rel="stylesheet"></link>
      </Helmet>
      <div className="stars"></div>
      <div className="twinkling"></div>
      <Map {...mapSettings} >
        <SubwayLinesLayer />
        <SubwayStationsLayer />
      </Map>
    </Layout>
  );
};

export default IndexPage;
