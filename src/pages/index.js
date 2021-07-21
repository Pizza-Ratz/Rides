import React from "react";
import { Helmet } from "react-helmet";
import Layout from "components/Layout";
import Map from "components/Map";
import SubwayStationsLayer from "../components/SubwayStationsLayer";
import SubwayLinesLayer from "../components/SubwayLinesLayer";
import {
  GlobalStationDispatchContext,
  GlobalStationStateContext,
} from "../context/GlobalContextProvider";
import { GlobalTripStateContext } from "../context/GlobalContextProvider";
import LightsCameraAction from "../components/ItsReallyHappening";
import ZoomWow from "../components/ZoomWow";
import { loadStations } from "../store/reducers/stations";

const CENTER = [40.7481878, -73.9040184];
const DEFAULT_ZOOM = 10.5;
const MIN_ZOOM = 9;
const bound1 = [40.93164311770619, -74.0281309739946];
const bound2 = [40.535795875332695, -73.65917370133859];
const MAX_BOUNDS = [bound1, bound2];
const HOYT_SCHERMY = [40.68840847580642, -73.98503624034139];

const IndexPage = () => {
  const mapSettings = {
    center: CENTER,
    // zoom: DEFAULT_ZOOM,
    zoom: 5,
    draggable: true,
    // maxBounds: MAX_BOUNDS,
    // minZoom: MIN_ZOOM,
  };
  const stationState = React.useContext(GlobalStationStateContext);
  const stationDispatch = React.useContext(GlobalStationDispatchContext);
  const routeData = React.useContext(GlobalTripStateContext);

  const [clicked, setClicked] = React.useState(false);

  const handleClick = () => {
    setClicked((already) => {
      if (!already) return true;
    });
  };

  React.useEffect(() => {
    stationDispatch(loadStations(stationDispatch));
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@290;400&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
      <div className="stars"></div>
      <div className="twinkling"></div>
      {clicked ? (
        <Map {...mapSettings}>
          <ZoomWow zoom={12} center={HOYT_SCHERMY} when={2000} />
          <SubwayLinesLayer />
          <SubwayStationsLayer
            stations={stationState}
            stationDispatch={stationDispatch}
          />
          <LightsCameraAction
            route={routeData}
            stations={stationState}
            stationDispatch={stationDispatch}
            running={true}
          />
        </Map>
      ) : (
        <div className="clicker" onClick={handleClick}>
          Click anywhere to start
        </div>
      )}
    </Layout>
  );
};

export default IndexPage;
