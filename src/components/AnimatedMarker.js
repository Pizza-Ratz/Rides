import React from "react";
import Qty from "js-quantities/esm";
import polyUtil from "polyline-encoded";
import { flattenDepth } from "lodash";
import {
  isDomAvailable,
  getStepsFromRoute,
  getStepsMetadata,
} from "../lib/util";
import { useMap } from "react-leaflet";
import { GlobalTripStateContext } from "../context/GlobalContextProvider";

// copied from https://raw.githubusercontent.com/openplans/Leaflet.AnimatedMarker/master/src/AnimatedMarker.js
const setup = () => {
  console.log("setup");
  return window.L.Marker.extend({
    options: {
      // meters
      distance: 200,
      // ms
      interval: 1000,
      // animate on add?
      autoStart: true,
      // callback onend
      onEnd: function () {},
      clickable: false,
    },

    initialize: function (latlngs, options) {
      this.setLine(latlngs);
      window.L.Marker.prototype.initialize.call(this, latlngs[0], options);
    },

    onAdd: function (map) {
      window.L.Marker.prototype.onAdd.call(this, map);

      // Start animating when added to the map
      if (this.options.autoStart) {
        this.start();
      }
    },

    animate: function () {
      var self = this,
        len = this._latlngs.length,
        speed = this.options.interval;

      // Normalize the transition speed from vertex to vertex
      if (this._i < len && this._i > 0) {
        speed =
          (this._latlngs[this._i - 1].distanceTo(this._latlngs[this._i]) /
            this.options.distance) *
          this.options.interval;
      }

      // Only if CSS3 transitions are supported
      if (window.L.DomUtil.TRANSITION) {
        if (this._icon) {
          this._icon.style[window.L.DomUtil.TRANSITION] =
            "all " + speed + "ms linear";
        }
        if (this._shadow) {
          this._shadow.style[window.L.DomUtil.TRANSITION] =
            "all " + speed + "ms linear";
        }
      }

      console.debug("animate: @" + this._latlngs[this._i]);
      // Move to the next vertex
      this.setLatLng(this._latlngs[this._i]);
      this._i++;

      // Queue up the animation to the next next vertex
      this._tid = setTimeout(function () {
        if (self._i === len) {
          self.options.onEnd.apply(self, Array.prototype.slice.call(arguments));
        } else {
          self.animate();
        }
      }, speed);
    },

    // Start the animation
    start: function () {
      console.debug("start", {
        totalDistance: this.options.distance,
        totalTime: this.options.interval,
      });
      this.animate();
    },

    // Stop the animation in place
    stop: function () {
      console.debug("stop");
      if (this._tid) {
        clearTimeout(this._tid);
      }
    },

    setLine: function (latlngs) {
      this._latlngs = latlngs;
      this._i = 0;
    },
  });
};

const AnimatedMarker = ({ running = false }) => {
  const map = useMap();
  const trip = React.useContext(GlobalTripStateContext);
  const [started, setStarted] = React.useState(false);

  console.log("running:" + running, ", started:" + started);

  // set up a new trip whenever we get new directions
  React.useEffect(() => {
    console.log("useEffect");
    // don't do anything if not in the browser
    if (!isDomAvailable()) return;
    // if we don't have good data, don't do anything
    if (!trip.status === "OK") {
      console.debug("no trip data -- skipping marker render");
      return;
    }

    const steps = getStepsFromRoute(trip);
    const vertices = flattenDepth(
      steps.map((s) => polyUtil.decode(s.polyline.points)),
      1
    );
    const metadata = getStepsMetadata(trip);
    // calculate distance in meters
    const unconvertedDistance = new Qty(metadata.distance.text);
    const distance = unconvertedDistance.to("m").format((n) => n);
    // calculate interval in ms
    const interval = metadata.duration.value * 10;
    const polyLine = window.L.polyline(vertices);
    // only set up animation mixin once
    const AnimatedMarkerClass = setup();
    const animatedMarker = new AnimatedMarkerClass(polyLine.getLatLngs(), {
      distance,
      interval,
      autostart: false,
    });

    animatedMarker.start();
    map.addLayer(animatedMarker);

    return () => {
      console.log("useEffect marker teardown");
      if (animatedMarker) {
        map.removeLayer(animatedMarker);
        animatedMarker.stop();
      }
      setStarted(false);
    };
  }, []);

  return <></>;
};

export default AnimatedMarker;
