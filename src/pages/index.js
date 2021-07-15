import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { Provider } from "react-redux";

import { promiseToFlyTo, getCurrentLocation } from "lib/map";

import Layout from "components/Layout";
// import Container from "components/Container";
import Map from "components/Map";
// import Snippet from "components/Snippet";
import SubwayStationsLayer from "../components/SubwayStationsLayer";
import SubwayLinesLayer from "../components/SubwayLinesLayer";

import gatsby_astronaut from "assets/images/gatsby-astronaut.jpg";
import store from "../store"
import polyline from "polyline-encoded";


const LOCATION = {
  lat: 40.7481878,
  lng: -73.9040184
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 10.5;
const MIN_ZOOM = 9;
const bound1 = L.latLng(40.93164311770619, -74.0281309739946)
const bound2 = L.latLng(40.535795875332695, -73.65917370133859)
const MAX_BOUNDS = L.latLngBounds(bound1, bound2)

const timeToZoom = 2000;
const timeToOpenPopupAfterZoom = 4000;
const timeToUpdatePopupAfterZoom = timeToOpenPopupAfterZoom + 3000;

const popupContentHello = `<p>Hello 👋</p>`;
const popupContentGatsby = `
  <div class="popup-gatsby">
    <div class="popup-gatsby-image">
      <img class="gatsby-astronaut" src=${gatsby_astronaut} />
    </div>
    <div class="popup-gatsby-content">
      <h1>Gatsby Leaflet Starter</h1>
      <p>Welcome to your new Gatsby site. Now go build something great!</p>
    </div>
  </div>
`;


/**
 * MapEffect
 * @description This is an example of creating an effect used to zoom in and set a popup on load
 */

const MapEffect = ({ markerRef }) => {
  const map = useMap();

  useEffect(() => {
    if (!markerRef.current || !map) return;

    (async function run() {
      const popup = L.popup({
        maxWidth: 800,
      });

      const location = await getCurrentLocation().catch(() => LOCATION);

      const { current: marker } = markerRef || {};

      marker.setLatLng(location);
      popup.setLatLng(location);
      popup.setContent(popupContentHello);

      setTimeout(async () => {
        await promiseToFlyTo(map, {
          zoom: DEFAULT_ZOOM,
          center: location,
        });

        marker.bindPopup(popup);

        setTimeout(() => marker.openPopup(), timeToOpenPopupAfterZoom);
        setTimeout(
          () => marker.setPopupContent(popupContentGatsby),
          timeToUpdatePopupAfterZoom
        );
      }, timeToZoom);
    })();
  }, [map, markerRef]);

  return null;
};

const ConfigureMap = () => {
  const L = useMap()
  return null
}

const IndexPage = () => {
  // const markerRef = useRef();

  const mapSettings = {
    center: CENTER,
    zoom: DEFAULT_ZOOM,
    maxBounds: MAX_BOUNDS, // this ought to limit ability to zoom out
    bounds: MAX_BOUNDS,
    minZoom: MIN_ZOOM
  };

  console.log(polyline.decode("g_jwFjfqbMUN|@s@yDxMYj@]^]Ta@Jc@@g@Gg@QeAk@g@Qg@Kg@GqLWw@CiAGs@E[AM?aOYm@@sAPgA`@{@p@o@~@c@nAW|AInBMlKE|AKvAQrAeEjUw@bD_AxCeAlCkA`CsAtByAhB_B|Aq@j@e^dWYRWVm@t@i@|@qExKyEjL[`@[T]L_@@a@Ga@Qe@Y_c@i[w@[w@My@C_JJcEJs@@o@Am@IWEsUeHmNuEiAa@i@ScIqDi@WyLaI[O[Iw@E[B]H[Jc[vO]P_@F_@D]?_@E]K_@OeEqCweCeaBcqAyz@c_Cm|AgeAkr@q@a@s@Su@E}HPm@?i@Ie@OgDwBwAkAiGmGw@w@oH_F}@g@au@cX_Ac@wCoBmFkD_@O}@[oXcIcNaDYGu@SkHcCa@Ke@Ec@?oIn@s@@oLg@wAOiIuA_BMq@CsBOcBQw@MgCY[@[D[Ls@b@q@t@q@~@YXs@\\[F_@@_AGi_@aL|D^ECd@_Cd@iC`@wB"))


  return (
    <Provider store={store}>
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <div className="stars"></div>
      <div className="twinkling"></div>

      <Map {...mapSettings} >
        <ConfigureMap />
        <SubwayLinesLayer />
        <SubwayStationsLayer />
        {/* <MapEffect markerRef={markerRef} />
        <Marker ref={markerRef} position={CENTER} /> */}
      </Map>

      {/* <Container type="content" className="text-center home-start">
        <h2>Still Getting Started?</h2>
        <p>Run the following in your terminal!</p>
        <Snippet>
          gatsby new [directory]
          https://github.com/colbyfayock/gatsby-starter-leaflet
        </Snippet>
        <p className="note">
          Note: Gatsby CLI required globally for the above command
        </p>
      </Container> */}
    </Layout>
  </Provider>
  );
};

export default IndexPage;
