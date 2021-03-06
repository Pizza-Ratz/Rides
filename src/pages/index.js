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
const HOYT_SCHERMY = [40.68840847580642, -73.98503624034139];

const IndexPage = () => {
  const mapSettings = {
    center: CENTER,
    zoom: 5,
    draggable: true,
    // zoom: 10.5,
    // maxBounds: [[40.93164311770619, -74.0281309739946],
    //             [40.535795875332695, -73.65917370133859]];
    // minZoom:  9,
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
        <title>Rides</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@290;400&display=swap"
          rel="stylesheet"
        ></link>
      </Helmet>
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
        <div className="clicker"
        role="presentation"
        onClick={handleClick}
        onKeyDown={handleClick}>
          Click anywhere to start
        </div>
      )}
    </Layout>
  );
};

export default IndexPage;
